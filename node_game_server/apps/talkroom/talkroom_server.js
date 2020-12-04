require("../../init.js");

const proto_mgr = require("../../netbus/proto_mgr");
const netbus = require("../../netbus/netbus.js");
const service_mgr = require("../../netbus/service_mgr");
const talk_room = require("../../netbus/module/talk_room.js");

netbus.start_tcp_server("127.0.0.1",6084,proto_mgr.PROTO_BUF,false);
netbus.start_tcp_server("127.0.0.1",6085,proto_mgr.PROTO_JSON,false);

service_mgr.register_service(1,talk_room)