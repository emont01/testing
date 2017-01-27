const env=process.env.ENV||'production'
  , express=require('express')
  , app=require('express')()
  , http=require('http').Server(app)
  , bodyparser=require('body-parser')
  , lessmiddleware=require('less-middleware')
  , favicon=require('serve-favicon')
  , fs=require('fs')
  , join=require('path').join
  , board_file=join(__dirname,'..','board.json')

var board=[]

fs.readFile(board_file,'utf8',(err,data)=>{
    if(err){
        throw err;
    }
    if(data){
        board=JSON.parse(data);
    }
});

app.disable('x-powered-by');
app.use(bodyparser.json({limit:'5mb'}));
app.use(favicon(join(__dirname,'..','client','favicon.ico')));

if(env=='production'){
    app.use(express.static(join(__dirname,'..','client')));
}else{
    app.set('views',join(__dirname,'..','client','pug'));
    app.set('view engine','pug');
    app.use(lessmiddleware('/less',{
        dest:'/css'
      , pathRoot:join(__dirname,'..','client')
      , compress:false
    }));
    app.use(express.static(join(__dirname,'..','client')));
    app.use(express.static(join(__dirname,'..','bower_components')));
}

app.get('/',(request,response)=>{
    if(env=='production'){
        response.status(200)
            .sendFile(join(__dirname,'..','client','index.html'));
    }else{
        response.status(200).render('dev');
    }
});

app.get('/scores',(request,response)=>{
    response.status(200).json(board);
});

app.post('/score',(request,response)=>{
    board.push(request.body);
    board=board.sort((a,b)=>{
        return +a.score- +b.score;
    });
    board=board.slice(0,10);

    fs.writeFile(board_file,JSON.stringify(board),(err)=>{
        if(err){
            throw err;
        }
        response.status(200).json({ok:true});
    });
});

http.listen(3030,'0.0.0.0',()=>{
    console.log('start test server');
    console.log('listening on 127.0.0.1:3030');
});

module.exports=app;
