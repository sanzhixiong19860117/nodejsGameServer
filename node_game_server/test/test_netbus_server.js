const netbus = require("../netbus/netbus.js");
const proto_mgr = require("../netbus/proto_mgr.js");
const service_mgr = require("../netbus/service_mgr");
const talk_room = require("./text_talk_room.js");


netbus.start_tcp_server("127.0.0.1", 6080, proto_mgr.PROTO_BUF);
netbus.start_tcp_server("127.0.0.1", 6081, proto_mgr.PROTO_JSON);
netbus.start_ws_server("127.0.0.1", 6082, proto_mgr.PROTO_JSON);
netbus.start_ws_server("127.0.0.1", 6083, proto_mgr.PROTO_BUF);

service_mgr.register_service(1,talk_room);
