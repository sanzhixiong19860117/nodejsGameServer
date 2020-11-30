let tcppkg = {
    //根据包协议读取长度
    read_pkg_size:function(pkg_data,offset){
        //参数1是数据，参数2是指针
        if(offset>pkg_data.length - 2){
            return -1;
        }

        let len = pkg_data.readUInt16LE(offset);
        return len;
    },

    package_data:function(data){
        let buf = Buffer.allocUnsafe(2+data.length);//创建数据模块
        buf.writeInt16LE(2+data.length,0);
        buf.fill(data,2);
        return buf
    }
}

module.exports = tcppkg;//导出