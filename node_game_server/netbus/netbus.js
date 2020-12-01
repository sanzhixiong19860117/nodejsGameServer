//===导入部分====
const net = require("net");
const ws = require("ws");

const log = require("../uitls/log");//加载log文件
const tcppkg = require("./tcppkg");

const proto_mgr = require("./proto_mgr");
//====end=======

//用户列表信息
let global_session_list = {};
//用户的key数据
let gloabl_session_key = 1;
//end


//离开事件
function on_session_exit(session) {
    //打印一下
    log.info("session is close");
    session.last_pkg = null;//记录数据位置为null
    if(global_session_list[session.session_key]){
        global_session_list[session.session_key] = null;//清理数据
        delete global_session_list[session.session_key];//删除
        session.session_key = null;
    }
}

//关闭事件
function session_close(session){
    //判断是否是ws
    if(!session.is_ws){
        session.end();
        return;
    }else{
        session.close();
    }
}

//解析事件
function on_session_recv_cmd(session,str_or_buf){
    log.info(str_or_buf);
}

//有客户端进入
function on_session_enter(session,proto_type,is_ws){
    if(is_ws){
        log.info("session enter",session._socket.remoteAddress,session._socket.remotePort);
    }else{
        log.info("session enter",session.remoteAddress,session.remotePort);
    }

    session.last_pkg = null;//我们已经存储了
    session.is_ws = is_ws;
    session.proto_type = proto_type;
    //加入到列表中
    global_session_list[gloabl_session_key] = session;
    session.session_key = gloabl_session_key;
    gloabl_session_key++;
    //end
}

// 发送命令
function session_send(session,cmd){
    if(!session.is_ws){
        let data = tcppkg.package_data(cmd);
        session.write(data);
        return;
    }else{
        session.send(cmd);
    }
}

// 关闭一个session
function session_close(session) {
    if(!session.is_ws){
        session.close();
        return;
    }else{
        session.close();
    }
}

//tcp socket部分
//增加客户端部分
function add_client_session_event(session,proto_type) {
    //监听服务器的关闭事件
    session.on("close",()=>{
        on_session_exit(session);
    })

    //获得数据部分
    session.on("data",data=>{
        //判断他是不是buf数据
        if(!Buffer.isBuffer(data)){
            session_close(session);
            return;
        }

        let last_pkg = session.last_pkg;
        if(last_pkg != null){
            let buf = Buffer.concat([last_pkg,data],last_pkg.length + data.length);
            last_pkg = buf;
        }else{
            last_pkg = data;
        }

        //指针指向
        let offset = 0;
        let pkg_len = tcppkg.read_pkg_size(last_pkg,offset);
        if(pkg_len<0){
            return;
        }

        //判断是否是断包的情况
        while(offset + pkg_len <= last_pkg.length){
            let cmd_buf;

            //如果是完整包
            if(session.proto_type == proto_mgr.PROTO_JSON){
                let json_str = last_pkg.toString("utf8",offset+2,offset+pkg_len);
                if(!json_str){
                    session_close();
                    return;
                }
                on_session_recv_cmd(session,json_str);
            }
            else
            {
                cmd_buf = Buffer.allocUnsafe(pkg_len - 2);//2个信息长度
                last_pkg.copy(cmd_buf,0,offset+2,offset+pkg_len);//赋值整个包的长度
                on_session_recv_cmd(session,cmd_buf);
            }

            offset += pkg_len;
            if(offset >= last_pkg.length){
                //如果指针读取完了以后我们就不在继续读取了
                break;
            }

            pkg_len = tcppkg.read_pkg_size(last_pkg,offset);
            if(pkg_len<0){
                break;
            }
        }

        //处理的数据包完成，保存几个数据包的数据
        if(offset >= last_pkg.length){
            last_pkg = null;
        }else{
            let buf = Buffer.allocUnsafe(last_pkg.length - offset);
            last_pkg.copy(buf,0,offset,last_pkg.length);
        }

        session.last_pkg = last_pkg;
    })
    //end

    session.on("error",err=>{
        log.error("error",err);
    });

    on_session_enter(session,proto_type,false);
}

//启动服务器
function start_tcp_server(ip,port,proto_type){
    log.info("start tcp server..",ip,port);
    let server = net.createServer((client_sock)=>{
        add_client_session_event(client_sock,proto_type);
    });

    //错误的提示
    server.on("error",(err)=>{
        log.error("error",err);
    });

    server.on("close",()=>{
        log.error("server listen close");
    });

    server.listen({
        port:port,
        host:ip,
        exclusive:true,
    })
}
//end

//ws opt
function isString(obj){ //判断对象是否是字符串  
	return Object.prototype.toString.call(obj) === "[object String]";  
}  

//增加ws的客户端的添加
function ws_add_client_session_event(session,proto_type){
    //close事件
    session.on("close",()=>{
        on_session_exit(session);
    });

    //error
    session.on("error",(err)=>{
        log.error("ws server is error",error);
    });
    
    //获得数据
    session.on("message",(data)=>{
        //判断是否是json
        if(session.proto_type == proto_mgr.PROTO_JSON){
            if(!isString(data)){
                session_close(session);
                return;
            }
            on_session_recv_cmd(session,data);
        }
        else{
            if(!Buffer.isBuffer(data)){
                session_close(session);
                return;
            }
            on_session_recv_cmd(session,data);
        }
    });
    on_session_enter(session,proto_type,true);
}

//启动ws操作
function start_ws_server(ip,port,proto_type) {
    log.info("start ws server ..", ip, port,proto_type);
	var server = new ws.Server({
		host: ip,
		port: port,
	});

	function on_server_client_comming (client_sock) {
		ws_add_client_session_event(client_sock, proto_type);
	}
	server.on("connection", on_server_client_comming);

	function on_server_listen_error(err) {
		log.error("ws server listen error!!");
	}
	server.on("error", on_server_listen_error);

	function on_server_listen_close(err) {
		log.error("ws server listen close!!");
	}
	server.on("close", on_server_listen_close);
}
//end

//导出对应的方法
const netbus = {
    start_tcp_server : start_tcp_server,
    start_ws_server : start_ws_server,
    session_send : session_send,
    session_close : session_close,
};

module.exports = netbus;