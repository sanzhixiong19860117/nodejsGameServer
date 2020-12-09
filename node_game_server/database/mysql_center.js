/**
 * 中心数据库部分
 */
const mysql = require("mysql");
const util = require("util")

let conn_pool = null;

//连接数据库
function connect_to_center(host,port,db_name,uname,upwd) {
    let conn_pool = mysql.createPool({
        host:host,
        port:port,
        database:db_name,
        user:uname,
        password:upwd
    });
}

//数据库的操作
function mysql_exec(sql,callback) {
    conn_pool.getConnection(function(err,conn){
        if(err){
            if(callback){
                callback(err,null,null);
            }
            return;
        }
        conn.query(sql,function(sql_err,sql_result,fields_desic){
            conn.release();
            if(sql_err){
                if(callback){
                    callback(sql_err,null,null);
                }
                return;
            }
            if(callback){
                callback(null,sql_result,fields_desic);
            }
        });
    });
}

function get_guest_uinfo_by_ukey(ukey,callback) {
    const sql = "select id,unick,usex,uface,uvip,status from uinfo status where guest_key=\"%s\"";
    const sql_cmd = util.format(sql,ukey);
    mysql_exec(sql_cmd,function(err,sql_ret,fields_desic){
        if(err){
            callback(Response.SYSTEM_ERR,null);
            return;
        }
        callback(Response.ok,sql_ret);
    });
}

function insert_guest_user(unick,uface,usex,ukey,callback){
    const sql = "insert into uinfo('guest','unick','uface,'usex')values(\"%s\", \"%s\", %d, %d)";
    const sql_cmd = util.format(sql,ukey,unick,uface,usex);

    mysql_exec(sql_cmd,function(err,sql_ret,fields_desic){
        if(err){
            callback(Response.SYSTEM_ERR);
            return;
        }
        callback(Response.ok);
    });
}

module.exports = {
    connect: connect_to_center,
	get_guest_uinfo_by_ukey: get_guest_uinfo_by_ukey, 
	insert_guest_user: insert_guest_user,
}