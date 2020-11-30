//对所对应的数据进行解码，编码
const log = require("../uitls/log");
const netbus = require("./netbus");

const proto_mgr = {};//表

const decoders = {};//解码集合
const encoders = {};//编码结合

//key的操作
function get_key(stype,ctype){
    return stype*65535 + ctype;
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
    if(proto_type == netbus.PROTO_JSON){
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
    if(proto_type == netbus.PROTO_JSON){
        buf = _json_decode(body)
        return buf;
    }
    let stype = body.readUInt16LE(0);//从0开始读取
    let ctype = body.readUInt16LE(2);//从第二个开始读取
    let key  = get_key(stype,ctype);

    //没有找到
    if(decoders[key]){
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

proto_mgr.decode_cmd = decode_cmd;
proto_mgr.encode_cmd = encode_cmd;

proto_mgr.reg_buf_decoder = reg_buf_decoder;
proto_mgr.reg_buf_encoder = reg_buf_encoder;
module.exports = proto_mgr;