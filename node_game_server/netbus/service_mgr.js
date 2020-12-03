//服务器类
//导入
const log = require("../uitls/log.js");
const poto_mgr = require("../netbus/proto_mgr.js");
const proto_mgr = require("../netbus/proto_mgr.js");

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
    //需要加密
    if(session.is_encrypt){
        str_or_buf = proto_mgr.encrypt_cmd(str_or_buf);
    }

    let stype,ctype,body;
    var cmd = proto_mgr.decode_cmd_header(session.proto_type,str_or_buf);
    if(!cmd){
        return false;
    }
    
    log.error("stype=",cmd[0])

    stype = cmd[0];
    ctype = cmd[1];

    
    if(!service_modules[stype]){
        return false;
    }

    if(service_modules[stype].is_transfer){
        service_modules[stype].on_rev_player_cmd(seesion,ctype,null,str_or_buf);
        return true;
    }
    //end

    //根据我们的制定解码
    var cmd = poto_mgr.decode_cmd(session.proto_type,str_or_buf);
    if(!cmd){
        return false;
    }

    body = cmd[2];
    service_modules[stype].on_rev_player_cmd(session,ctype,body,str_or_buf);
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
