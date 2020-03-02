//環境變數
var updateFPS = 30;
var showMouse = true ;
var time =0;
var bgColor = "black"
//Class
//-----------------------------------------------
//Vec2
class Vec2{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    set(x,y){
        this.x=x;
        this.y=y;
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
    }
    add(v){
        return new Vec2(this.x+v.x,this.y+v.y);
    }
    sub(v){
        return new Vec2(this.x-v.x,this.y-v.y);
    }
    mul(s){
        return new Vec2(this.x*s,this.y*s);
    }
    get length(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    set length(nl){
        let temp = this.unit.mul(nl);
        this.set(temp.x,temp.y);
    }
    clone(){
        return  new Vec2(this.x,this.y);
    }
    toString(){
        return `(${this.x} , ${this.y})`;
    }
    equal(v){
        return this.x==v.x && this.y==v.y;
    }
    get angle(){
        return Math.atan2(this.y,this.x);
    }
    get unit(){
        return this.mul(1/this.length)
    }
}

//-------------------------------------




//canvas_init
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
ctx.circle = function(v,r){
    this.arc(v.x,v.y,r,0,Math.PI*2);
}
ctx.line = function(p1,p2){
    this.moveTo(p1.x,p1.y);
    this.lineTo(p2.x,p2.y);

}
function initCanvas(){
    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;
}
initCanvas();

let degToPi = Math.PI/180;

class Circle{
    constructor(args){
        let def={
            p:new Vec2(0,0),
            r:100,
            color:'white',
            lineTo:function(obj,i){
                return true;
            },
            getWidth:function(obj,i){
                return 1;
            },
            anglePan:function(obj,i){
                return 0;
            },
            vertical:false,
            getVerticalWidth:function(obj,i){
                return 2;
            },
            ramp:0
        }
    Object.assign(def,args);
    Object.assign(this,def);
    }
    draw(){
        ctx.beginPath();
        for (var i=1;i<=360;i++){
            let angle1 = i + this.anglePan();
            let angle2 = i-1 + this.anglePan();
            let use_r=this.r+this.ramp*Math.sin(i/10);
            let use_r2=this.r+this.ramp*Math.sin((i-1)/10);

            let x1 = use_r*Math.cos(angle1*degToPi);
            let y1 = use_r*Math.sin(angle1*degToPi);
            let x2 = use_r2*Math.cos(angle2*degToPi);
            let y2 = use_r2*Math.sin(angle2*degToPi);

            if(this.lineTo(this,i)){
                ctx.beginPath();
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
                ctx.strokeStyle=this.color;
                ctx.lineWidth=this.getWidth(this,i)
                ctx.stroke();
            }
            if(this.vertical){
                let l=this.getVerticalWidth(this,i);
                let x3 = (use_r+l)*Math.cos(angle1*degToPi);
                let y3 = (use_r+l)*Math.sin(angle1*degToPi);
                ctx.beginPath();
                ctx.moveTo(x1,y1);
                ctx.lineTo(x3,y3);
                ctx.strokeStyle=this.color;
                ctx.stroke();
            }
        }
    }
}
let cirs=[];
//init_邏輯初始化
function init(){
    cirs.push(new Circle({
        r:150,
        color:"rgba(255,255,255,0.4)"
    }))
    cirs.push(new Circle({
        r:220,
        lineTo:function(obj,i){
            return (i%5==0);
        }
        
    }))
    cirs.push(new Circle({
        r:80,
        lineTo:function(obj,i){
            return (i%180<30==0);
        },
        color :'rgba(0,255,255,0.8)'
        
    }))
    cirs.push(new Circle({
        r:350,
        ramp:15,
        color:'rgba(255,255,255,0.8)',
        lineTo:function(obj,i){
            return (i%180<30==0);
        },
        anglePan:function(obj,i){
            return (-time/15);
        } 
        
    }))
    cirs.push(new Circle({
        r:190,
        anglePan:function(obj,i){
            return (-time/2);
        },
        getWidth:function(obj,i){
            return i%150<50?5:1;
        },
        color:'#FFFF37',  
    }))
    cirs.push(new Circle({
        r:280,
        lineTo(){return false;},
        vertical:true,
        getVerticalWidth(obj,i){
            if (i%10==0)
            {
                return 15;
            }else if (i%10==5){
                return 10;
            }else{
                return 2;
            }
        },
        color:'rgba(255,0,255,0.8)',
        anglePan:function(obj,i){
            return (time/2);
        }        
    }))
    cirs.push(new Circle({
        r:250,
        lineTo(obj,i){
            return i%50==0;
        },
        getWidth:function(){return 10},
        anglePan:function(obj,i){
            return (-time/20)%5;
        }
        
    }))
}

//update_遊戲邏輯更新
function update(){
    time++;
}

//draw_畫面更新
function draw(){
    //清空背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(0,0,ww,wh);
    //-------------------------------------
    //在此繪製
    ctx.save();
        ctx.translate(ww/2,wh/2);
        cirs.forEach(cir=>{
            ctx.save();
                let pan = mousePos.sub(new Vec2(ww/2,wh/2)).mul(8/cir.r);
                ctx.translate(pan.x,pan.y); 
                cir.draw();
            ctx.restore();
        })
    

    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();
    //時
    let angleHour =degToPi*360/12*h-Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(50*Math.cos(angleHour),50*Math.sin(angleHour));
    ctx.lineWidth=6;
    ctx.strokeStyle="red";
    ctx.stroke();
    //分
    let angleMinute =degToPi*360/60*m-Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(150*Math.cos(angleMinute),150*Math.sin(angleMinute));
    ctx.lineWidth=5;
    ctx.strokeStyle="blue";
    ctx.stroke();
    //秒
    let angleSecond =degToPi*360/60*s-Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(250*Math.cos(angleSecond),250*Math.sin(angleSecond));
    ctx.lineWidth=2;
    ctx.strokeStyle="white";
    ctx.stroke();

    ctx.restore();


    //-----------------------------------------
    //滑鼠
    ctx.fillStyle="red"
    ctx.beginPath();
    ctx.circle(mousePos,3);
    ctx.fill();
    ctx.save();
        ctx.beginPath();
        ctx.translate(mousePos.x,mousePos.y);
        ctx.strokeStyle="red"
        let len = 20;
        ctx.line(new Vec2(-len,0),new Vec2(len,0));
        ctx.line(new Vec2(0,-len),new Vec2(0,len));
        ctx.fillText(mousePos,10,-10)
        ctx.stroke();
    ctx.restore();
    requestAnimationFrame(draw);
}
//頁面載入
function loaded(){
    initCanvas();
    init();
    requestAnimationFrame(draw);
    setInterval(update,1000/updateFPS);
}
//載入 縮放事件
window.addEventListener("load",loaded);
window.addEventListener("resize",initCanvas);
//滑鼠事件&紀錄
var mousePos = new Vec2(0,0);
var mousePosDown = new Vec2(0,0);
var mousePosUp = new Vec2(0,0);
window.addEventListener("mousedown",mousedown);
window.addEventListener("mouseup",mouseup);
window.addEventListener("mousemove",mousemove);
function mousemove(evt){
    mousePos.set(evt.offsetX,evt.offsetY);
}
function mousedown(evt){
    mousePos.set(evt.offsetX,evt.offsetY);
    mousePosDown = mousePos.clone();
}
function mouseup(evt){
    mousePos.set(evt.offsetX,evt.offsetY);
    mousePosDown = mousePos.clone();
}