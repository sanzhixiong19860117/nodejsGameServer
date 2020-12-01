//模板 类似于抽象类
const service = {
    stype:1,//服务号
    name:"service templet",

    //初始化
    init:function(){
    },

    //每个服务器收到消息
    on_rev_player_cmd:function(session,ctype,body){ 
    },

    //每个服务连接丢失后调用
    on_player_discommect:function(session){},
}

module.exports = service;