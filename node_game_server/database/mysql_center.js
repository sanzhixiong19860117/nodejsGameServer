/**
 * 中心数据库部分
 */
const mysql = require("mysql");

let conn_pool = null;

function connect_to_center(host,port,db_name,uname,upwd) {
    let conn_pool = mysql.createPool({
        host:host,
        port:port,
        database:db_name,
        user:uname,
        password:upwd
    });
}


module.exports = {
    connect:connect_to_center,
}