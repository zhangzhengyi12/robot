/**
 * Created by zhang on 2017-07-30.
 */

let colors = require('./color'),
    readline = require('readline'),
    http = require('http');

const wellText = "我是菠萝油王子"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const API_KEY = "919c296a12994612a4ddac7b47dba958";

const RESPONSE_TYPE = {
    TEXT: 100000,
    LINK: 200000,
    NEWS: 302000
}

//欢迎使用

function welcome(text) {
    colors.colorLog("[----------]")
    text.split("").forEach((s)=>{
        colors.colorLog("[----"+s+"----]")
    })
    colors.colorLog("[----------]")
}
function initChat() {
    welcome(wellText)

//读取第一行
    
    let name = ""
    
    rl.question("> 输入你的姓名： ",(anwser)=>{
        name = anwser
        colors.colorLog("请提问")
        chat()
    })

//交流部分
    function chat() {
        rl.question("> 你： ",(query)=>{
            if(!query){
                colors.colorLog("再见！")
                process.exit(0)
            }
            
            let promiseHttp = httpPromiseify(http.request,http)
            
            promiseHttp({
                hostname:"www.tuling123.com",
                path:"/openapi/api",
                method:"post",
                headers: {
                    'Content-Type': 'application/json'
                }
            },(req)=>{
                req.write(JSON.stringify({
                    "key":API_KEY,
                    "info":query,
                    "loc":"嘉兴市",
                    "userid":name
                }))
            }).then((data)=>{
                colors.colorLog(handleRespon(data))
                chat();
            })
        })
        
    }
}




function handleRespon(data) {
    let res = JSON.parse(data);
    switch(res.code) {
        case RESPONSE_TYPE.TEXT:
            return res.text;
        case RESPONSE_TYPE.LINK:
            return `${res.text} : ${res.url}`;
        case RESPONSE_TYPE.NEWS:
            let listInfo = '';
            (res.list || []).forEach((it) => {
                listInfo += `\n文章: ${it.article}\n来源: ${it.source}\n链接: ${it.detailurl}`;
            });
            return `${res.text}\n${listInfo}`;
        default:
            return res.text;
    }

}


//

function httpPromiseify(fn,ctx) {
    return function (headObj,writeFuc) {
        return new Promise((resolve,reject)=>{
            let allArgs = [headObj].concat((res)=>{
                let data = ""
                res.on("data",(chunk)=>{
                    data += chunk
                })
                res.on("end",()=>{
                    resolve(data)
                })
            })
            let req = fn.apply(ctx||this,allArgs)
            writeFuc.call(null,req)
            req.end()
        })
    }
}

module.exports = initChat;
