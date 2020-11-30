//对所对应的数据进行解码，编码
const log = require("../uitls/log");
const netbus = require("./netbus");

const proto_mgr = {};//表

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



proto_mgr.json_decode = _json_decode;
proto_mgr.json_encode = _json_encode;
module.exports = proto_mgr;