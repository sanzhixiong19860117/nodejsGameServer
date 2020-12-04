const netbus = require("../../netbus/netbus.js");
const proto_tools = require("../../netbus/proto_tools.js");
const proto_mgr = require("../../netbus/proto_mgr");
const log = require("../../uitls/log.js");

const service = {
    name:"gw_service",  //服务器名字
    is_transfer:true,   //是否为转发模块
    on_recv_player_cmd:function(session,stype,ctype,body,utag,proto_type,raw_cmd){
        log.info(raw_cmd);
		var server_session = netbus.get_server_session(stype);
		if (!server_session) {
			return;
		}

		// 打入能够标识client的utag, uid, session.session_key,
		utag = session.session_key;
		proto_tools.write_utag_inbuf(raw_cmd, utag);
		// end 
		server_session.send_encoded_cmd(raw_cmd);
    },

    //收到我们连接服务给我们发过来的数据
    on_recv_server_return:function(session,stype,ctype,body,utag,proto_type,raw_cmd){
        log.info("on_recv_erver_return",raw_cmd);
        let client_session = netbus.get_client_session(utag);
        if(!client_session){
            return;
        }
        proto_tools.clear_utag_inbuf(raw_cmd);
        client_session.send_encoded_cmd(raw_cmd);
    },

    //收到客户端主动断开的协议
    on_player_disconnect:function(stype,session){
        let server_session = netbus.get_server_session(stype);
        if(!server_session){
            return;
        }

        let utag = session.session_key;
        server_session.send_cmd(stype,proto_mgr.GWDisconnect,null,utag,proto_mgr.PROTO_JSON);
    }
}

module.exports = service;