(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var World=require("./world"),ctx,canvas,width,height,originX,originY,tileWidth,tileHeight;module.exports=Canvas=function(t){return canvas=t,ctx=canvas.getContext("2d"),width=canvas.width=window.innerWidth,height=canvas.height=window.innerHeight,tileWidth=32,tileHeight=16,originX=0,originY=0,this},Canvas.draw=function(){ctx.clearRect(0,0,canvas.width,canvas.height),ctx.strokeStyle="rgba(255,255,255,1)",ctx.beginPath()},Canvas.update=function(){},Canvas.drawPixel=function(t,e,a){ctx.fillStyle=a,ctx.fillRect(t,e,1,1)},Canvas.drawRect=function(t,e,a,i,n){ctx.fillStyle=n,ctx.fillRect(t*a,e*i,a,i)},Canvas.drawTile=function(t,e,a){ctx.save(),ctx.translate((t-e)*(tileWidth-1)/2,(t+e)*(tileHeight-1)/2),ctx.beginPath(),ctx.moveTo(0,0),ctx.lineTo(tileWidth/2,tileHeight/2),ctx.lineTo(0,tileHeight),ctx.lineTo(-tileWidth/2,tileHeight/2),ctx.closePath(),ctx.fillStyle=a,ctx.fill(),ctx.restore()},Canvas.drawSizedTile=function(t,e,a,i,n,l){i*=scale,a*=scale,ctx.save(),ctx.translate((t-e)*a/2,(t+e)*i/2),ctx.translate(0,n),ctx.beginPath(),ctx.moveTo(0,0),ctx.lineTo(a/2,i/2),ctx.lineTo(0,i),ctx.lineTo(-a/2,i/2),ctx.closePath(),ctx.fillStyle=l,ctx.fill(),ctx.restore()},Canvas.drawSizedTileNeighbours=function(t,e,a,i,n,l,c){i*=scale,a*=scale;var o=i/2-l.east.elevation,r=i+-l.southEast.elevation,s=i/2-l.south.elevation;ctx.save(),ctx.translate((t-e)*a/2,(t+e)*i/2),ctx.beginPath(),ctx.moveTo(0,n),ctx.lineTo(a/2,o),ctx.lineTo(0,r),ctx.lineTo(-a/2,s),ctx.closePath(),ctx.fillStyle=c,ctx.fill(),ctx.restore()},Canvas.drawTileMap=function(t){for(var e=0;e<t[0].length;e++)for(var a=0;a<t.length;a++)t[a][e].land&&Canvas.drawTile(a+originX,e+originY,"white")},Canvas.drawWorld=function(t){for(var e=(t.length,t[0].length,0);e<t[0].length;e++)for(var a=0;a<t.length;a++)t[a][e].land&&Canvas.drawSizedTileNeighbours(a+originX,e+originY,20,10,-t[a][e].elevation,World.getNeighbours(a,e),"green")},Canvas.move=function(t,e){originX+=t,originY+=e},Canvas.resize=function(){canvas.width=window.innerWidth,canvas.height=window.innerHeight};var scale=1;Canvas.increaseWorldScale=function(){scale=parseFloat((scale+.1).toFixed(1)),scale>12&&(scale=12),console.log(scale)},Canvas.decreaseWorldScale=function(){scale=parseFloat((scale-.1).toFixed(1)),scale<0&&(scale=0),console.log(scale)};var previousTime;Canvas.render=function(){var t=Date.now()-previousTime;previousTime=Date.now(),World.get()&&(ctx.save(),ctx.clearRect(0,0,canvas.width,canvas.height),ctx.translate(canvas.width/2,0),Canvas.drawWorld(World.get()),ctx.font="14px Courier",ctx.fillStyle="white",ctx.fillText(Math.floor(1e3/t)+"fps",10,20),ctx.restore())};

},{"./world":6}],2:[function(require,module,exports){
var Canvas=require("./canvas"),Terminal=require("./terminal");module.exports=Input=function(){return window.addEventListener("resize",Canvas.resize),window.addEventListener("wheel",Input.onMouseWheel,!1),window.addEventListener("contextmenu",function(e){e.preventDefault()}),window.addEventListener("mousedown",Input.onMouseEvent),window.addEventListener("mouseup",Input.onMouseEvent),window.addEventListener("mousemove",Input.onMouseEvent),document.addEventListener("keydown",Input.onKeyDown),document.addEventListener("keyup",Input.onKeyUp),document.addEventListener("keypress",Input.onKeyPress),this},Input.mouseInterval=null,Input.onMouseWheel=function(e){e.deltaY<0?Canvas.increaseWorldScale():Canvas.decreaseWorldScale()},Input.onMouseEvent=function(e){switch(e.type){case"mousemove":Input.onMouseMove(e);break;case"mouseup":clearInterval(Input.mouseInterval);break;case"mousedown":2===e.button&&(Input.mouseInterval=setInterval(function(){Input.onMouseRight(e)},25))}},Input.mouseLocation="",Input.onMouseMove=function(e){var n=e.clientX>0&&e.clientX<window.innerWidth/3,t=e.clientX>window.innerWidth/3&&e.clientX<window.innerWidth-window.innerWidth/3,o=e.clientX>window.innerWidth-window.innerWidth/3&&e.clientX<window.innerWidth,i=e.clientY>0&&e.clientY<window.innerHeight/3,r=e.clientY>window.innerHeight/3&&e.clientY<window.innerHeight-window.innerHeight/3,s=e.clientY>window.innerHeight-window.innerHeight/3&&e.clientY<window.innerHeight,a=n&&i,u=t&&i,c=o&&i,d=n&&r,l=t&&r,p=o&&r,w=n&&s,m=t&&s,v=o&&s;a?Input.mouseLocation="topLeft":u?Input.mouseLocation="topCenter":c?Input.mouseLocation="topRight":d?Input.mouseLocation="centerLeft":l?Input.mouseLocation="centerCenter":p?Input.mouseLocation="centerRight":w?Input.mouseLocation="bottomLeft":m?Input.mouseLocation="bottomCenter":v&&(Input.mouseLocation="bottomRight")};var scrollSpeed=.2;Input.onMouseRight=function(e){switch(Input.mouseLocation){case"topLeft":Canvas.move(scrollSpeed,0);break;case"topCenter":Canvas.move(scrollSpeed,scrollSpeed);break;case"topRight":Canvas.move(0,scrollSpeed);break;case"centerLeft":Canvas.move(scrollSpeed,-scrollSpeed);break;case"centerCenter":break;case"centerRight":Canvas.move(-scrollSpeed,scrollSpeed);break;case"bottomLeft":Canvas.move(0,-scrollSpeed);break;case"bottomCenter":Canvas.move(-scrollSpeed,-scrollSpeed);break;case"bottomRight":Canvas.move(-scrollSpeed,0)}},Input.onKeyDown=function(e){switch(terminal.focus(),e.key){case"ArrowUp":terminal.prevHistory();break;case"ArrowDown":terminal.nextHistory();break;case"Enter":terminal.submit()}},Input.onKeyUp=function(e){},Input.onKeyPress=function(e){};
},{"./canvas":1,"./terminal":5}],3:[function(require,module,exports){
function canvasLoop(){Canvas.render(),requestAnimationFrame(canvasLoop)}module.exports=Reverie={},Reverie.dom={canvas:document.querySelector("#reverie"),terminal:document.querySelector("#terminal"),cursor:document.querySelector("cursor")},Reverie.input=require("./input")(),Reverie.sockets=require("./sockets")(io()),Reverie.terminal=require("./terminal")(Reverie.dom.terminal),Reverie.canvas=require("./canvas")(Reverie.dom.canvas),Reverie.world=require("./world")(),canvasLoop();
},{"./canvas":1,"./input":2,"./sockets":4,"./terminal":5,"./world":6}],4:[function(require,module,exports){
var Canvas=require("./canvas"),World=require("./world");module.exports=Sockets=function(e){return e.on("world data",Sockets.onWorldData),e.on("actor connected",Sockets.createActor),e.on("newMessage",Sockets.newMessage),this},Sockets.onWorldData=function(e){console.log(e),World.set(e)},Sockets.newMessage=function(e){},Sockets.createActor=function(e){},Sockets.sendWorldCreateCommand=function(){sockets.emit("world create",args,function(e,o){e&&Canvas.renderWorld(o)})},Sockets.onMessage=function(e,o){console.log(e,o)},Sockets.sendWorldStepCommand=function(){sockets.emit("world step",null,function(e,o){e&&Canvas.renderWorld(o)})};

},{"./canvas":1,"./world":6}],5:[function(require,module,exports){
var Canvas=require("./canvas"),Sockets=require("./sockets"),terminal;module.exports=Terminal=function(e){return terminal=e,this},Terminal.focus=function(){terminal.focus()};var historyIndex=-1,terminalHistory=[];Terminal.prevHistory=function(){++historyIndex>terminalHistory.length-1&&(historyIndex=terminalHistory.length-1)},Terminal.nextHistory=function(){historyIndex--,historyIndex<-1&&(historyIndex=-1),terminal.value=historyIndex===-1?"":terminalHistory[historyIndex],setTimeout(function(){terminal.value=terminal.value},0)},Terminal.submit=function(){input=terminal.value,console.log(terminalHistory,historyIndex),terminalHistory[historyIndex]!==input&&terminalHistory.unshift(input),historyIndex=-1;var e=input.split(" ");if(e[0].startsWith("/")){var t=e.shift().substring(1);switch(t){case"create":for(var r={},n=0;n<e.length;n++){var i=e[n].split("="),s=i[0],a=i[1];switch(s){case"x":case"y":case"steps":a=parseInt(a);break;case"alivePercent":a=parseFloat(a);break;case"birth":case"survival":a=a.split(",");for(var o=0;o<a.length;o++)a[o]=parseInt(a[o])}r[s]=a}Sockets.sendWorldCreateCommand();break;case"step":Sockets.sendWorldStepCommand();break;default:console.log("unknown command: ",t)}}else console.log("message: ",input);terminal.value=""};

},{"./canvas":1,"./sockets":4}],6:[function(require,module,exports){
var map;module.exports=World=function(){return this},World.set=function(t){map=t},World.get=function(){return map},World.getNeighbours=function(t,o){return{north:map[t][o-1],northEast:map[t+1][o-1],east:map[t+1][o],southEast:map[t+1][o+1],south:map[t][o+1],southWest:map[t-1][o+1],west:map[t-1][o],northWest:map[t-1][o-1]}};

},{}]},{},[3]);