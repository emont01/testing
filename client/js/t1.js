var Model=new(function(){
    this.bombs=48
    this.rows=16
    this.columns=16
    this.counter=(this.rows*this.columns)-this.bombs
    this.matrix
    this.starttime=false
    this.time=0;

    this.generateMatrix=function(){
        // Verificador de numero de bombas
        if(this.bombs>(this.rows*this.columns)){
            this.bombs=this.rows*this.columns
        }
        // Seteo de matriz
        this.matrix=new Array(this.rows)
        for(i=0;i<this.rows;i++){
            this.matrix[i]=new Array(this.columns)
            for(j=0;j<this.columns;j++){
                this.matrix[i][j]={'type':0,'hide':1}
            }
        }
        // Insercion de bombas
        for(k=0;k<this.bombs;k++){
            do{
                _i=this.random(this.rows)
                _j=this.random(this.columns)
            }while(this.matrix[_i][_j]['type']===-1)
            this.matrix[_i][_j]['type']=-1
        }
        // Insercion de contadores de bombas
        h=this.columns
        w=this.rows
        for(i=0;i<this.rows;i++){
            for(j=0;j<this.columns;j++){
                if(this.matrix[i][j]['type']===-1){  // es bomba
/* sup izq */       (i!=0&&j!=0&&this.matrix[i-1][j-1]['type']>=0)
                        &&(this.matrix[i-1][j-1]['type']++);
/* sup cen */       (i!=0&&this.matrix[i-1][j]['type']>=0)
                        &&(this.matrix[i-1][j]['type']++);
/* sup der */       (i!=0&&j!=h-1&&this.matrix[i-1][j+1]['type']>=0)
                        &&(this.matrix[i-1][j+1]['type']++);
/* mid izq */       (j!=0&&this.matrix[i][j-1]['type']>=0)
                        &&(this.matrix[i][j-1]['type']++);
/* mid der */       (j!=h-1&&this.matrix[i][j+1]['type']>=0)
                        &&(this.matrix[i][j+1]['type']++);
/* inf izq */       (i!=w-1&&j!=0&&this.matrix[i+1][j-1]['type']>=0)
                        &&(this.matrix[i+1][j-1]['type']++);
/* inf cen */       (i!=w-1&&this.matrix[i+1][j]['type']>=0)
                        &&(this.matrix[i+1][j]['type']++);
/* inf der */       (i!=w-1&&j!=h-1&&this.matrix[i+1][j+1]['type']>=0)
                        &&(this.matrix[i+1][j+1]['type']++);
                }
            }
        }
    }
    this.random=function(max){return Math.floor(Math.random()*max)}
    this.showAll=function(){
        for(i=0;i<this.rows;i++){
            for(j=0;j<this.columns;j++){
                this.matrix[i][j]['hide']=0
            }
        }
    }
    this.print=function(){
        for(i=0;i<this.rows;i++){
            a=''
            for(j=0;j<this.columns;j++){
                a+=(+this.matrix[i][j]['type'])+' '
            }
            console.log(a)
        }
    }
    this.propagate=function(i,j,t){
        if(i<0||j<0){return}
        if(i>=this.rows||j>=this.columns){return}
        cell=this.matrix[i][j]
        if(cell['hide']==0){return}

        switch(+cell['type']){
            case -1:                    // bomba
                if(t==0){
                    this.showAll()
                    Render.loose()      // your loose :'(
                }
                return
            case 0:                     // cero
                cell['hide']=0
                this.counter--
                this.propagate(i-1,j-1,1)
                this.propagate(i-1,j,  1)
                this.propagate(i-1,j+1,1)
                this.propagate(i,  j-1,1)
                this.propagate(i,  j+1,1)
                this.propagate(i+1,j-1,1)
                this.propagate(i+1,j,  1)
                this.propagate(i+1,j+1,1)
                break
            default:                    // contador
                cell['hide']=0
                this.counter--
        }
    }
})()

var Render=new(function(){
    // Renderiza el tablero de juego
    this.render=function(matrix){
        tbody=document.querySelector('#field table tbody')
        for(i=0;i<Model.rows;i++){
            tr=tbody.children[i]
            for(j=0;j<Model.columns;j++){
                td=tr.children[j]
                if(matrix[i][j]['hide']){
                    td.setAttribute('class','hide')
                }else{
                    if(matrix[i][j]['type']<0){
                        td.setAttribute('class','bomb')
                    }else{
                        if(matrix[i][j]['type']!=0){
                            td.setAttribute('class','n'+matrix[i][j]['type'])
                            td.textContent=matrix[i][j]['type']
                        }else{
                            td.setAttribute('class','')
                        }
                    }
                }
            }
        }
    }
    // Funcion para la manipulación de eventos
    this.listener=function(){
        tbody=document.querySelector('#field table tbody')
        for(i=0;i<Model.rows;i++){
            tr=tbody.children[i]
            for(j=0;j<Model.columns;j++){
                td=tr.children[j]
                td.addEventListener('click',Listener.action.bind(Listener))
            }
        }
        return this
    }
    this.win=function(){
        console.log('win')
        document.images[0].src='/png/t1_win.png'
    }
    this.loose=function(){
        console.log('loose')
        document.images[0].src='/png/t1_loose.png'
    }
})()

var Listener=new(function(){
    this.action=function(e){
        // Comienza cronometro
        if(!Model.starttime){
            Model.starttime=true;
            setInterval(function(){
                Model.time++;
                document.querySelector('.chrono').innerHTML=pretty(Model.time);
            },1000);
        }

        a=e.currentTarget.dataset
        Model.propagate(+a.x,+a.y,0)
        if(Model.counter===0){
            Render.win()               // your win :-)
            var player = prompt("Please enter your name", "Harry Potter");
            $.ajax({
              type: "POST",
              url: "/score",
              data: {"player": player,"score":Model.time},
              success: function () {
                  console.log("score recorded");
              },
              dataType: "json"
            });
        }
        Render.render(Model.matrix)
    }
    this.newGame=function(e){
        console.log('new game')
        // reset game status
        Model.starttime = false;
        Model.time = 0;
        Model.generateMatrix();
        // render new matrix
        Render.listener.render(Model.matrix);
    }
})()

var pretty=function(time){
    var formattedTime = "";

    var hours = Math.floor(time / 3600);
    if (hours > 0) {
        time = time - hours * 3600;
        formattedTime = hours + ":";
    }
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    
    return formattedTime + minutes + ":" + seconds;
}

window.onload=function(){
    document.querySelector('table>thead button')
            .addEventListener('click',Listener.newGame.bind(Listener))
    Model.generateMatrix()
    Render.listener().render(Model.matrix)
}

