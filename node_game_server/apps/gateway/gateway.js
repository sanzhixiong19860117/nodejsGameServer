require("../../init.js");

const game_config = require("../game_config.js");
const proto_mgr = require("../../netbus/proto_mgr.js");
const netbus = require("../../netbus/netbus.js");
const service_mgr = require("../../netbus/service_mgr.js");

//读取配置
const host = game_config.gateway_config.host;
const ports = game_config.gateway_config.ports;

//启动
netbus.start_tcp_server(host,ports[0],proto_mgr.PROTO_BUF,true);
netbus.start_tcp_server(host,ports[1],proto_mgr.PROTO_JSON,true);

netbus.start_ws_server(host,ports[2],proto_mgr.PROTO_JSON,true);
netbus.start_ws_server(host,ports[3],proto_mgr.PROTO_BUF,true);

const game_server = game_config.game_server;

for(let key in game_server){
    //连接配置服务器
    netbus.connect_tcp_server(game_server[key].stype,
        game_server[key].host,
        game_server[key].port,
        proto_mgr.PROTO_BUF,false
    )
}