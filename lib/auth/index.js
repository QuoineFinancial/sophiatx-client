'use strict';

var _brain_key = require('./ecc/src/brain_key');

var bigi = require('bigi'),
    bs58 = require('bs58'),
    ecurve = require('ecurve'),
    Point = ecurve.Point,
    _aes = require('./ecc/src/aes'),
    secp256k1 = ecurve.getCurveByName('secp256k1'),
    config = require('../config'),
    KeyPrivate = require('./ecc/src/key_private'),
    PublicKey = require('./ecc/src/key_public'),
    hash = require('./ecc/src/hash');

var signature = require('./ecc/src/signature');

var Auth = {};
/**
 * @param privatekey of sender
 * @param publickey of receiver
 * @param message
 * @returns {*}
 */
Auth.encrypt = function (privatekey, publickey, message) {
  return bs58.encode((0, _aes.encrypt)(privatekey, publickey, message));
};
/**
 * @param privatekey of receiver
 * @param publickey of sender
 * @param message encrypted
 * @returns {*}
 */
Auth.decrypt = function (privatekey, publickey, message) {
  var messagestring = bs58.decode(message);
  return (0, _aes.decrypt)(privatekey, publickey, messagestring).toString();
};
/**
 * @param name
 * @param password
 * @param auths
 * @returns {boolean}
 */
Auth.verify = function (name, password, auths) {
  var hasKey = false;
  var roles = [];
  for (var role in auths) {
    roles.push(role);
  }
  var pubKeys = this.generateKeys(name, password, roles);
  roles.forEach(function (role) {
    if (auths[role][0][0] === pubKeys[role]) {
      hasKey = true;
    }
  });
  return hasKey;
};

/**
 * @param name - blockchain account name
 * @param password - very strong password typically no shorter than a private key
 * @returns {*}
 */
Auth.generatePublicKey = function (name, password) {
  var seed = name + password;
  var brainKey = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
  var hashSha256 = hash.sha256(brainKey);
  var bigInt = bigi.fromBuffer(hashSha256);
  var toPubKey = secp256k1.G.multiply(bigInt);
  var point = new Point(toPubKey.curve, toPubKey.x, toPubKey.y, toPubKey.z);
  var pubBuf = point.getEncoded(toPubKey.compressed);
  var checksum = hash.ripemd160(pubBuf);
  var addy = Buffer.concat([pubBuf, checksum.slice(0, 4)]);
  var pubKeys = config.get('address_prefix') + bs58.encode(addy);
  return pubKeys;
};

/**
	@arg {string} name - blockchain account name
	@arg {string} password - very strong password typically no shorter than a private key
    @returns {*}
*/

Auth.getKeyPair = function (name, password) {
  var privKeys = {};
  privKeys['private'] = this.toWif(name, password);
  privKeys['public'] = this.wifToPublic(privKeys['private']);
  return privKeys;
};
/**
 * @param privWif
 * @returns {boolean}
 */
Auth.isWif = function (privWif) {
  var isWif = false;
  try {
    var bufWif = new Buffer(bs58.decode(privWif));
    var privKey = bufWif.slice(0, -4);
    var checksum = bufWif.slice(-4);
    var newChecksum = hash.sha256(privKey);
    newChecksum = hash.sha256(newChecksum);
    newChecksum = newChecksum.slice(0, 4);
    if (checksum.toString() == newChecksum.toString()) {
      isWif = true;
    }
  } catch (e) {}
  return isWif;
};
/**
 @arg {string} name - blockchain account name
 @arg {string} password - very strong password typically no shorter than a private key
 @returns {*}
 */
Auth.toWif = function (name, password) {
  var seed = name + password;
  var brainKey = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
  var hashSha256 = hash.sha256(brainKey);
  var privKey = Buffer.concat([new Buffer([0x80]), hashSha256]);
  var checksum = hash.sha256(privKey);
  checksum = hash.sha256(checksum);
  checksum = checksum.slice(0, 4);
  var privWif = Buffer.concat([privKey, checksum]);
  return bs58.encode(privWif);
};
/**
 *
 * @param privWif
 * @param pubWif
 * @returns {boolean}
 */
Auth.wifIsValid = function (privWif, pubWif) {
  return this.wifToPublic(privWif) == pubWif;
};
/**
 * @param privWif
 * @returns {*}
 */
Auth.wifToPublic = function (privWif) {
  var pubWif = KeyPrivate.fromString(privWif);
  pubWif = pubWif.toPublic().toString();
  return pubWif;
};
/**
 * @param pubkey
 * @param address_prefix
 * @returns {boolean}
 */
Auth.isPubkey = function (pubkey, address_prefix) {
  return PublicKey.fromString(pubkey, address_prefix) != null;
};
/**
 * @param digest
 * @param privateKey
 * @returns {*}
 */
Auth.createSignature = function (digest, privateKey) {
  return signature.signHash(digest, privateKey).toHex();
};

/**
 * @param brain_key
 * @returns {*}
 */
Auth.normalizeBrainKey = function (brain_key) {
  try {
    var phrase = (0, _brain_key.normalize)(brain_key).toString();
    return phrase;
  } catch (err) {
    console.log(err);
  }
};
module.exports = Auth;