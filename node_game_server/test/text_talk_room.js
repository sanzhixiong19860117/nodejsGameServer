//聊天js

const log = require("../uitls/log.js");     //log

require("../netbus/talk_room_proto.js");

let service = {
    type:1,
    name:"talk room",
    init:function(){
        log.info(this.name+"service statr");
    },

    //每个服务器收到消息调用
    on_rev_player_cmd:function(session,ctype,body){
        log.info(this.name+"on_recv_player_cmd",ctype);
    },

    //每个服务器丢失后调用
    on_player_discommect:function(session){
        log.info(this.name+"on_player_discommect",session.session_key);
    }
}

module.exports = service;