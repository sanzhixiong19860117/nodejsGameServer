//对所对应的数据进行解码，编码
const log = require("../uitls/log");
const proto_tools = require("../netbus/proto_tools.js");//发送消息的封装

//导出表
const proto_mgr = {
    PROTO_JSON: 1,  
	PROTO_BUF: 2,
	// 全局的命令号，当我们的用户丢失链接的时候，
	// 所有的服务都会收到网关转发过来的这个时间这个消息

	encode_cmd: encode_cmd,
	decode_cmd: decode_cmd,
	reg_decoder: reg_buf_decoder,
	reg_encoder: reg_buf_encoder,

	decrypt_cmd: decrypt_cmd,
	encrypt_cmd: encrypt_cmd,

	decode_cmd_header: decode_cmd_header,
};//表

const decoders = {};//解码集合
const encoders = {};//编码结合

//解密
function decrypt_cmd(str_of_buf){
    log.info("decrypt_cmd");
    return str_of_buf;
}

//加密
function encrypt_cmd(str_of_buf){
    log.info("encrypt_cmd");
    return str_of_buf;
}

//key的操作
function get_key(stype,ctype){
    return stype*65535 + ctype;
}

//解析头
function decode_cmd_header(str_or_buf){
    let cmd = {};
    //判断是否数据操作
    if(str_or_buf.length < proto_tools.header_size){
        return null;
    }
    cmd[0] = proto_tools.read_int16(str_or_buf,0);
    cmd[1] = proto_tools.read_int16(str_or_buf,2);
    cmd[2] = proto_tools.read_int16(str_or_buf,4);
    cmd[3] = proto_tools.read_int16(str_or_buf,8);
    return cmd;
}

//json打包操作
//stype 服务器的号码
//ctype 对应的功能号码
//body  对应的是发送的数据 
function _json_encode(stype,ctyps,body) {
    let cmd = {};                   //2020-12-3把前两段改成二进制的操作
    cmd[0] = body;
    let str = JSON.stringify(cmd);  //解析生下来的操作
    log.warn("_json_encode",str);
    let cmd_buf = proto_tools.encode_str_cmd(stype,ctyps,str);
    return cmd_buf;
}

//解码
function _json_decode(cmd_buf){
    //解析
    let cmd = proto_tools.decode_str_cmd(cmd_buf);  //解析相关
    let cmd_json = cmd[2];                        //字符串
    try {
        let body_set = JSON.parse(cmd_json);
        cmd[2] = body_set[0];
    } catch (error) {
        return null;
    }

    if(!cmd || 
        cmd[0] == "undefined" || 
        cmd[1] == "undefined" || 
        cmd[2]=="undefined"){
        log.error("proto_mgr._json_decode is error",cmd)
        return null;
    }

    return cmd;
}
//end

//二进制
function encode_cmd(utag,proto_type,stype,ctype,body){
    var buf = null;
	if (proto_type == proto_mgr.PROTO_JSON) {
		buf = _json_encode(stype, ctype, body);
	}
	else { // buf协议
		var key = get_key(stype, ctype);
		if (!encoders[key]) {
			return null;
		}
		buf = encoders[key](stype, ctype, body);
	}
	proto_tools.write_utag_inbuf(buf, utag);
	proto_tools.write_prototype_inbuf(buf, proto_type);
	return buf;
}

//解码
function decode_cmd(proto_type,stype,ctype,body){
    log.info("proto_mgr.decode_cmd=",body)
    //判断数据是否小于整个头字节
    if(body.length < proto_tools.header_size){
        return null;
    }

    if(proto_type == proto_mgr.PROTO_JSON){
        return _json_decode(body)
    }

    let buf = null;
    let key  = get_key(stype,ctype);
        
    //没有找到
    if(!decoders[key]){
        return null;
    }
    buf = decoders[key](body)
    return buf;
}

//二进制注册
function reg_buf_encoder(stype,ctype,encode_fun){
    let key = get_key(stype,ctype);
    if(encoders[key]){
        log.warn("proto_mgr.reg_buf_encoder is have key",key);
        return;
    }
    encoders[key] = encode_fun;
}

//解码
function reg_buf_decoder(stype,ctype,encode_fun) {
    let key = get_key(stype,ctype);
    if(decoders[key]){
        log.warn("proto_mgr.reg_buf_decoder is have key",key);
        return;
    }
    decoders[key] = encode_fun;
}

module.exports = proto_mgr;