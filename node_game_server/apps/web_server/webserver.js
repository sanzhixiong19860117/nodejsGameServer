//导入操作
const express = require("express");
const path = require("path");
//创建对象
const app = express();
//静态的操作

//改变相对的路径
process.chdir("./apps/web_server");
app.use(express.static(path.join(process.cwd(),"www_root")));

//启动参数进行控制 根据传入的数据进行操作
if(process.argv.length<3){
    console.log("node webserver.js port is null");
    return;
}

const port = process.argv[2];
//监听

app.listen(port,()=>{
    console.log("server is statr port="+port);
})
