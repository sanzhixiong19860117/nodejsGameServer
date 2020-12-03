//聊天js

const log = require("../../uitls/log.js");     //log
const porto_mgr = require("../../netbus/proto_mgr");
require("../module/talk_room_proto.js");
const net_treaty = require("./net_treaty.js");//协议

//进入游戏部分
let room = {};//用户的操作
function on_user_enter_talkroom(session,body){
    log.info("enter_talkroom");
    //首先判断是否有对应的数据
    if(!body.uname || !body.usex){
        session.send_cmd(net_treaty.talk.stype_talk_room,net_treaty.talk.talkCmd.Enter,net_treaty.talk.respones.INVALTD_OPT);
        return;
    }
    //是否在聊天室
    if(room[session.session_key]){
        session.send_cmd(net_treaty.talk.stype_talk_room,net_treaty.talk.talkCmd.Enter,net_treaty.talk.respones.IS_IN_TALKROOM)
        return;
    }

    //单独发送给我们自己的客户端我们进来了
    session.send_cmd(net_treaty.talk.stype_talk_room,net_treaty.talk.talkCmd.Enter,net_treaty.talk.respones.OK);

    //广播操作
    broadcast_cmd(net_treaty.talk.talkCmd.UserArrived,body,session);

    //对所有人发送我们的刚进来的用户
    for(let key in room){
        session.send_cmd(net_treaty.talk.stype_talk_room,net_treaty.talk.UserArrived,room[key].uinfo);
    }

    //保存用户信息
    var talkman = {
        session:session,
        uinfo:body,
    };
    room[session.session_key] = talkman;
}

//离开
function on_user_exit_talkroom(session,is_dei){
    //如果不在聊天室不用发送消息
    if(!room[session.session_key] || !is_dei){
        session.send_cmd(net_treaty.talk.stype_talk_room,net_treaty.talk.talkCmd.Exit,net_treaty.talk.NOT_IN_TALKROOM);
        return;
    }

    //广播
    broadcast_cmd(net_treaty.talk.talkCmd.Exit,room[session.session_key].uinfo,session);

    //删除聊天室
    room[session.session_key] = null;
    delete room[session.session_key];
    //end

    //发送命令你已经离开
    if(!is_dei){
        session.send_cmd(net_treaty.talk.stype_talk_room,net_treaty.talk.talkCmd.Exit,net_treaty.talk.respones.OK);
    }
}

//广播
function broadcast_cmd(ctype,body,note_user){
    let json_encode = null;
    for(let key in room){
        if(room[key] == note_user){
            continue;
        }
        let session = room[key].session;
        if(json_encode == null){
            json_encode = porto_mgr.encode_cmd(porto_mgr.PROTO_JSON,net_treaty.talk.stype_talk_room,ctype,body);
        }
        session.send_encoded_cmd(json_encode);
    }
}

//发送信息
function on_user_send_msg(session,msg){
    //判断在不在聊天室
    if(!room[session.session_key]){
        session.send_cmd(net_treaty.talk.stype_talk_room,net_treaty.talk.talkCmd.SendMsg,{
            0:net_treaty.talk.respones.INVALTD_OPT
        })
        log.error("on_user_send_msg is error")
        return;
    };

    //发送成功
    session.send_cmd(net_treaty.talk.stype_talk_room,{
        0:net_treaty.talk.respones.OK,
        1:room[session.session_key].uinfo.uname,
        2:room[session.session_key].uinfo.usex,
        3:msg
    });

    //发送其他人
    broadcast_cmd(net_treaty.talk.talkCmd.UserMsg,{
        0:room[session.session_key].uinfo.uname,
        1:room[session.session_key].uinfo.usex,
        2:msg
    },session);
    //end
}

let service = {
    type:net_treaty.talk.stype_talk_room,
    name:"talk room",
    init:function(){
        log.info(this.name+"service statr");
    },

    //每个服务器收到消息调用
    on_rev_player_cmd:function(session,ctype,body,raw_cmd){
        switch (ctype) {
            case net_treaty.talk.talkCmd.Enter:
                on_user_enter_talkroom(session,body);    
            break;
            case net_treaty.talk.talkCmd.Exit:
                on_user_exit_talkroom(session,false);
            break;
            case net_treaty.talk.talkCmd.SendMsg:
                on_user_send_msg(session,body);
            break;
        }
    },

    //每个服务器丢失后调用
    on_player_discommect:function(session){
        log.info(this.name+"on_player_discommect",session.session_key);
        on_user_exit_talkroom(session,true);
    }
}

module.exports = service;