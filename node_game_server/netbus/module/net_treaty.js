//协议的文件
let net_treaty = {
    //聊天操作
    talk:{
        stype_talk_room:1,
        talkCmd:{
            Enter:1,                //用户进入
            Exit:2,                 //用户离开
            UserArrived:3,          //别人进来
            UserExit:4,             //被人出去

            SendMsg:5,              //发送消息
            UserMsg:6,              //别人收到消息
        },
        respones:{
            OK:1,                   //成功
            IS_IN_TALKROOM:-100,    //已经在聊天室的
            NOT_IN_TALKROOM:-101,   //玩家不在聊天
            INVALTD_OPT:-102,       //玩家非法操作
            INVALTD_PPARAWS:-103    //命令格式不对
        }
    }
    //end
}

module.exports = net_treaty;