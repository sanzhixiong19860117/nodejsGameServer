//模板 类似于抽象类
const service = {
    stype:1,//服务号
    name:"service templet",
    is_transfer:false,//是否是转发模块

    //每个服务器收到消息
    on_rev_player_cmd:function(session,ctype,body,utag,proto_type,raw_cmd){ 
    },

    //收到我们连接的服务器给我们发过来的数据
    on_recv_server_return:function(session,ctype,body,utag,proto_type,raw_cmd){    
    },

    //每个服务连接丢失后调用
    on_player_discommect:function(stype,session){},
}

module.exports = service;