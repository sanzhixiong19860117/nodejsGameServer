//聊天的服务器的接口
const proto_mgr = require("../../netbus/proto_mgr.js");
const proto_tools = require("../../netbus/proto_tools.js");
const log = require("../../uitls/log.js");

function decode_enter_talkroom(cmd_buf) {
	var cmd = {};
	cmd[0] = proto_tools.read_int16(cmd_buf, 0);
	cmd[1] = proto_tools.read_int16(cmd_buf, 2);
	var body = {};
	var ret = proto_tools.read_str_inbuf(cmd_buf, proto_tools.header_size);
	body.uname = ret[0];
	var offset = ret[1];
	body.usex = proto_tools.read_int16(cmd_buf, offset);
	cmd[2] = body;

	return cmd;
}

function decode_exit_talkroom(cmd_buf) {
	var cmd = {};
	cmd[0] = proto_tools.read_int16(cmd_buf, 0);
	cmd[1] = proto_tools.read_int16(cmd_buf, 2);
	cmd[2] = null;
	return cmd;
}

function encode_send_msg_return_talkroom(stype, ctype, body) {
	if (body[0] != 1) {
		return proto_tools.encode_status_cmd(stype, ctype, body[0]);
	}

	var uname_len = body[1].utf8_byte_len();
	var msg_len = body[3].utf8_byte_len();
	var total_len = proto_tools.header_size + 2 + 2 + uname_len + 2 + msg_len + 2;
	var cmd_buf = proto_tools.alloc_buffer(total_len);

	var offset = proto_tools.write_cmd_header_inbuf(cmd_buf, 1, 5);
	proto_tools.write_int16(cmd_buf, offset, body[0]);
	offset += 2;

	offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[1], uname_len);
	proto_tools.write_int16(cmd_buf, offset, body[2]);
	offset += 2;
	offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[3], msg_len);

	log.info(cmd_buf);
	return cmd_buf;
}

function encode_user_enter(stype, ctype, body) {
	var uname_len = body.uname.utf8_byte_len();
	var total_len = proto_tools.header_size + 2 + uname_len + 2;

	var cmd_buf = proto_tools.alloc_buffer(total_len);
	var offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
	offset = proto_tools.write_str_inbuf(cmd_buf, offset, body.uname, uname_len);
	proto_tools.write_int16(cmd_buf, offset,  body.usex);

	return cmd_buf;
}

function encode_user_exit(stype, ctype, body) {
	var uname_len = body.uname.utf8_byte_len();
	var total_len = proto_tools.header_size + 2 + uname_len + 2;

	var cmd_buf = proto_tools.alloc_buffer(total_len);
	var offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
	offset = proto_tools.write_str_inbuf(cmd_buf, offset, body.uname, uname_len);
	proto_tools.write_int16(cmd_buf, offset,  body.usex);

	return cmd_buf;
}

function encode_use_msg(stype, ctype, body) {
	var uname_len = body[0].utf8_byte_len();
	var msg_len = body[2].utf8_byte_len();
	var total_len = proto_tools.header_size + 2 + uname_len + 2 + msg_len + 2;

	var cmd_buf = proto_tools.alloc_buffer(total_len);

	var offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);

	offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[0], uname_len);
	proto_tools.write_int16(cmd_buf, offset, body[1]);
	offset += 2;
	offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[2], msg_len);
	log.info(cmd_buf);
	
	return cmd_buf;
}

proto_mgr.reg_encoder(1, 1, proto_tools.encode_status_cmd);
proto_mgr.reg_encoder(1, 2, proto_tools.encode_status_cmd);
proto_mgr.reg_encoder(1, 5, encode_send_msg_return_talkroom);

proto_mgr.reg_encoder(1, 3, encode_user_enter);
proto_mgr.reg_encoder(1, 4, encode_user_exit);
proto_mgr.reg_encoder(1, 6, encode_use_msg);

proto_mgr.reg_decoder(1, 1, decode_enter_talkroom);
proto_mgr.reg_decoder(1, 2, decode_exit_talkroom);
proto_mgr.reg_decoder(1, 5, proto_tools.decode_str_cmd);