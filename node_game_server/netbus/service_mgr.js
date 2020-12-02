//服务器类
//导入
const log = require("../uitls/log.js");
const poto_mgr = require("../netbus/proto_mgr.js");

const service_modules = {};//模块对象

//注册模块
function register_service(stype,service){
    if(service_modules[stype]){
        log.warn("serivce_mgr.register_service service_modules have it");
    }
    service_modules[stype] = service;
    service.init();//初始化
}

//命令解析
function on_rev_clinet_cmd(session,str_or_buf){
    //根据我们的制定解码
    let cmd = poto_mgr.decode_cmd(session.proto_type,str_or_buf);
    if(!cmd){
        return false;
    }

    let stype,ctype,body;
    stype = cmd[0];
    ctype = cmd[1];
    body = cmd[2];

    //查看模块是否注册
    if(!service_modules[stype]){
        return false;
    }

    service_modules[stype].on_rev_player_cmd(session,ctype,body);
    return true;
}

//客户端掉线
function on_client_lost_connect(session){
    //在注册模块里面寻找是否存在
    for(let key in service_modules){
        service_modules[key].on_player_discommect(session);
    }
}


//对象
serivce_mgr = {
    register_service:register_service,                  //注册模块
    on_client_lost_connect:on_client_lost_connect,      //离开模块
    on_rev_clinet_cmd:on_rev_clinet_cmd,                //命令解析
};
module.exports = serivce_mgr;
