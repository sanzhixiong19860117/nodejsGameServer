const log4js = require('log4js');
log4js.configure({
    appenders: {
        ruleConsole: { type: 'console' },
        ruleFile: {
            type: 'dateFile',//可以是console,dateFile,file,Logstash等
            filename: '../output/server-',//将会按照filename和pattern拼接文件名
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '时间:%d{yyyy-MM-dd hh:mm:ss,SSS}%n级别:[%p]%n消息:%m%n------------------------------------'
            }
        }
    },
    categories: {
        default: { appenders: ['ruleConsole', 'ruleFile'], level: 'info' },
        wifi: { appenders: ['ruleFile'], level: 'all' }
    }
});

module.exports = log4js.getLogger('wifi');
  