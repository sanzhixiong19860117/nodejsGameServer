//对所对应的数据进行解码，编码
const log = require("../uitls/log");

//导出表
const proto_mgr = {
    PROTO_JSON:1,
    PROTO_BUF:2,
    
    decode_cmd : decode_cmd,
    encode_cmd : encode_cmd,

    decrypt_cmd:decrypt_cmd,
    encrypt_cmd:encrypt_cmd,

    reg_buf_decoder : reg_buf_decoder,
    reg_buf_encoder : reg_buf_encoder,

    decode_cmd_header:decode_cmd_header,
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
function decode_cmd_header(proto_type,str_or_buf){
    
    let cmd = {};
    if(proto_type == proto_mgr.PROTO_JSON){
        let json_cmd = _json_decode(str_or_buf);
        log.info("decode_cmd_header",json_cmd);
        cmd[0] = json_cmd[0];
        cmd[1] = json_cmd[1];//解析头
    }
    
    return cmd;
}

//json打包操作
//stype 服务器的号码
//ctype 对应的功能号码
//body  对应的是发送的数据 
function _json_encode(stype,ctyps,body) {
    let cmd = {};
    cmd[0] = stype;
    cmd[1] = ctyps;
    cmd[2] = body;
    return JSON.stringify(cmd);
}

//解码
function _json_decode(jsonbuf){
    let jsonObj = JSON.parse(jsonbuf);
    if(!jsonObj || jsonObj[0] == "undefined" 
        || jsonObj[1] == "undefined" || jsonObj[2]=="undefined"){
            log.error("proto_mgr._json_decode is error",jsonObj)
            return null;
    }
    return jsonObj;
}
//end

//二进制
function encode_cmd(proto_type,stype,ctype,body){
    //第一步算总长度
    let buf = null;
    if(proto_type == proto_mgr.PROTO_JSON){
        //如果是json
        buf = _json_encode(stype,ctype,body);
        log.info("encode_cmd=",proto_type,buf);
        return buf;
    }
    //获得唯一的key
    let key = get_key(stype,ctype);
    if(!encoders[key]){
        return;
    }
    buf = encoders[key](body);
    return buf;
}

//解码
function decode_cmd(proto_type,body){
    let buf = null;
    if(proto_type == proto_mgr.PROTO_JSON){
        buf = _json_decode(body)
        return buf;
    }
    let stype = body.readUInt16LE(0);//从0开始读取
    let ctype = body.readUInt16LE(2);//从第二个开始读取
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