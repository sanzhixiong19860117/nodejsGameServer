let Stype = require("./Stype.js");

let game_config = {
    //网关的操作
    gateway_config:{
        host:"127.0.0.1",
        ports:[6080,6081,6082,6083],
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