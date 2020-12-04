require("../../init.js");

const netbus = require("../../netbus/netbus.js");
const service_mgr = require("../../netbus/service_mgr");
const talk_room = require("./talk_room.js");

netbus.start_tcp_server("127.0.0.1",6084,false);
netbus.start_tcp_server("127.0.0.1",6085,false);

service_mgr.register_service(1,talk_room)