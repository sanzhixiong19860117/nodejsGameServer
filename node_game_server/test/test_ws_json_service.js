const ws = require("ws");
const proto_mgr = require("../netbus/proto_mgr.js");
const log = require("../uitls/log.js")

let sock = new ws("ws://127.0.0.1:6082");

sock.on("open",()=>{
    let cmd_buf = proto_mgr.encode_cmd(proto_mgr.PROTO_JSON,1,2,"hello talk room form ws!!!!!");
    sock.send(cmd_buf);
})

sock.on("error",(err)=>{
    log.error("websocket is error");
})

sock.on("close",()=>{
    log.error("websocket client is close!!!!");
})

sock.on("message",(data)=>{
    log.info(data);
})