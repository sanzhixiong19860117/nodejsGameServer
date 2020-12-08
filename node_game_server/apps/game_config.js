let Stype = require("./Stype.js");

let game_config = {
    //网关的操作
    gateway_config:{
        host:"127.0.0.1",
        ports:[6080,6081,6082,6083],
    },

    //中心服务器
    center_server:{
        host:"127.0.0.1",
        port:6086,
        types:[Stype.Auth],
    },

    //中心数据库
    center_database:{
        host:"127.0.0.1",
        port:3306,
        da_name:"bycw_center",
        uname:"root",
        upwd:"sanzhixiong"
    },

    //游戏的服务配置
    game_server:{
        0:{
            stype:Stype.TalkRoom,
            host:"127.0.0.1",
            port:6084,
        },
        1:{
            stype:Stype.Auth,
            host:"127.0.0.1",
            port:6086,
        }
    }
}

module.exports = game_config;