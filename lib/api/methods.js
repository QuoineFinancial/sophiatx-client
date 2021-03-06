"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = [{
    "method": "about"
}, {
    "method": "info"
}, {
    "method": "help"
}, {
    "method": "get_witness",
    "params": ["nameOfThewitness"]
}, {
    "method": "list_witnesses",
    "params": ["lowerbound", "limit"]
}, {
    "method": "get_block",
    "params": ["blockNum"]
}, {
    "method": "get_ops_in_block",
    "params": ["blockNum", "onlyVirtual"]
}, {
    "method": "get_feed_history",
    "params": ["symbol"]
}, {
    "method": "get_account",
    "params": ["name"]
}, {
    "method": "get_transaction",
    "params": ["trxId"]
}, {
    "method": "create_simple_transaction",
    "params": ["tx"]
}, {
    "method": "get_transaction_digest",
    "params": ["tx"]
}, {
    "method": "sign_digest",
    "params": ["digest", 'private_key']
}, {
    "method": "add_signature",
    "params": ["tx", 'sign']
}, {
    "method": "get_account_name_from_seed",
    "params": ["seed"]
}, {
    "method": "account_exist",
    "params": ["account_name"]
}, {
    "method": "get_account_history",
    "params": ["account", "from", "limit"]
}, {
    "method": "get_active_authority",
    "params": ["account_name"]
}, {
    "method": "get_owner_authority",
    "params": ["account_name"]
}, {
    "method": "get_memo_key",
    "params": ["account_name"]
}, {
    "method": "get_account_balance",
    "params": ["account_name"]
}, {
    "method": "get_vesting_balance",
    "params": ["account_name"]
}, {
    "method": "calculate_fee",
    "params": ["op", "symbol"]
}, {
    "method": "add_fee",
    "params": ["op", "fee"]
}];