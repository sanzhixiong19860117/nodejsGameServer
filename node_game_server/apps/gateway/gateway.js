require("../../init.js");

const game_config = require("../game_config.js");
const proto_mgr = require("../../netbus/proto_mgr.js");
const netbus = require("../../netbus/netbus.js");
const service_mgr = require("../../netbus/service_mgr.js");
const service = require("../../netbus/service_template.js");
const gw_service = require("./gw_server.js");


//读取配置
const host = game_config.gateway_config.host;
const ports = game_config.gateway_config.ports;

//启动
netbus.start_tcp_server(host,ports[0],true);
netbus.start_ws_server(host,ports[1],true);

// 连接我们的服务器
const game_server = game_config.game_server;
for(let key in game_server){
    //连接配置服务器
    netbus.connect_tcp_server(game_server[key].stype,
        game_server[key].host,
        game_server[key].port,
        proto_mgr.PROTO_BUF,false
    );
    service_mgr.register_service(game_server[key].stype,gw_service);
}