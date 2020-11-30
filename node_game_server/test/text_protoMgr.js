const log = require("../uitls/log");
const netbus = require("../netbus/netbus");
const proto_mgr = require("../netbus/proto_mgr");


let data = {
    uname:"black",
    upasd:"123456",
};

let json = proto_mgr.encode_cmd(netbus.PROTO_JSON,1,1,data);
log.info(json)
log.error("length = ",json.length);

let json_str = proto_mgr.decode_cmd(netbus.PROTO_JSON,json);
log.info(json_str);

//二进制 打包
function encode_cmd_1_1(body) {
    let stype = 1;
    let ctype = 1;
    //整个长度=服务号+消息号+数据1的长度+数据2的长度+2+2;
    let total_len = 2+2+body.uname.length+body.upasd.length+2+2;
    let buf = Buffer.allocUnsafe(total_len);//分配内存
    buf.writeInt16LE(stype,0);//写入到内存中0,1
    buf.writeInt16LE(ctype,2);//2,3
    //写入对应的数据
    buf.writeInt16LE(body.uname.length,4);//4开始
    buf.write(body.uname,6);

    let offset = 6 + body.uname.length;
    buf.writeInt16LE(body.upasd.length,offset);
    buf.write(body.upasd,offset+2);
    return buf;
}

//解析二进制
function decode_cmd_1_1(cmd_buf){
    let stype = 1;
    let ctype = 1;
    let uname_len = cmd_buf.readInt16LE(4);
    if((uname_len+2+2+2)>cmd_buf.length){
        return null;
    }

    let uname = cmd_buf.toString("utf8",6,6+uname_len);
    if(!uname){
        return null;
    }

    let offset = 6 + uname_len;
    let upwd_len = cmd_buf.readInt16LE(offset);
    if((upwd_len + 2 + offset)>cmd_buf.length){
        return null;
    }

    let upwd = cmd_buf.toString("utf8",offset + 2,offset + 2 + upwd_len);
    let cmd = {
        0:1,
        1:1,
        2:{
            "uname":uname,
            "upwd":upwd,
        }
    };
    return cmd;
}

proto_mgr.reg_buf_encoder(1,1,encode_cmd_1_1);
proto_mgr.reg_buf_decoder(1,1,decode_cmd_1_1);

let proto_cmd_buf = proto_mgr.encode_cmd(netbus.PROTO_BUF,1,1,data);
log.info(proto_cmd_buf);
log.error(proto_cmd_buf.length);
cmd = proto_mgr.decode_cmd(netbus.PROTO_BUF,proto_cmd_buf);
log.info(cmd);