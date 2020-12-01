var netbus = require("../netbus/netbus.js");
const proto_mgr = require("../netbus/proto_mgr.js");


//netbus.start_tcp_server("127.0.0.1", 6080, proto_mgr.PROTO_BUF);
// netbus.start_tcp_server("127.0.0.1", 6080, proto_mgr.PROTO_JSON);
// netbus.start_ws_server("127.0.0.1", 6081, proto_mgr.PROTO_JSON);
netbus.start_ws_server("127.0.0.1", 6081, proto_mgr.PROTO_JSON);
