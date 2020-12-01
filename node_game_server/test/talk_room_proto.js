//解析talk类
const proto_mgr = require("../netbus/proto_mgr");

//打包二进制数据
function encode_cmd_1_1(body){
    //服务号
    let stype = 1;
    let ctype = 1;

    let total_len = 2 + 2 + body.uname.length + body.upwd.length + 2 + 2;
    let buf = Buffer.allocUnsafe(total_len);                                //分配内存
    buf.writeUInt16LE(stype,0);
    buf.writeUInt16LE(ctype,2);
    //字符串写入
    buf.writeUInt16LE(body.uname.length,4);
    buf.write(body.uname,6);

    let offset = 6 + body.upws.length;                                      //需要开辟的长度
    buf.writeUInt16LE(body.upwd.length,offset);
    buf.write(body.upwd,offset + 2);
    return buf;
}

//解析二进制
function decode_cmd_1_1(cmd_buf){
    let stype = 1;
    let ctype = 1;

    //先读取4个字节看是不是有数据
    let uname_len = cmd_buf.readUInt16LE(4);
    if((uname_len + 2 + 2 + 2) > cmd_buf.length){
        return null;
    }
    //end

    let uname = cmd_buf.toString("utf8",6,6 + uname_len);
    if(!uname){
        return null;
    }

    let offset = 6 + uname_len;
    let upwd_len = cmd_buf.readUInt16LE(offset);
    if((offset + upwd_len + 2) > cmd_buf.length){
        return null;
    }

    //读取数据
    let upwd = cmd_buf.toString("utf8",offset + 2,offset + 2 + upwd_len);

    //组装的操作
    let cmd = {
        0:1,
        1:1,
        2:{
            "uname":uname,
            "upwd":upwd
        }
    }

    return cmd;
}

proto_mgr.reg_buf_encoder(1,1,encode_cmd_1_1);
proto_mgr.reg_buf_decoder(1,1,decode_cmd_1_1);