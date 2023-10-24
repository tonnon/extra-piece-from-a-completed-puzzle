const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=600;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var hues=[];
var colors=new Array(4);
var getColors=()=>{
  let h=[];
  let hueCount=5;
  let hue=getRandomInt(400,560);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(400/hueCount)*i+getRandomInt(-10,10))%860;
    h.splice(getRandomInt(0,h.length+1),0,"hsl("+hd+",100%,70%)");
  }
  return h;
}

const C= 20;

var Line=function(idx,rdx) {
  this.radius=radii[rdx];
  let f=2/C;
let a=idx*TP/C;
  this.f1x=Math.cos(a-f);
  this.f1y=Math.sin(a-f);
  this.f2x=Math.cos(a+f);
  this.f2y=Math.sin(a+f);
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.setLine=()=>{
    this.dp1.x=Math.round(this.radius*this.f1x);
    this.dp1.y=Math.round(this.radius*this.f1y);
    this.dp2.x=Math.round(this.radius*this.f2x);
    this.dp2.y=Math.round(this.radius*this.f2y);
  }
  this.setLine();
}

var radii=new Array(6);
var setRadii=()=>{
  radii[0]=1;
  for (let i=1; i<radii.length; i++) {
    radii[i]=Math.round(480*Math.random());
  }
  radii.sort((a,b)=>{ return a-b; });
}
setRadii(radii);

let L=C/2+1;
var lset=[new Array(L),new Array(L),new Array(L),new Array(L), new Array(L), new Array(L)];
var lset2=[new Array(L),new Array(L),new Array(L),new Array(L), new Array(L), new Array(L)];

var setLines=(ls)=>{
  var iset=new Array(L);
  for (let i=0; i<L; i++) {
    let is=new Array(ls.length);
    for (let j=0; j<ls.length; j++) {
      is[j]=getRandomInt(0,radii.length);
    }
    is.sort();
    iset[i]=is;
  }
  for (let i=0; i<L; i++) {
    for (let j=0; j<ls.length; j++) {
      ls[j][i]=new Line(i,iset[i][j]);
    }
  }
  ls.reverse();
}

var pa=new Array(lset.length);
var dpath;
var setPaths=()=>{
  dpath=new Path2D();
  for (let l=0; l<lset.length; l++) {
    let lp=lset[l];
    let lp2=lset2[l];
    let x=(1-frac)*(lp[0].dp1.x+lp[0].dp2.x)/2+frac*(lp2[0].dp1.x+lp2[0].dp2.x)/2;
    let y=(1-frac)*(lp[0].dp1.y+lp[0].dp2.y)/2+frac*(lp2[0].dp1.y+lp2[0].dp2.y)/2;
    pa[l]=new Path2D();
    pa[l].moveTo(Math.round(x),Math.round(y));
    for (let i=0; i<C/4; i++) {
      let i0=i;
      let i1=(i+1)%C;
      x=Math.round((1-frac)*(lp[i1].dp1.x+lp[i1].dp2.x)/2+frac*(lp2[i1].dp1.x+lp2[i1].dp2.x)/2);
      y=Math.round((1-frac)*(lp[i1].dp1.y+lp[i1].dp2.y)/2+frac*(lp2[i1].dp1.y+lp2[i1].dp2.y)/2);
      let c1x=(1-frac)*lp[i0].dp2.x+frac*lp2[i0].dp2.x;
      let c1y=(1-frac)*lp[i0].dp2.y+frac*lp2[i0].dp2.y;
      let c2x=(1-frac)*lp[i1].dp1.x+frac*lp2[i1].dp1.x;
      let c2y=(1-frac)*lp[i1].dp1.y+frac*lp2[i1].dp1.y;
      pa[l].bezierCurveTo(c1x,c1y,c2x,c2y,x,y);
    }
    dpath.addPath(pa[l]);
  }
}

var ldo=[];
var ldf=[];
var ldo2=[];
var ldf2=[];
var ldo3=[];
var ldf3=[];
for (let i=0; i<lset.length; i++) {
  ldo[i]=100*Math.random();
  ldo2[i]=100*Math.random();
  ldo3[i]=100*Math.random();
  ldf[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
  ldf2[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
  ldf3[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
}

ctx.fillStyle="black";
ctx.lineWidth=20;
ctx.globalAlpha=0.5;
var dash=[30,60];
ctx.setLineDash(dash);

var draw=()=>{
ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
let p2=new Path2D();
ctx.setLineDash(dash);
ctx.lineWidth=40;
ctx.globalAlpha=0.04;
  for (let i=0; i<lset.length; i++) {
//ctx.lineWidth=20-3*i;
let p=new Path2D(pa[i]);
p.addPath(p,new DOMMatrix([-1,0,0,1,0,0]));
p.addPath(p,new DOMMatrix([-1,0,0,-1,0,0]));
p2.addPath(p);
ctx.strokeStyle=colors[i%colors.length];
ctx.lineWidth=50;
  ctx.lineDashOffset=ldf[i]*t+ldo[i];
  ctx.stroke(p);

ctx.strokeStyle="black"; //colors[(i+1)%colors.length];
ctx.lineWidth=28;
ctx.lineDashOffset=ldf2[i]*t+ldo2[i];
ctx.stroke(p);

ctx.strokeStyle=colors[(i+1)%colors.length];
ctx.lineWidth=20;
ctx.lineDashOffset=ldf3[i]*t+ldo3[i];
ctx.stroke(p);
  }
  ctx.setLineDash([]);
  ctx.lineWidth=2;
  ctx.strokeStyle="silver";
  ctx.stroke(p2);
}

function start() {
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
var s=0;
var frac=0;
function animate(ts) {
  if (stopped) return;
  t++;
  frac=(1+Math.sin(3*TP/4+t*TP/300))/2;
  if (t%150==0) {
    s=++s%2;
    setRadii(radii);
    setLines(s?lset:lset2);
    if (Math.random()<0.1) colors=getColors();
  }
  setPaths();
  draw();
  requestAnimationFrame(animate);
}

onresize();

setLines(lset);
setLines(lset2);
setPaths();
colors=getColors();

start();