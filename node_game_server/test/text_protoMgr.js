const log = require("../uitls/log");
const netbus = require("../netbus/netbus");
const proto_mgr = require("../netbus/proto_mgr");


let data = {
    uname:"black",
    upasd:"123456",
};

let json = proto_mgr.json_encode(1,1,data);
log.info(json)
log.error("length = ",json.length);

let json_str = proto_mgr.json_decode(json);
log.info(json_str);