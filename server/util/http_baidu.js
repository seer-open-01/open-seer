var https = require('https');
var querystring = require('querystring');
var ACCESS_TOKEN = "14_MdbH-Go4_saCrsFqvmK8dROTjz5_WjRS9u3dZXNjj0aND1kfl7XNqUxYCB4kHOr4eHTzpjsKslLpwfk0Mu4frCLBd7KpzewEyzpbNRwJtI4gsSSvO3wZtyLQDrlsia_ISWUubfzUN1kdxvYNJLOiAGAACF";

var contents = JSON.stringify({
    type: "news",
    offset:0,
    count:20
});

var options = {
    host:'www.baidu.com',
    path:'',
    method:'GET',
    headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':contents.length
    }
};

var req = https.request(options, function(res){
    res.setEncoding('utf8');
    res.on('data',function(data){
        console.log("data:",data);   //一段html代码
    });
});

req.write(contents);
req.end;