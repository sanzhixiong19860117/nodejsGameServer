require("../../init.js");
var game_config = require("../game_config.js");
var netbus = require("../../netbus/netbus.js");
var service_mgr = require("../../netbus/service_mgr.js");
var Stype = require("../Stype.js");

const auth_service = require("./auth_service.js")

const center = game_config.center_server;
netbus.start_tcp_server(center.host,center.port,false);
service_mgr.register_service(Stype.Auth,auth_service);

//连接中心数据库
const mysql_center = require("../../database/mysql_center.js");
mysql_center.connect(
    game_config.center_database.host,
    game_config.center_database.port,
    game_config.center_database.da_name,
    game_config.center_database.uname,
    game_config.center_database.upwd,
);

