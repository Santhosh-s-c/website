(function (global, factory) {            
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = 
factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Jua = factory();         

    } (this,function() {
"use strict";
var ownerDoc = document;
var plugins = {
  select:{}
};

var jua = function(){

  for (let x in plugins) {
   if (x != "select" && !this[x]) {
    if (typeof plugins[x] == "function") {
      this[x] = function(){
        return plugins[x].call(Jua(),...arguments);
      }
       Jua[x] = function(){
        return plugins[x].call(Jua(),...arguments);
      }
    }else{
      this[x] = plugins[x];
      Jua[x] = plugins[x];
    }
   }
  }

// ui for this not for user

  function zoom(elem,options = {}){
     elem = Jua(elem);
     var previousY,previousX;
     var elem2 = Jua("<jua-Zoomer>");
     elem2.class("display","inline-flex");
     elem2.html(elem.html());
     elem.node.innerHTML = "";
     elem.append(elem2);
     elem2.class("transform-origin","0px 0px");
     elem.class("overflow","auto");
     elem.on("mousewheel",function(e){
      e.preventDefault();
      var d = -1;
      if(e.deltaY < 0){ var d = 1;};
      scale(e.pageX,e.pageY,d)
     });
      elem.on("mousedown",function(e){
        if(e.buttons == 1){
      e.preventDefault();
      previousX = e.pageX;
      previousY = e.pageY;
     }
     });
      elem.on("mousemove",function(e){
        if(e.buttons == 1){
        e.preventDefault();
        pan(e.pageX,e.pageY);
        }
      });

///////////////////////////////////////////////////
      var opt = {
        scale:1,
        factor:0.1,
        pan:true,
      };
      for (let x in options) {
        if (x in opt) { opt[x] = options[x];}
      }
/////////////////////////////////////////////////
    function scale(x,y,deltaY){
      x -= elem.node.offsetLeft;
      y -= elem.node.offsetTop;
        var fp = {x:(x + elem.node.scrollLeft)/opt.scale, y:(y +elem.node.scrollTop)/opt.scale}
      opt.scale += deltaY*opt.factor * opt.scale;
        var fpNew = {x:(fp.x * opt.scale)-x, y: (fp.y * opt.scale)-y}
         elem2.class("transform","scale("+opt.scale+","+opt.scale+")");
         elem.node.scrollTop = fpNew.y; 
         elem.node.scrollLeft = fpNew.x; 
     }

     function pan(x,y){
        if(opt.pan && x && y){
        elem.node.scrollBy(previousX-x,previousY-y); 
        previousX = x;
        previousY = y;
        }
     }
return {setOptions:function(options){
   for (let x in options) {
        if (x in opt) { opt[x] = options[x];}
      }
},
}
}


function JsSyntax(givenNode) {
  var node = Jua("<div>").append(Jua(givenNode).clone(true)).select("*");
  var nodesNames = new Array();
  var nodes = new Array();
  var protoNodes = {};


  var syntax = "";
  var etc = "";
  var SetAttrs = "";
  var appendTo = "";
  var JuainnerHTMLs = "";
  var JuainnerHTMLsArray = "";

  for (var i = 0; i < node.length; i++) {
     if (i == 0) {var is = true;}else{var is = false;}
    set(node[i].node,is)
  }

  function set(node,is0){
    if (nodesNames[node.tagName.toLowerCase()]) {
      nodesNames[node.tagName.toLowerCase()]++;
    }else{      
      nodesNames[node.tagName.toLowerCase()] = 1;
    }
    var name = node.tagName.toLowerCase()+(nodesNames[node.tagName.toLowerCase()]-1);
    if (is0) {name = "JuaCont"};
    protoNodes[Jua(node).getSelector().toLowerCase()] = name;
    nodes[name] = Object.create(null);
    nodes[name].tagName = node.tagName.toLowerCase();
    nodes[name].id = node.getAttribute("id");
    nodes[name].class = node.className;
    nodes[name].attrs = node.attributes;
    nodes[name].appendTo = Jua(node).parent().getSelector().toLowerCase();
    nodes[name].ns = Jua(node).node.namespaceURI;
    nodes[name].innerHTML = String(Jua(node).clone(true).empty().html());
    nodes[name].value = String(Jua(node).clone(true).empty().val());
    if (nodes[name].innerHTML == "") {nodes[name].innerHTML = null;};
    if (!Jua(node).clone(true).empty().val()) {nodes[name].value = null;}
    var attrs = "";
    for (var i = 0; i < nodes[name].attrs.length; i++) {
      attrs += "'"+nodes[name].attrs[i].name+"':'"+nodes[name].attrs[i].value+"', "
    }
    nodes[name].attrs = "{"+attrs.substring(0,attrs.length-2)+"}";
    if (!node.getAttribute("id")) {nodes[name].id = ""}else{
      nodes[name].id = "#"+node.getAttribute("id");
    }
    if (node.className != "") {nodes[name].class = "."+node.className;}else{
      nodes[name].class = "";
    }
    if (nodes[name].tagName == "canvas") {
      nodes[name].ctx = {};
      nodes[name].ctx.data = node.toDataURL();
      nodes[name].ctx.width = node.width;
      nodes[name].ctx.height = node.height;
    }

  }
  create();
  function create() {
    for (let x in nodes) {
        var selector = nodes[x].tagName+nodes[x].id+nodes[x].class;
      if (nodes[x].ns == "http://www.w3.org/1999/xhtml") {
        syntax += "\tvar "+x+" = "+"new Jua('"+selector+"');";
      }else{
        syntax += "\tvar "+x+" = "+"new Jua('"+selector+"','"+nodes[x].ns+"');";
      }
      nodes[x].appendTo = protoNodes[nodes[x].appendTo]
      setEtc(x,nodes[x]);
    }
  }


    function setEtc(name,nodeVal) {


      var attrs = nodeVal.attrs;
    if (attrs != "{}") {
        SetAttrs += "\t"+name+".attr("+JSON.stringify(attrs)+")\n";
    }
    if (nodeVal.ctx) {
          etc += "\t"+name+".height = "+nodeVal.ctx.height+";\n";
          etc += "\t"+name+".width = "+nodeVal.ctx.width+";\n";
        etc += "\tvar "+name+"img = new Image();\n\t"+name+"img.src = `"+nodeVal.ctx.data+"`\n\t"+name+"img.onload = function(){\t\t\n"+name+".ctx('2d').drawImage("+name+"img,0,0,"+nodeVal.ctx.width+","+nodeVal.ctx.height+");}; \n";
    }
    if (nodeVal.appendTo) {
            appendTo += "\n\t"+nodeVal.appendTo+".append("+name+");";
    }
    if (nodeVal.innerHTML) {
        setHtml(name,nodeVal.innerHTML)
    }
    if (nodeVal.value) {
        setValue(name,nodeVal.value)
    }
    }
    
    function setHtml(name,html){
          JuainnerHTMLsArray += name+":"+JSON.stringify(html).toString()+",\n"
            JuainnerHTMLs += "\n\t"+name+".html(inner."+name+");";
    }
    function setValue(name,html){
          JuainnerHTMLsArray += name+":"+JSON.stringify(html).toString()+",\n"
            JuainnerHTMLs += "\n\t"+name+".val(inner."+name+");";
    }
    JuainnerHTMLs = "\nvar inner = {\n"+JuainnerHTMLsArray+"\n\t}"+"\n"+JuainnerHTMLs;
    syntax = "\n\t// create Tags\n"+syntax+"\t// create Tags";
    etc = "\n\t// Extra\n"+etc+"\t// Extra";
    SetAttrs = "\n\t// set Attributes\n"+SetAttrs+"\t// set Attributes";
    appendTo = "\n\t// appender"+appendTo+"\n\t// appender";
    JuainnerHTMLs = "\n\n\t// set inner"+JuainnerHTMLs+"\n\t// set inner";

    syntax = syntax+"\n"+etc+"\n"+SetAttrs+JuainnerHTMLs+"\n"+appendTo+"\n";
    syntax = "\t// Created With Jua.js\n"+syntax+"\n\n\t// Created With Jua.js";

  return syntax;
  }

function paste(callback){
var obj = new Array();
  window.addEventListener("paste",function(e){
e = e.clipboardData || window.clipboardData;
if (e.types[0]) {
var usin = Object.create(null);
var usein = false;
  for (var i = 0; i < e.types.length; i++) {

obj[i] = Object.create(null);
obj[i].type = e.types[i];
var c = 0;

if (e.types[i].toLowerCase() == "files") {
usin[i] = true;
obj[c].type = e.files[c].type;
obj[c].file = e.files[c];
set(obj[c].type,obj,i,e.files[c]);
c++
obj[i].data = e.getData(e.types[i]);

}else{
obj[i].file = null;
obj[i].data = e.getData(e.types[i]);
}
}

function set(type,obj,i,file){
if (type.search("text") != -1) {
  Jua.read(file,function(result){
  obj[i].data = result;
  usin[i] = false;
  checkExport();
},"text")
}else{
  Jua.read(file,function(result){
  obj[i].data = result;

  usin[i] = false;
  checkExport();
},"dataurl")
}
}
checkExport();
function checkExport(){
  for (let x in usin) {
if (!usin[x]) {usein = true;};
}
if (!usein) {
callback.call(obj,obj);
}
}

}else{
obj[0] = Object.create(null);
obj[0].type = "text/plain";
obj[0].data = e.getData("Text");
obj[0].file = null;

callback.call(obj,obj);
}
  });
}

function slide(elem,type){
var slideIndex = [1];
showSlides(1, 0,type);
function plusSlides(n, no, type) {
  showSlides(slideIndex[no] += n, no, type);
}
elem.select(".Jua-slideshow-next-button").click(function(){plusSlides(1, 0, type)})
elem.select(".Jua-slideshow-prev-button").click(function(){plusSlides(-1, 0, type)})
function showSlides(n, no, type) {
  var i;
  var x = elem.select(".Jua-slideshow-image");
  if (n > x.length) {slideIndex[no] = 1}    
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
     Jua(x[i]).class("display","none");
  }
     Jua(x[slideIndex[no]-1]).class("display","block");
     if (type == "normal") {
        Jua(x[slideIndex[no]-1]).class("opacity","0");
        Jua(x[slideIndex[no]-1]).fadeIn(1000);
     }
     if (type == "3d") {
        Jua(x[slideIndex[no]-1]).class("transform","rotate3d(46, 18, 23, 213deg)");
        Jua(x[slideIndex[no]-1]).anim({transform:"rotate3d(1, 1, 1, 0deg)",})
     }
     Jua(x[slideIndex[no]-1]).class("position","static");


}


elem.select(".Jua-slideshow-image").click(function(){ var w = window.open(this.src,'_blank');});
};


   function animation(selector) {
      var elem = Jua(selector);
      var frames = new Array();
      var currentFrameNum = 0;
      var currentFrame = frames[currentFrameNum];
      var dish = this;

      this.addFrame = function(css,ms){
         frames[frames.length] = [css,ms];
         if (currentFrameNum == 0) {currentFrame = frames[currentFrameNum]};
      };
      var nextFrame = function(){
             if (frames.length > currentFrameNum) {
               if (typeof currentFrame[0] != "function") {
                 elem.class("transition",currentFrame[1]+"ms");
           for (let x in currentFrame[0]) {
              if (x != "innerHTML") {
               elem.class(x,currentFrame[0][x]);
              }else{
               elem.html(currentFrame[0][x]);
              }
           }
               }else{
                 currentFrame[0]();
               }

         setTimeout(function(){
           if (frames.length > currentFrameNum) {
             currentFrameNum++;
            currentFrame = frames[currentFrameNum];
           nextFrame();
           }
         },currentFrame[1])


             }
      };

      this.start = function(){setTimeout(function() {nextFrame();}, 10);};

   }


function componentToHex(c) {
  c = parseFloat(c);
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}


var ssaf = function(elem) {
try{
       const {
       tagName,
       id,
       className,
       parentNode
     } = elem;

  if (tagName === 'HTML') return 'HTML';
  let str = tagName;
  str += (id !== '') ? `#${id}` : '';
  if (className) {
    const classes = className.split(/\s/);
    for (let i = 0; i < classes.length; i++) {
      str += `.${classes[i]}`;
    }
  }
  let childIndex = 1;
  for (let e = elem; e.previousElementSibling; e = e.previousElementSibling) {
    childIndex += 1;
  }
  str += `:nth-child(${childIndex})`;
   
return `${ssaf(parentNode)} > ${str}`;
}catch(err){
  return false;
}
}

var generateQuerySelector = function(elem){
  var i = ssaf(elem);
if (i.toString().search("false") == 0) {return i.toString().substring(i.toString().search(">")+2,i.toString().length);}else{return i;}
}


this.strToEscape = function(str){
  return str.replace(/[\s\S]/g, function(character) {
    var escape = character.charCodeAt().toString(16),
        longhand = escape.length > 2;
    return '\\' + (longhand ? 'u' : 'x') + ('0000' + escape).slice(longhand ? -4 : -2);
  })
};

this.objectName = function(obj = {},nameForObj = Jua.randomId()){
  var id = Jua.randomId();
  var idObj = Jua.randomId();
  var lf = window[nameForObj];
  var script = Jua("<script>");
  window[idObj] = obj;
  script.html(`
    function ${nameForObj}(obj) {
      for (let x in obj) {
        this[x] = obj[x];
      }
    };
    window['${id}'] = new ${nameForObj}(${idObj});
    `);
  document.body.appendChild(script.node);
  setTimeout(function() {script.remove();}, 1);
  window[nameForObj] = lf;
  return window[id];
};

this.plug = function(name,func,forSelect){
  if (forSelect) {
    if (Jua().typeof(name) == "string") {
    plugins.select[name] = func;
  }else if (Jua().typeof(name) == "object"){
    for (let x in name) {
      plugins.select[x] = name[x];
    }
  }
  }else{
    if (Jua().typeof(name) == "string") {
    plugins[name] = func;
  }else if (Jua().typeof(name) == "object"){
    for (let x in name) {
      plugins[x] = name[x];
    }
  }
  }
  return Jua();
};


this.strToHexadecimal = function(str){
  var stri = "";
  for (var i = 0; i < str.length; i++) {
   stri += "\\u" + ("00" + str[i].charCodeAt(0).toString(16)).slice(-4);
  };
return stri;
};

this.strToBinary = function(str){
   var stri = "";
  for (var i = 0; i < str.length; i++) {
   stri += parseInt(str[i].charCodeAt(0).toString(2));
  };
return stri;
};

this.plugins = plugins;

this.strToHtmlNumeric = function(str){
   var stri = "";
  for (var i = 0; i < str.length; i++) {
   stri += "&#"+this.strToEscape(str[i]).replaceAll("\\","")+";";
  };
return stri;
};

var alphabets = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var vowels = ["a","e","i","o","u"]
this.alphabets = {
  length:26,
  vowels:vowels,
};

for (var i = 0; i < alphabets.length; i++) {
 this.alphabets[alphabets[i]] = {
    index: i,
    letter: alphabets[i],
    charCode: alphabets[i].charCodeAt(0),
    codePoint: alphabets[i].codePointAt(0),
    isVowel: (vowels.includes(alphabets[i].toLowerCase())) ? true : false,
    binary: parseInt(alphabets[i].charCodeAt(0).toString(2)),
    escapeCode: this.strToEscape(alphabets[i]),
    hexadecimal: this.strToHexadecimal(alphabets[i]),
    htmlNumeric: "&#" + this.strToEscape(alphabets[i]).replaceAll("\\", "") + ";",
};
}


this.onload = function(callback){
  window.onload = callback;
};

this.randomId = function(){
  var id = Math.random().toString(36).slice(2);
  return (Number(id[0]) == 0 || Number(id[0])) ? "_"+id:id; ;
}

this.randomColor = function(){
  return "rgb("+Jua.randomNumber(255)+","+Jua.randomNumber(255)+","+Jua.randomNumber(255)+")";
}

this.degToRad = function(deg){
return parseFloat(deg) * (Math.PI/180);
};

this.degToGrad = function(deg){
return parseFloat(deg) * (200/180);
};

this.degToTurn = function(deg){
return parseFloat(deg)/360;
};

this.radToDeg = function(rad){
return parseFloat(rad) * (180/Math.PI);
};

this.radToGrad = function(rad){
return this.degToGrad(this.radToDeg(parseFloat(rad)));
};

this.radToTurn = function(rad){
return this.degToTurn(this.radToDeg(parseFloat(rad)));
};

this.gradToDeg = function(grad){
return parseFloat(grad) * (180/200);
};

this.gradToRad = function(grad){
return this.degToRad(this.gradToDeg(grad));
};

this.gradToTurn = function(grad){
return this.degToTurn(this.gradToDeg(grad));
};

this.turnToDeg = function(turn){
return parseFloat(turn) * 360;
};

this.turnToRad = function(turn){
return this.degToRad(this.turnToDeg(turn));
};

this.turnToGrad = function(turn){
return this.degToGrad(this.turnToDeg(turn));
};



this.path =  function(data,node) {
    if (!data || data == "none") {data = "M0,0";}
    if (typeof data == "object" && data.constructor && data.constructor.name == "JuaPathCommands") {return data;}
    var onAd = new Array();
        var normalize = function (vector) {
        var len = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        return [vector[0] / len, vector[1] / len];
    };

        var ns = "http://www.w3.org/2000/svg";

    if (typeof data == "string") {

      function convertToCorrect(data){
        var svg = Jua("<svg>",ns);
        svg.attr("style","position:absolute;top:9999999999999999999999999px;left:99999999999999999999999999999999px")
        var path = Jua("<path>",ns);
        path.attr("d",data);
        svg.append(path);
        ownerDoc.body.appendChild(svg.node);
        data = path.class("d").replaceAll('path("',"").replaceAll('")',"");
        svg.remove();
        return data.split(" ");
      };

      data = convertToCorrect(data);
      function JuaPathCommands(){
        this.length = 0;
        this.__proto__.toPathData = function(DontAllowIndex){
          var PathData = "";
          var _this = this;

          for (var i = 0; i < this.length; i++) {
            if (i == DontAllowIndex) {continue;}
            var name = this[i].command;
            var arr = this[i];
            if (name == "M" || name == "L" || name == "T") {
              PathData += name+arr.x+","+arr.y+" ";
            }
            if (name == "H") {
              PathData += name+arr.x+" ";
            }
            if (name == "V") {
              PathData += name+arr.y+" ";
            };
            if (name == "C") {
              PathData += name+arr.x1+","+arr.y1+","+arr.x2+","+arr.y2+","+arr.x+","+arr.y+" "
            }
            if (name == "S") {
              PathData += name+arr.x2+","+arr.y2+","+arr.x+","+arr.y+" "
            }
            if (name == "Q") {
              PathData += name+arr.x1+","+arr.y1+","+arr.x+","+arr.y+" "
            }
            if (name == "A") {
              PathData += name+arr.rx+","+arr.ry+","+arr.xAxisRotation+","+arr.largeArcFlag+","+arr.sweepFlag+","+arr.x+","+arr.y+" "
            }
            if (name == "Z") {
              PathData += name+" "
            }
          }
          return PathData.substring(0,PathData.length-1);
        }
        this.__proto__.addListener = function(func){
          onAd[onAd.length] = func;
        }
        function call(){
         for (var i = 0; i < onAd.length; i++) {
           if (typeof onAd[i] == "function") {onAd[i]()};
         }
        }


        this.__proto__.toPath = function(){
          var path = ownerDoc.createElementNS(ns,"path");
          path.setAttributeNS(ns,"d",this.toPathData());
          path.setAttribute("d",this.toPathData());
          return path;
        };
        this.__proto__.addPathData = function(data){
          for (var i = 0; i < Jua.path(data).length; i++) {
            this[this.length] = Jua.path(data)[i];
            this.length++;
          }
          call();
          return this;
        };
        this.__proto__.moveTo = function(x,y){
          if (Number.isNaN(x) || Number.isNaN(y)) {return this;}
          if (this[this.length-1] && this[this.length-1].command == "M") {
          this[this.length-1].x = parseFloat(x);
          this[this.length-1].y = parseFloat(y);
          }else{
          this[this.length] = {};
          this[this.length].command = "M";
          this[this.length].x = parseFloat(x);
          this[this.length].y = parseFloat(y);
          this.length++;
          }
          call();
          return this;
        };
        this.__proto__.lineTo = function(x,y){
                if (isNaN(x) || isNaN(y)) {return this;};

          if (this[this.length-1] && this[this.length-1].command == "L" && this[this.length-1].x == x && this[this.length-1].y == y) {
          return this;
          };
          this[this.length] = {};
          this[this.length].command = "L";
          this[this.length].x = parseFloat(x);
          this[this.length].y = parseFloat(y);
          this.length++;
          call();
          return this;
        };

        this.__proto__.moveAllX = function(x){
          for (var i = 0; i < this.length; i++) {
            if (this[i].x+"1") {
              this[i].x += x;
            }
          }
          call();
          return this;
        };

        this.__proto__.moveAllY = function(y){
          for (var i = 0; i < this.length; i++) {
            if (this[i].y+"1") {
              this[i].y += y;
            }
          }
          call();
          return this;
        };

        this.__proto__.moveAll = function(x,y){
          this.moveAllX(x);
          this.moveAllY(y);
          call();
          return this;
        };

        this.__proto__.moveAllXD = function(x){
          for (var i = 0; i < this.length; i++) {
            if (this[i].x+"1") {
              this[i].x /= x;
            }
          }
          call();
          return this;
        };

        this.__proto__.moveAllYD = function(y){
          for (var i = 0; i < this.length; i++) {
            if (this[i].y+"1") {
              this[i].y /= y;
            }
          }
          call();
          return this;
        };

        this.__proto__.moveAllD = function(x,y){
          this.moveAllXD(x);
          this.moveAllYD(y);
          call();
          return this;
        };

        this.__proto__.closePath = function(){
          if (this[this.length-1].command == "Z") {return this;}
          this[this.length] = {};
          this[this.length].command = "Z";
          this.length++;
          call();
          return this;
        };
        this.__proto__.quadraticCurveTo = function(x1,y1,x,y){
          this[this.length] = {};
          this[this.length].command = "Q";
          this[this.length].x1 = parseFloat(x1);
          this[this.length].y1 = parseFloat(y1);
          this[this.length].x = parseFloat(x);
          this[this.length].y = parseFloat(y);
          this.length++;
          call();
          return this;
        };
        this.__proto__.bezierCurveTo = function(x1,y1,x2,y2,x,y){
          this[this.length] = {};
          this[this.length].command = "C";
          this[this.length].x1 = parseFloat(x1);
          this[this.length].y1 = parseFloat(y1);
          this[this.length].x2 = parseFloat(x2);
          this[this.length].y2 = parseFloat(y2);
          this[this.length].x = parseFloat(x);
          this[this.length].y = parseFloat(y);
          this.length++;
          call();
          return this;
        };

        this.__proto__.arc = function(x, y, radius, startAngle, endAngle, counterClockwise){
        startAngle = startAngle % (2*Math.PI);
        endAngle = endAngle % (2*Math.PI);
        if (startAngle === endAngle) {
            endAngle = ((endAngle + (2*Math.PI)) - 0.001 * (counterClockwise ? -1 : 1)) % (2*Math.PI);
        }
        var endX = x+radius*Math.cos(endAngle),
            endY = y+radius*Math.sin(endAngle),
            startX = x+radius*Math.cos(startAngle),
            startY = y+radius*Math.sin(startAngle),
            sweepFlag = counterClockwise ? 0 : 1,
            largeArcFlag = 0,
            diff = endAngle - startAngle;
        if (diff < 0) {
            diff += 2*Math.PI;
        }
        if (counterClockwise) {
            largeArcFlag = diff > Math.PI ? 0 : 1;
        } else {
            largeArcFlag = diff > Math.PI ? 1 : 0;
        }
        this.moveTo(startX, startY);
        this[this.length] = {};
        this[this.length].command = "A";
        this[this.length].rx = radius;
        this[this.length].ry = radius;
        this[this.length].xAxisRotation = 0;
        this[this.length].largeArcFlag = largeArcFlag;
        this[this.length].sweepFlag = sweepFlag;
        this[this.length].x = endX;
        this[this.length].y = endY;
        this.length++;
          call();
        return this;
        };

        this.__proto__.arcTo = function(x1, y1, x2, y2, radius){
        var x0 = this[this.length-1].x;
        var y0 = this[this.length-1].y;
        if (typeof x0 == "undefined" || typeof y0 == "undefined") {
            return;
        }
        if (radius < 0) {
            throw new Error("IndexSizeError: The radius provided (" + radius + ") is negative.");
        }
        if (((x0 === x1) && (y0 === y1))
            || ((x1 === x2) && (y1 === y2))
            || (radius === 0)) {
            this.lineTo(x1, y1);
            return;
        };

        var unit_vec_p1_p0 = normalize([x0 - x1, y0 - y1]);
        var unit_vec_p1_p2 = normalize([x2 - x1, y2 - y1]);
        if (unit_vec_p1_p0[0] * unit_vec_p1_p2[1] === unit_vec_p1_p0[1] * unit_vec_p1_p2[0]) {
            this.lineTo(x1, y1);
            return;
        }
        var cos = (unit_vec_p1_p0[0] * unit_vec_p1_p2[0] + unit_vec_p1_p0[1] * unit_vec_p1_p2[1]);
        var theta = Math.acos(Math.abs(cos));

        var unit_vec_p1_origin = normalize([
            unit_vec_p1_p0[0] + unit_vec_p1_p2[0],
            unit_vec_p1_p0[1] + unit_vec_p1_p2[1]
        ]);
        var len_p1_origin = radius / Math.sin(theta / 2);
        var x = x1 + len_p1_origin * unit_vec_p1_origin[0];
        var y = y1 + len_p1_origin * unit_vec_p1_origin[1];

        var unit_vec_origin_start_tangent = [
            -unit_vec_p1_p0[1],
            unit_vec_p1_p0[0]
        ];
        var unit_vec_origin_end_tangent = [
            unit_vec_p1_p2[1],
            -unit_vec_p1_p2[0]
        ];
        var getAngle = function (vector) {
            var x = vector[0];
            var y = vector[1];
            if (y >= 0) {
                return Math.acos(x);
            } else {
                return -Math.acos(x);
            }
        };
        var startAngle = getAngle(unit_vec_origin_start_tangent);
        var endAngle = getAngle(unit_vec_origin_end_tangent);

        this.moveTo(x + unit_vec_origin_start_tangent[0] * radius,
                    y + unit_vec_origin_start_tangent[1] * radius);
        this.arc(x, y, radius, startAngle, endAngle);
          call();
        return this;
        };

        this.__proto__.svgArc = function(rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y){
          this[this.length] = {};
          this[this.length].command = "A";
          this[this.length].rx = rx;
          this[this.length].ry = ry;
          this[this.length].xAxisRotation = xAxisRotation;
          this[this.length].largeArcFlag = largeArcFlag;
          this[this.length].sweepFlag = sweepFlag;
          this[this.length].x = x;
          this[this.length].y = y;
          this.length++;
          call();
        return this;
        };
        this.__proto__.rect = function(x, y, width, height, rx = 0, ry = 0){
          if (rx > width/2) rx = w/2;
          if (ry > height/2) ry = h/2;
          var round = false;
          if (rx != 0 || ry != 0) {round = true;}
          this.moveTo(x+rx, y);
          this.lineTo(x+width-rx, y);
          if (round) {
          this.svgArc(rx,ry,0,0,(rx*ry<0?0:1),x+width,y+ry);
          }
          this.lineTo(x+width, y+height-ry);
          if (round) {
          this.svgArc(rx,ry,0,0,(rx*ry<0?0:1),x+width-rx,y+height);
          }
          this.lineTo(x+rx, y+height);
          if (round) {
          this.svgArc(rx,ry,0,0,(rx*ry<0?0:1),x,y+height-ry);
          }
          this.lineTo(x, y+ry);
          if (round) {
          this.svgArc(rx,ry,0,0,(rx*ry<0?0:1),x+rx,y);
          }
          this.closePath();
          call();
        return this;
        };



        this.__proto__.svgEllipse = function(cx, cy, rx, ry){
          this.moveTo(cx, (cy-ry));
          this.svgArc(rx,ry,0,0,0,cx,(cy+ry));
          this.svgArc(rx,ry,0,0,0,cx,(cy-ry));
          this.closePath();
          call();
        return this;
        };

        this.__proto__.ellipse = function(cx, cy, rx, ry, rotation__NotExact, startAngle, endAngle,counterClockwise,asLine = false){
        rotation__NotExact = rotation__NotExact*180/Math.PI;
        startAngle = startAngle % (2*Math.PI);
        endAngle = endAngle % (2*Math.PI);
        if (startAngle === endAngle) {
            endAngle = ((endAngle + (2*Math.PI)) - 0.001 * (counterClockwise ? -1 : 1)) % (2*Math.PI);
        }
        var endX = cx+rx*Math.cos(endAngle),
            endY = cy+ry*Math.sin(endAngle),
            startX = cx+rx*Math.cos(startAngle),
            startY = cy+ry*Math.sin(startAngle),
            sweepFlag = counterClockwise ? 0 : 1,
            largeArcFlag = 0,
            diff = endAngle - startAngle;
        if (diff < 0) {
            diff += 2*Math.PI;
        }
        if (counterClockwise) {
            largeArcFlag = diff > Math.PI ? 0 : 1;
        } else {
            largeArcFlag = diff > Math.PI ? 1 : 0;
        }
        if (asLine) {
          this.lineTo(startX, startY);
        }else{
          this.moveTo(startX, startY);
        };

        if (rx || ry) {
        this[this.length] = {};
        this[this.length].command = "A";
        this[this.length].rx = rx;
        this[this.length].ry = ry;
        this[this.length].xAxisRotation = rotation__NotExact;
        this[this.length].largeArcFlag = largeArcFlag;
        this[this.length].sweepFlag = sweepFlag;
        this[this.length].x = endX;
        this[this.length].y = endY;
        this.length++;
        }
          call();
        return this;
        }

        this.__proto__.circle = function(cx, cy, r){
          var rh = r/2;
          this.moveTo(cx, (cy-r));
          this.svgArc(rh,rh,0,0,0,cx,(cy+r));
          this.svgArc(rh,rh,0,0,0,cx,(cy-r));
          this.closePath();
          call();
        return this;
        };

        this.__proto__.polyline = function(points){
          if (typeof points == "string") {
            points = points.split(" ");
            this.moveTo(points[0].split(",")[0],points[0].split(",")[1])
          for (var i = 0; i < points.length; i++) {
            this.lineTo(points[i].split(",")[0],points[i].split(",")[1])
          }
        }else{
          for (var i = 0; i < points.length; i++) {
            this.lineTo(points[i].x,points[i].y)
          }
        }
          call();
        return this;
        };

        this.__proto__.canvas = function(canvas,options = {}){
          var ctx = canvas.getContext("2d");
          var PathData = "";
          var _this = this;
          for (let x in options) {
            ctx[x] = options[x];
          }
          ctx.beginPath();

            var a2b = function(curves){
              const TAU=2*Math.PI,mapToEllipse=({x:t,y:a},r,e,o,s,n,h)=>{return{x:o*(t*=r)-s*(a*=e)+n,y:s*t+o*a+h}},approxUnitArc=(t,a)=>{const r=1.5707963267948966===a?.551915024494:-1.5707963267948966===a?-.551915024494:4/3*Math.tan(a/4),e=Math.cos(t),o=Math.sin(t),s=Math.cos(t+a),n=Math.sin(t+a);return[{x:e-o*r,y:o+e*r},{x:s+n*r,y:n-s*r},{x:s,y:n}]},vectorAngle=(t,a,r,e)=>{let o=t*r+a*e;return o>1&&(o=1),o<-1&&(o=-1),(t*e-a*r<0?-1:1)*Math.acos(o)},getArcCenter=(t,a,r,e,o,s,n,h,M,c,p,l)=>{const x=Math.pow(o,2),i=Math.pow(s,2),A=Math.pow(p,2),y=Math.pow(l,2);let T=x*i-x*y-i*A;T<0&&(T=0),T/=x*y+i*A;const u=(T=Math.sqrt(T)*(n===h?-1:1))*o/s*l,w=T*-s/o*p,g=c*u-M*w+(t+r)/2,U=M*u+c*w+(a+e)/2,m=(p-u)/o,b=(l-w)/s,E=(-p-u)/o,f=(-l-w)/s;let q=vectorAngle(1,0,m,b),v=vectorAngle(m,b,E,f);return 0===h&&v>0&&(v-=TAU),1===h&&v<0&&(v+=TAU),[g,U,q,v]},arcToBezier=({px:t,py:a,cx:r,cy:e,rx:o,ry:s,xAxisRotation:n=0,largeArcFlag:h=0,sweepFlag:M=0})=>{const c=[];if(0===o||0===s)return[];const p=Math.sin(n*TAU/360),l=Math.cos(n*TAU/360),x=l*(t-r)/2+p*(a-e)/2,i=-p*(t-r)/2+l*(a-e)/2;if(0===x&&0===i)return[];o=Math.abs(o),s=Math.abs(s);const A=Math.pow(x,2)/Math.pow(o,2)+Math.pow(i,2)/Math.pow(s,2);A>1&&(o*=Math.sqrt(A),s*=Math.sqrt(A));let[y,T,u,w]=getArcCenter(t,a,r,e,o,s,h,M,p,l,x,i),g=Math.abs(w)/(TAU/4);Math.abs(1-g)<1e-7&&(g=1);const U=Math.max(Math.ceil(g),1);w/=U;for(let t=0;t<U;t++)c.push(approxUnitArc(u,w)),u+=w;return c.map(t=>{const{x:a,y:r}=mapToEllipse(t[0],o,s,l,p,y,T),{x:e,y:n}=mapToEllipse(t[1],o,s,l,p,y,T),{x:h,y:M}=mapToEllipse(t[2],o,s,l,p,y,T);return{x1:a,y1:r,x2:e,y2:n,x:h,y:M}})};
              return arcToBezier(curves);
            }

          function last(index,name){
            for (var i = index - 1; i >= 0; i--) {
                if (_this[i][name]) {
                return _this[i][name];
                break;
              }
            }
            return 0;
          }

          for (var i = 0; i < this.length; i++) {
            var name = this[i].command;
            var arr = this[i];
            if (name == "M" || name == "L" || name == "T") {
              if (name == "M"){
                ctx.moveTo(arr.x,arr.y);
              };
              if (name == "L") {
                ctx.lineTo(arr.x,arr.y);
              };
              if (name == "T") {
              if (this[i-1].command == 'Q' || this[i-1].command == 'T') {
                var quadX = last(i,"x") * 2 - last(i,"x1");
                var quadY = last(i,"y") * 2 - last(i,"y1");
              } else {
                var quadX = last(i,"x");
                var quadY = last(i,"y");
              }
              ctx.bezierCurveTo(last(i,"x"),last(i,"y"),quadX,quadY,arr.x,arr.y);
              }
            }
            if (name == "H") {
                ctx.lineTo(arr.x,last(i,"y"));
            }
            if (name == "V") {
                ctx.lineTo(last(i,"x"),arr.y);
            };
            if (name == "C") {
              ctx.bezierCurveTo(arr.x1,arr.y1,arr.x2,arr.y2,arr.x,arr.y);
            }
            if (name == "S") {
              var x = last(i,"x");
              var y = last(i,"y");
            if (this[i-1].command == 'C' || this[i-1].command == 'S') {
              x += x - last(i,"x2");
              y += y - last(i,"y2");
            }
              ctx.bezierCurveTo(x,y,arr.x2,arr.y2,arr.x,arr.y);
            };
            if (name == "Q") {
              ctx.quadraticCurveTo(arr.x1,arr.y1,arr.x,arr.y);
            };
            if (name == "A") {
              var curves = a2b({
                px: last(i,"x"),
                py: last(i,"y"),
                cx: arr.x,
                cy: arr.y,
                rx: arr.rx,
                ry: arr.ry,
                xAxisRotation: arr.xAxisRotation,
                largeArcFlag: arr.largeArcFlag,
                sweepFlag: arr.sweepFlag,
              }); 
             for (var i = 0; i < curves.length; i++) {
                ctx.bezierCurveTo(curves[i].x1,curves[i].y1,curves[i].x2,curves[i].y2,curves[i].x,curves[i].y);
             }
            };
            if (name == "Z") {
              ctx.closePath();
            };
          }
          ctx.stroke();
          ctx.fill();
          return this;
        };

        this.__proto__.polygon = function(points){
          if (typeof points == "string") {
            points = points.split(" ");
            this.moveTo(points[0].split(",")[0],points[0].split(",")[1])
          for (var i = 0; i < points.length; i++) {
            this.lineTo(points[i].split(",")[0],points[i].split(",")[1])
          }
        }else{
          for (var i = 0; i < points.length; i++) {
            this.lineTo(points[i].x,points[i].y)
          }
        }
        this.closePath();
          call();
        return this;
        };

      };
      var commands = new JuaPathCommands();
      var arrays = new Array();
      for (var i = 0; i < data.length; i++) {
        if (isNaN(data[i])) {
          commands[commands.length] = {};
          commands[commands.length].command = data[i];
          commands.length++
        }else{
          if (!arrays[commands.length-1]) {
            arrays[commands.length-1] = new Array();
          }
          arrays[commands.length-1][arrays[commands.length-1].length] = parseFloat(data[i]);
        }
      }

      for (var i = 0; i < commands.length; i++) {
        var name = commands[i].command.toUpperCase();
        var array = arrays[i];
        var cc = commands[i];
        if (name == "M" || name == "L" || name == "T") {
          cc.x = array[0];
          cc.y = array[1];
        };
        if (name == "H") {
          cc.x = array[0];
        };
        if (name == "V") {
          cc.y = array[0];
        };
        if (name == "C") {
          cc.x1 = array[0];
          cc.y1 = array[1];
          cc.x2 = array[2];
          cc.y2 = array[3];
          cc.x = array[4];
          cc.y = array[5];
        };
        if (name == "S") {
          cc.x2 = array[0];
          cc.y2 = array[1];
          cc.x = array[2];
          cc.y = array[3];
        };
        if (name == "Q") {
          cc.x1 = array[0];
          cc.y1 = array[1];
          cc.x = array[2];
          cc.y = array[3];
        };
        if (name == "A") {
          cc.rx = array[0];
          cc.ry = array[1];
          cc.xAxisRotation = array[2];
          cc.largeArcFlag = array[3];
          cc.sweepFlag = array[4];
          cc.x = array[5];
          cc.y = array[6];
        };
      }
    return commands;
    };
    if (node || typeof data != "string") {}{
      var i = Jua.path(Jua(data).class("d").replaceAll('path("',"").replaceAll('")',""));
      var elem = data;
      i.addListener(function(){elem.attr("d",i.toPathData());});
      i.target = data;
      return i;
    }
  }


this.toPath = function(el){
el = Jua(el).node;
  var names = {
    path:true,
    ellipse:true,
    line:true,
    g:true,
    path:true,
    polyline:true,
    polygon:true,
    rect:true,
  }

if ("fonts" in navigator) {names.text = true;names.tspan = true;}


if (el.tagName in names) {}else{return el.cloneNode(true);};

  var doc = el.ownerDocument;
  var transform = new WebKitCSSMatrix(window.getComputedStyle(el).transform);
  var svg = el.ownerSVGElement;
  if (el.tagName.toLowerCase() == "svg") {svg = el;};
  var svgNS = svg.getAttribute('xmlns') || "http://www.w3.org/2000/svg";

for (var i = 0; i < el.attributes.length; i++) {
  var computed = window.getComputedStyle(el);
  var name = el.attributes[i].name;
  if (computed[name]) {
    el.setAttribute(name,computed[name].replaceAll("px",""))
  }
}
  if (!transform) transform = svg.createSVGMatrix();

  var localMatrix = svg.createSVGMatrix();
  for (var xs=el.transform.baseVal,i=xs.numberOfItems-1;i>=0;--i){
    localMatrix = xs.getItem(i).matrix.multiply(localMatrix);
  }
  transform = transform.multiply(localMatrix);

function group(){
      for (var i = 0; i < el.children.length; i++) {
      el.replaceChild(toPath(el.children[i]),el.children[i])
    }
    return el;
}

  var path = doc.createElementNS(svgNS,'path');
  switch(el.tagName){
  case 'g':
  return group();
  break;
    
    case 'rect':
    if(el.getAttribute('stroke')){path.setAttribute('stroke',el.getAttribute('stroke'))}
    if(el.getAttribute('fill')){path.setAttribute('fill',el.getAttribute('fill'))}
    if(el.getAttribute('stroke-width')){path.setAttribute('stroke-width',el.getAttribute('stroke-width'))}

      var x  = el.getAttribute('x')*1,     y  = el.getAttribute('y')*1,
          w  = el.getAttribute('width')*1, h  = el.getAttribute('height')*1,
          rx = el.getAttribute('rx')*1,    ry = el.getAttribute('ry')*1;
      if (rx && !el.hasAttribute('ry')) ry=rx;
      else if (ry && !el.hasAttribute('rx')) rx=ry;
      if (rx>w/2) rx=w/2;
      if (ry>h/2) ry=h/2;
      path.setAttribute('d',
        'M'+(x+rx)+','+y+
        ' L'+(x+w-rx)+','+y+
        ((rx||ry) ? (' A'+rx+','+ry+',0,0,'+(rx*ry<0?0:1)+','+(x+w)+','+(y+ry)) : '') +
        ' L'+(x+w)+','+(y+h-ry)+
        ((rx||ry) ? (' A'+rx+','+ry+',0,0,'+(rx*ry<0?0:1)+','+(x+w-rx)+','+(y+h)) : '')+
        ' L'+(x+rx)+','+(y+h)+
        ((rx||ry) ? (' A'+rx+','+ry+',0,0,'+(rx*ry<0?0:1)+','+x+','+(y+h-ry)) : '')+
        ' L'+x+','+(y+ry)+
        ((rx||ry) ? (' A'+rx+','+ry+',0,0,'+(rx*ry<0?0:1)+','+(x+rx)+','+y) : '')
      );
    break;

    case 'circle':
      var cx = el.getAttribute('cx')*1, cy = el.getAttribute('cy')*1,
          r  = el.getAttribute('r')*1,  r0 = r/2+','+r/2;
      path.setAttribute('d','M'+cx+','+(cy-r)+' A'+r0+',0,0,0,'+cx+','+(cy+r)+' '+r0+',0,0,0,'+cx+','+(cy-r) );
    break;

    case 'ellipse':
      var cx = el.getAttribute('cx')*1, cy = el.getAttribute('cy')*1,
          rx = el.getAttribute('rx')*1, ry = el.getAttribute('ry')*1;
      path.setAttribute('d','M'+cx+','+(cy-ry)+' A'+rx+','+ry+',0,0,0,'+cx+','+(cy+ry)+' '+rx+','+ry+',0,0,0,'+cx+','+(cy-ry) );
    break;

    case 'line':
      var x1=el.getAttribute('x1')*1, y1=el.getAttribute('y1')*1,
          x2=el.getAttribute('x2')*1, y2=el.getAttribute('y2')*1;
      path.setAttribute('d','M'+x1+','+y1+'L'+x2+','+y2);
    break;

    case 'polyline':
    case 'polygon':
      for (var i=0,l=[],pts=el.points,len=pts.numberOfItems;i<len;++i){
        var p = pts.getItem(i);
        l[i] = p.x+','+p.y;
      }
      path.setAttribute('d',"M"+l.shift()+"L"+l.join(' ') + (el.tagName=='polygon') ? 'z' : '');
    break;

    case 'path':
      path = el.cloneNode(false);
    break;
  }


  var x,y;
  var pt = svg.createSVGPoint();
  var setXY = function(x,y,xN,yN){
    pt.x = x; pt.y = y;
    pt = pt.matrixTransform(transform);
    if (xN) seg[xN] = pt.x;
    if (yN) seg[yN] = pt.y;
  };

  var rotation = Math.atan2(transform.b,transform.d)*180/Math.PI;
  var sx = Math.sqrt(transform.a*transform.a+transform.c*transform.c);
  var sy = Math.sqrt(transform.b*transform.b+transform.d*transform.d);


  for (var segs=path.pathLength.baseVal,c=segs.numberOfItems,i=0;i<c;++i){
    var seg = segs.getItem(i);

    var isRelative = (seg.pathSegType%2==1);
    var hasX = seg.x != null;
    var hasY = seg.y != null;
    if (hasX) x = isRelative ? x+seg.x : seg.x;
    if (hasY) y = isRelative ? y+seg.y : seg.y;
    if (hasX || hasY) setXY( x, y, hasX && 'x', hasY && 'y' );

    if (seg.x1 != null) setXY( seg.x1, seg.y1, 'x1', 'y1' );
    if (seg.x2 != null) setXY( seg.x2, seg.y2, 'x2', 'y2' );
    if (seg.angle != null){
      seg.angle += rotation;
      seg.r1 *= sx;
      seg.r2 *= sy;
    }
  }


  return path;
};


this.PI = 22/7;

this.options = function(){
return Jua();
};

this.isJua = function(node){
  if (node) {if(typeof node == "object"){if (node.Jua) {return true;}}}else{
   throw new Error("This is "+node+" we Don't check it")
  }

  return false;
}
this.doc = function(documen){
if (Jua.typeof(documen) == "document") {
  ownerDoc = documen;

}else{
return Jua(ownerDoc);
   throw new Error(documen+" is not typeof ownerDoc !");
}
return Jua(ownerDoc);
};


this.__proto__.about = {
    name:"Jua.js",
    author:"Santhosh.S",
    version: "1.0",
}
this.about = {
    name:"Jua.js",
    author:"Santhosh.S",
    version: "1.0",
}


this.replaceElement = function(  wantToReplaceElement  ,  toReplaceElement  ){
  
  if (Jua().isJua(wantToReplaceElement)) { wantToReplaceElement = wantToReplaceElement.node;}
  if (Jua().isJua(toReplaceElement)) { toReplaceElement = toReplaceElement.node;}

  if (typeof wantToReplaceElement == "object" && typeof toReplaceElement == "object") {
  if (wantToReplaceElement.parentNode) {
    for (var i = 0; i < wantToReplaceElement.children.length; i++) {
      toReplaceElement.appendChild(wantToReplaceElement.children[i])
    }
    wantToReplaceElement.parentNode.replaceChild(toReplaceElement, wantToReplaceElement);
  }else{
   throw new Error("Can't get Parent Node For Given Element !")
  }
  return toReplaceElement;
  }else{
    var Element = "";
    if (typeof wantToReplaceElement != "object") {Element += wantToReplaceElement;}
      if (typeof toReplaceElement != "object") {Element +=  toReplaceElement;}

    
  throw new Error("On Replace "+typeof Element+" "+Element+" Not typeof Node");
     return "You Got An Error Check In Console";
  }
};

this.uniformDeg = function(deg){
 deg = deg - (parseInt(deg/360)*360);
 deg = (deg < 0) ? deg+360:deg;
  return deg;
}

 this.hslToRgb = function(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


this.rgbToHsl = function(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

this.rgbToHex = function(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



this.hexToRgb = function(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgb('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+')';
    }
    throw new Error('Bad Hex');
}

this.write = function(selector,text,speed,type){
 speed = (speed == 0) ? 0:speed || 100;
if (type) {
  if(type.toLowerCase() == "html"){type = "html";}
  if(type.toLowerCase() == "text"){type = "text";}
  if(type.toLowerCase() == "val"){type = "val";}
}else{
if (Jua(selector).tagName().toLowerCase() == "input" || Jua(selector).tagName().toLowerCase() == "textarea") {
   type = "val";
}else{
   type = "text";
}
}
  text = Jua.decode(text);
for (var i = 0; i < text.toString().length+1; i++) {
 set(selector,i,text,Number(speed),type);
}
}

function set(selector,i,w,speed,type){
  setTimeout(function() {
    Jua(selector)[type](w.substring(0,i));
},i*speed);
}


this.resizable = function(elmnt,pos,type){
if (pos == undefined || pos.toLowerCase() != "x" && pos.toLowerCase() != "y" ) { pos = undefined;}
if (Jua().isJua(elmnt)) { elmnt = elmnt.node;}
  if(Jua(elmnt).class("position") == "static"){
    Jua(elmnt).class("position","absolute")
  }
    Jua(elmnt).class("user-select","none")

const $elem = elmnt;
type = type;
var lCursor = Jua($elem).class("cursor");
var pas = undefined;
var ctrlKey = false; 

var textNodes = {h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",p:"p",text:"text",input:"input",ul:"ul",ol:"ol",span:"span",path:"path",polygon:"polygon",};
if (type == "normal") {type = "normal"}else{if (type == "text" || $elem.tagName.toLowerCase() in textNodes) {type = "text"}else{type = "normal";}};

window.addEventListener("keydown",function(e){if (e.ctrlKey) {ctrlKey = true;}});
window.addEventListener("keyup",function(e){if (!e.ctrlKey) {ctrlKey = false;}});

const mutable = function(e) {

  const h = parseFloat(Jua(this).class("height")) * parseFloat(new WebKitCSSMatrix(Jua(this).class("transform"))["d"]);
  const w = parseFloat(Jua(this).class("width")) * parseFloat(new WebKitCSSMatrix(Jua(this).class("transform"))["a"]);

  const t = this.offsetTop - parseFloat(Jua(this).class("margin-top"));
  const l = this.offsetLeft - parseFloat(Jua(this).class("margin-left"));

  const y = t + h - e.pageY;
  const x = l + w - e.pageX;
  
 
  const hasResized = () =>
    !(w === parseFloat(Jua(this).class("width")) * parseFloat(new WebKitCSSMatrix(Jua(this).class("transform"))["a"]) && h === parseFloat(Jua(this).class("height")) * parseFloat(new WebKitCSSMatrix(Jua(this).class("transform"))["d"]));
  
  function gg(e){resize(e,pas)};
  
  const resize = (e,ss) => {
   if (ss == undefined || ss == "") {
if (ctrlKey) {
  var calc = 0;
  if (e.pageX < e.pageY) {calc = e.pageY;}
  if (e.pageX > e.pageY) {calc = e.pageX;}
      this.style.width = `${(calc - l + x)}px`;
    this.style.height = `${(calc - t + y)}px`;
     if (type == "text") {
       var clas = Jua($elem);
       var elemNew = Jua($elem.cloneNode(true));
       var matrix = new WebKitCSSMatrix(clas.class("transform"));
       elemNew.class("width","max-content");
       elemNew.class("height","max-content");
       elemNew.class("position","fixed");
       elemNew.class("top","500000000000000000000000000000000000000000000px");
       elemNew.class("left","500000000000000000000000000000000000000000000px");
       ownerDoc.body.appendChild(elemNew.node)
       this.style.transformOrigin = "0px 0px";
       this.style.transform = "matrix("+(parseFloat(clas.class("width"))/parseFloat(elemNew.class("width")))+","+matrix["b"]+","+matrix["c"]+","+(parseFloat(clas.class("height"))/parseFloat(elemNew.class("height")))+","+matrix["e"]+","+matrix["f"]+")";
       this.style.height = "max-content";
       this.style.width = "max-content";
       ownerDoc.body.removeChild(elemNew.node)
   };
}else{
      this.style.width = `${(e.pageX - l + x)}px`;
    this.style.height = `${(e.pageY - t + y)}px`;
     if (type == "text") {
       var clas = Jua($elem);
       var elemNew = Jua($elem.cloneNode(true));
       var matrix = new WebKitCSSMatrix(clas.class("transform"));
       elemNew.class("width","max-content");
       elemNew.class("height","max-content");
       elemNew.class("position","fixed");
       elemNew.class("top","500000000000000000000000000000000000000000000px");
       elemNew.class("left","500000000000000000000000000000000000000000000px");
       ownerDoc.body.appendChild(elemNew.node)
       this.style.transformOrigin = "0px 0px";
       this.style.transform = "matrix("+(parseFloat(clas.class("width"))/parseFloat(elemNew.class("width")))+","+matrix["b"]+","+matrix["c"]+","+(parseFloat(clas.class("height"))/parseFloat(elemNew.class("height")))+","+matrix["e"]+","+matrix["f"]+")";
       this.style.height = "max-content";
       this.style.width = "max-content";
       ownerDoc.body.removeChild(elemNew.node)
   };
}
   }else{
    if (ss == "x") {this.style.width = `${(e.pageX - l + x)}px`;  
if (type == "text") {
       var clas = Jua($elem);
       var elemNew = Jua($elem.cloneNode(true));
       var matrix = new WebKitCSSMatrix(clas.class("transform"));
       elemNew.class("width","max-content");
       elemNew.class("height","max-content");
       elemNew.class("position","fixed");
       elemNew.class("top","500000000000000000000000000000000000000000000px");
       elemNew.class("left","500000000000000000000000000000000000000000000px");
       ownerDoc.body.appendChild(elemNew.node)
       this.style.transformOrigin = "0px 0px";
       this.style.transform = "matrix("+(parseFloat(clas.class("width"))/parseFloat(elemNew.class("width")))+","+matrix["b"]+","+matrix["c"]+","+matrix["d"]+","+matrix["e"]+","+matrix["f"]+")";
       this.style.height = "max-content";
       this.style.width = "max-content";
       ownerDoc.body.removeChild(elemNew.node)
   };
  }
    if (ss == "y") {this.style.height = `${(e.pageY - t + y)}px`;  
if (type == "text") {
       var clas = Jua($elem);
       var elemNew = Jua($elem.cloneNode(true));
       var matrix = new WebKitCSSMatrix(clas.class("transform"));
       elemNew.class("width","max-content");
       elemNew.class("height","max-content");
       elemNew.class("position","fixed");
       elemNew.class("top","500000000000000000000000000000000000000000000px");
       elemNew.class("left","500000000000000000000000000000000000000000000px");
       ownerDoc.body.appendChild(elemNew.node)
       this.style.transformOrigin = "0px 0px";
       this.style.transform = "matrix("+matrix["a"]+","+matrix["b"]+","+matrix["c"]+","+(parseFloat(clas.class("height"))/parseFloat(elemNew.class("height")))+","+matrix["e"]+","+matrix["f"]+")";
       this.style.height = "max-content";
       this.style.width = "max-content";
       ownerDoc.body.removeChild(elemNew.node)
   };
  }
   }
  

  }
  
  
  const unresize = (e) => {
    ownerDoc.removeEventListener('mousemove', resize);
    ownerDoc.removeEventListener('mousemove', gg);
    ownerDoc.removeEventListener("mouseup", unresize);
    if (hasResized(e)) this.dispatchEvent(new Event('resized'));
    else this.dispatchEvent(new Event('clicked'));
    e.preventDefault();
  }
 

 if(pos == undefined || pos == ""){ 

  if (x < 5 && y < 5) {
    ownerDoc.addEventListener("mousemove", resize);
    ownerDoc.addEventListener("mouseup", unresize);
    e.preventDefault();
  }else{
        if (x < 5) {
          pas = "x";
    ownerDoc.addEventListener("mousemove", gg);
    ownerDoc.addEventListener("mouseup", unresize);
    e.preventDefault();
  }else{
        if (y < 5) {
          pas = "y";
    ownerDoc.addEventListener("mousemove", gg);
    ownerDoc.addEventListener("mouseup", unresize);
    e.preventDefault();
  } 
  }
  }

}else{
    if (pos.toLowerCase() == "x" && x < 5) {
      pas = "x";
    ownerDoc.addEventListener("mousemove", gg);
    ownerDoc.addEventListener("mouseup", unresize);
    e.preventDefault();
  } 

  if (pos.toLowerCase() == "y" && y < 5) {
    pas = "y";
    ownerDoc.addEventListener("mousemove",  gg);
    ownerDoc.addEventListener("mouseup", unresize);
    e.preventDefault();
  }
  }

  

}

$elem.addEventListener("mousedown", mutable);
window.addEventListener("mousemove", function(e){

 const h = parseFloat(Jua($elem).class("height")) * parseFloat(new WebKitCSSMatrix(Jua($elem).class("transform"))["d"]);
  const w = parseFloat(Jua($elem).class("width")) * parseFloat(new WebKitCSSMatrix(Jua($elem).class("transform"))["a"]);


  const t = $elem.offsetTop - parseFloat(Jua($elem).class("margin-top"));
  const l = $elem.offsetLeft - parseFloat(Jua($elem).class("margin-left"));

  const y = t + h - e.pageY;
  const x = l + w - e.pageX;

if (pos == undefined || pos == "") {

if(x < 5 && y < 5){ $elem.style.cursor = "se-resize"; }else{
if(y < 5){ $elem.style.cursor = "s-resize"; }else{if(x < 5){ $elem.style.cursor = "e-resize"; }else{$elem.style.cursor = lCursor;};};
};



}else{

if(pos == "y" && y < 5){ $elem.style.cursor = "s-resize"; }else{if(pos == "x" && x < 5){ $elem.style.cursor = "e-resize"; }else{$elem.style.cursor = lCursor;};};


}

})


}


this.draggable = function(elmnt) {
  const $elem = elmnt;
    Jua(elmnt).class("user-select","none");

  if(Jua(elmnt).class("position") == "static"){
    Jua(elmnt).class("position","absolute")
  }

    Jua(elmnt).class("cursor","move");

const mutable = function(e) {
 const h = parseFloat(Jua($elem).class("height")) * parseFloat(new WebKitCSSMatrix(Jua($elem).class("transform"))["d"]);
  const w = parseFloat(Jua($elem).class("width")) * parseFloat(new WebKitCSSMatrix(Jua($elem).class("transform"))["a"]);

  const t = this.offsetTop - parseFloat(Jua(this).class("margin-top"));
  const l = this.offsetLeft - parseFloat(Jua(this).class("margin-left"));

  const y = e.pageY - (t + h);
  const x = e.pageX - (l + w);
  
  const hasMoved = () =>
    !(t === this.offsetTop && l === this.offsetLeft);
  
  
  
  const follow = (e) => {
    this.style.top = `${e.pageY - y - h}px`;
    this.style.left = `${e.pageX - x - w}px`;
  }
  
  
  const unfollow = (e) => {
    ownerDoc.removeEventListener('mousemove', follow);
    ownerDoc.removeEventListener("mouseup", unfollow);
    if (hasMoved(e)) this.dispatchEvent(new Event('moved'));
    else this.dispatchEvent(new Event('clicked'));
    e.preventDefault();
  }
  
  if (x > 5 && y > 5) {
    ownerDoc.addEventListener("mousemove", follow);
    ownerDoc.addEventListener("mouseup", unfollow);
    e.preventDefault();
  }else{
  }

}

$elem.addEventListener("mousedown", mutable);


};


this.timer = function(){
  var starting = "";
  var pause = 0;
  starting = Date.now();
   var now = 0;
return {now:function(){return {ms:Date.now() - starting,s: (Date.now() - starting)/1000,}}};
}


this.animation = function(selector){
  return new animation(selector);
}


this.copy = function(text){
  var aux = ownerDoc.createElement("input");
  var active = "";
  active = generateQuerySelector(ownerDoc.activeElement);
  aux.setAttribute("value", text);
  ownerDoc.body.appendChild(aux);
  aux.select();
  ownerDoc.execCommand("copy");
  ownerDoc.body.removeChild(aux);
  if (active) {Jua.select(active).focus();};
}






   this.getFromUrl = function(value){
                var idx = ownerDoc.URL.indexOf('?');
                var params = new Array();
                if (idx != -1) {
                    var pairs = ownerDoc.URL.substring(idx+1, ownerDoc.URL.length).split('&');
                    for (var i = 0; i < pairs.length; i++){
                        var nameVal = pairs[i].split('=');
                        params[nameVal[0]] = nameVal[1];
                    }
             var obj = params[value];
           if(obj){
             var returnValue = decodeURIComponent(obj.replace(/\+/g,  " "));
             return returnValue;
           }else{
             return false;
           }
                }
            };

    this.decode = function (html) {
  var txt = ownerDoc.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

  this.encode = function (html) {
  var txt = ownerDoc.createElement('textarea');
  txt.textContent = html;
  return txt.innerHTML;
};



this.toggleFunc = function(){
var funcs = new Array();
var num = 0;
var FuncName = "";
for (var i = 0; i < arguments.length; i++) {
 if (typeof arguments[i] == "function") {
   FuncName += name+arguments[i].name+arguments[i].value;
   funcs[num] = arguments[i];
   num++;
 }
}


if (funcs[window[FuncName]]) {
funcs[window[FuncName]]({length:funcs.length,curent:window[FuncName],name:funcs[window[FuncName]].name});
window[FuncName]++;
}else{
  window[FuncName] = 0;
funcs[window[FuncName]]({length:funcs.length,curent:window[FuncName],name:funcs[window[FuncName]].name});
window[FuncName]++;

}
}

this.formatHTML = function (html) {
    var tab = '\t';
    var result = '';
    var indent= '';

    html.split(/>\s*</).forEach(function(element) {
        if (element.match( /^\/\w/ )) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")  ) { 
            indent += tab;              
        }
    });

    return result.substring(1, result.length-3);
};

this.ready = function(callback){
  if  (ownerDoc.readyState === "complete" || ownerDoc.readyState === "interactive") {
   setTimeout(callback, 1);;
  } else { 
    ownerDoc.addEventListener("DOMContentLoaded", callback);
  }
  };

this.record = function(elem,fps,fileName){
   if (!fileName) {fileName = "untitled";}
elem = Jua(elem)[0].node;
fps = fps || 25;
var recorder = {};
var recordee = new MediaRecorder(elem.captureStream(fps));
recorder.start = function(){recordee.start()};
recorder.pause = function(){recordee.pause()};
recorder.resume = function(){recordee.resume()};
recorder.save = function(){setTimeout(function() {recordee.ondataavailable = e => {Jua.download(fileName,e.data,true)};recordee.stop()}, 1000);}
return recorder;
}




 this.download = function(filename, data, isBlob) {
  var text = data;
    var element = ownerDoc.createElement('a');
   if (isBlob) {
     element.setAttribute('href', URL.createObjectURL(text));
   }else{
     element.setAttribute('href', URL.createObjectURL(new Blob([text])));
   }
   if (!filename) {fileName = "untitled";}
    element.setAttribute('download', filename);
    element.style.display = 'none';
    ownerDoc.body.appendChild(element);
    element.click();
    ownerDoc.body.removeChild(element);
};

 this.createParent = function(element,parentElement){
if (Jua().isJua(element)) { element = element.node;}

if (Jua().isJua(parentElement)) { parentElement = parentElement.node;}

var parentElement = parentElement.cloneNode(true);
parentElement.appendChild(element.cloneNode(true));
var elem = Jua.replaceElement(element,parentElement);

for (var i = 0; i < elem.childNodes.length; i++) {
  if(elem.childNodes[i].cloneNode(true).isSameNode(element.cloneNode(true))){
    elem = elem.childNodes[i];
  }
}

return Jua(elem);
 }

this.stringToNode = function(text){
  var e = Jua.new("div");
  e.node.innerHTML = text;
  return e.node.children[0];
};

this.nodeToString = function(node){
node = Jua(node);
var serializer = new XMLSerializer();
  return serializer.serializeToString(node.node);
}

this.get = function(path,callback){
 const xhttp = new XMLHttpRequest();
 var g = "";
 var status = "sucess";
  xhttp.onload = function(e){g = this.responseText;status = this.status; if(this.status == 200){status = "failed";};if(this.status == 403){status = "failed";};if(this.status == 404){status = "failed";};callback(this.responseText,status,this,e);};
  xhttp.open("GET", path);
  xhttp.send();
  return g;
}

this.random = function(array){
 if (arguments.length == 1) {
   return array[Math.floor(Math.random() * array.length)];
 }else{
   return arguments[Math.floor(Math.random() * arguments.length)];
 }
}


this.randomNumber = function(max = 10){
   return Math.floor(Math.random() * max);
}

 this.read = function( file, callback , type){
  type = type || "dataurl";
    if (typeof callback == "function") {
        var reader = new FileReader();
      reader.onload = function(){
        if (typeof callback == "function") {callback(reader.result,file,type);}
      };
      if (type.toLowerCase().search("dataurl") != -1) {  reader.readAsDataURL(file)  };
      if (type.toLowerCase().search("binary") != -1) {  reader.readAsBinaryString(file)  };
      if (type.toLowerCase().search("buffer") != -1 || type.toLowerCase().search("array") != -1) {  reader.readAsArrayBuffer(file)  };
      if (type.toLowerCase().search("text") != -1) {  reader.readAsText(file)  };
       return reader;
    }else{
       throw new Error("Callback Is Not Typeof Function");
     return "You Got An Error Check In Console";
    };
     
 };

 this.onPaste = function(callback){
  return new paste(callback);
 }




this.highlight = function (text,lang) {
  var lang = lang ||"html";
  var elmntTxt = Jua.encode(text);
  var tagcolor = "white";
  var tagnamecolor = "#ED2B73";
  var attributecolor = "#A7CF45";
  var attributevaluecolor = "#E2D671";
  var commentcolor = "grey";
  var cssselectorcolor = "#A7CF45";
  var csspropertycolor = "#70CDE6";
  var csspropertyvaluecolor = "#70CDE6";
  var cssdelimitercolor = "white";
  var cssimportantcolor = "#ED2B73";  
  var jscolor = "white";
  var jskeywordcolor = "#ED2B73";
  var jsstringcolor = "#E2D671";
  var jsnumbercolor = "#9581BB";
  var jspropertycolor = "#70CDE6";
  if (!lang) {lang = "html"; }
  if (lang == "html") {elmntTxt = htmlMode(elmntTxt);}
  if (lang == "css") {elmntTxt = cssMode(elmntTxt);}
  if (lang == "js") {elmntTxt = jsMode(elmntTxt);}
  return elmntTxt;

  function extract(str, start, end, func, repl) {
    var s, e, d = "", a = [];
    while (str.search(start) > -1) {
      s = str.search(start);
      e = str.indexOf(end, s);
      if (e == -1) {e = str.length;}
      if (repl) {
        a.push(func(str.substring(s, e + (end.length))));      
        str = str.substring(0, s) + repl + str.substr(e + (end.length));
      } else {
        d += str.substring(0, s);
        d += func(str.substring(s, e + (end.length)));
        str = str.substr(e + (end.length));
      }
    }
    this.rest = d + str;
    this.arr = a;
  }
  function htmlMode(txt) {
    var rest = txt, done = "", php, comment, angular, startpos, endpos, note, i;
    comment = new extract(rest, "&lt;!--", "--&gt;", commentMode, "<JUAHTMLCOMMENTPOS");
    rest = comment.rest;
    while (rest.indexOf("&lt;") > -1) {
      note = "";
      startpos = rest.indexOf("&lt;");
      if (rest.substr(startpos, 9).toUpperCase() == "&LT;STYLE") {note = "css";}
      if (rest.substr(startpos, 10).toUpperCase() == "&LT;SCRIPT") {note = "javascript";}        
      endpos = rest.indexOf("&gt;", startpos);
      if (endpos == -1) {endpos = rest.length;}
      done += rest.substring(0, startpos);
      done += tagMode(rest.substring(startpos, endpos + 4));
      rest = rest.substr(endpos + 4);
      if (note == "css") {
        endpos = rest.indexOf("&lt;/style&gt;");
        if (endpos > -1) {
          done += cssMode(rest.substring(0, endpos));
          rest = rest.substr(endpos);
        }
      }
      if (note == "javascript") {
        endpos = rest.indexOf("&lt;/script&gt;");
        if (endpos > -1) {
          done += jsMode(rest.substring(0, endpos));
          rest = rest.substr(endpos);
        }
      }
    }
    rest = done + rest;
    for (i = 0; i < comment.arr.length; i++) {
        rest = rest.replace("<JUAHTMLCOMMENTPOS", comment.arr[i]);
    }
    return rest;
  }
  function tagMode(txt) {
    var rest = txt, done = "", startpos, endpos, result;
    while (rest.search(/(\s|\n)/) > -1) {    
      startpos = rest.search(/(\s|\n)/);
      endpos = rest.indexOf("&gt;");
      if (endpos == -1) {endpos = rest.length;}
      done += rest.substring(0, startpos);
      done += attributeMode(rest.substring(startpos, endpos));
      rest = rest.substr(endpos);
    }
    result = done + rest;
    if(result.search("&lt;/") == 0){
         result = "<span style=color:" + tagcolor + ">&lt;/</span>" + result.substring(5);
    }else{
       result = "<span style=color:" + tagcolor + ">&lt;</span>" + result.substring(4);
    }

   
    if (result.substr(result.length - 4, 4) == "&gt;") {
      result = result.substring(0, result.length - 4) + "<span style=color:" + tagcolor + ">&gt;</span>";
    }
    return "<span style=color:" + tagnamecolor + ">" + result + "</span>";
  }
  function attributeMode(txt) {
    var rest = txt, done = "", startpos, endpos, singlefnuttpos, doublefnuttpos, spacepos;
    while (rest.indexOf("=") > -1) {
      endpos = -1;
      startpos = rest.indexOf("=");
      singlefnuttpos = rest.indexOf("'", startpos);
      doublefnuttpos = rest.indexOf('"', startpos);
      spacepos = rest.indexOf(" ", startpos + 2);
      if (spacepos > -1 && (spacepos < singlefnuttpos || singlefnuttpos == -1) && (spacepos < doublefnuttpos || doublefnuttpos == -1)) {
        endpos = rest.indexOf(" ", startpos);      
      } else if (doublefnuttpos > -1 && (doublefnuttpos < singlefnuttpos || singlefnuttpos == -1) && (doublefnuttpos < spacepos || spacepos == -1)) {
        endpos = rest.indexOf('"', rest.indexOf('"', startpos) + 1);
      } else if (singlefnuttpos > -1 && (singlefnuttpos < doublefnuttpos || doublefnuttpos == -1) && (singlefnuttpos < spacepos || spacepos == -1)) {
        endpos = rest.indexOf("'", rest.indexOf("'", startpos) + 1);
      }
      if (!endpos || endpos == -1 || endpos < startpos) {endpos = rest.length;}
      done += rest.substring(0, startpos);
      done += attributeValueMode(rest.substring(0,startpos),rest.substring(startpos, endpos + 1));
      rest = rest.substr(endpos + 1);
    }
    return "<span style=color:" + attributecolor + ">" + done + rest + "</span>";
  }
  function attributeValueMode(name,txt) {
   if (name.search("style") != -1) {
      var css = cssMode("{"+txt+"}");
      return css.substring(css.indexOf("{")+1,css.lastIndexOf("}"));
   }else{
      if (name.search("on") != -1) {
      var quot;
      quot = txt.substring(1,2);
      var js = jsMode(txt.substring(2,txt.length-1));
      if (quot == '"' || quot == "'" || quot == "`") {return "<span style=color:" + attributevaluecolor + ">=</span>"+"<span style=color:" + attributevaluecolor + ">" + quot + "</span>"+js+"<span style=color:" + attributevaluecolor + ">" + quot + "</span>";}else{return js}

      
   }else{      
      return "<span style=color:" + attributevaluecolor + ">" + txt + "</span>";
   }
   }
    
  }
  function commentMode(txt) {
    return "<span style=color:" + commentcolor + ">" + txt + "</span>";
  }
  function cssMode(txt) {
    var rest = txt, done = "", s, e, comment, i, midz, c, cc;
    comment = new extract(rest, /\/\*/, "*/", commentMode, "<JUACSSCOMMENTPOS");
    rest = comment.rest;
    while (rest.search("{") > -1) {
      s = rest.search("{");
      midz = rest.substr(s + 1);
      cc = 1;
      c = 0;
      for (i = 0; i < midz.length; i++) {
        if (midz.substr(i, 1) == "{") {cc++; c++}
        if (midz.substr(i, 1) == "}") {cc--;}
        if (cc == 0) {break;}
      }
      if (cc != 0) {c = 0;}
      e = s;
      for (i = 0; i <= c; i++) {
        e = rest.indexOf("}", e + 1);
      }
      if (e == -1) {e = rest.length;}
      done += rest.substring(0, s + 1);
      done += cssPropertyMode(rest.substring(s + 1, e));
      rest = rest.substr(e);
    }
    rest = done + rest;
    rest = rest.replace(/{/g, "<span style=color:" + cssdelimitercolor + ">{</span>");
    rest = rest.replace(/}/g, "<span style=color:" + cssdelimitercolor + ">}</span>");
    for (i = 0; i < comment.arr.length; i++) {
        rest = rest.replace("<JUACSSCOMMENTPOS", comment.arr[i]);
    }
    return "<span style=color:" + cssselectorcolor + ">" + rest + "</span>";
  }
  function cssPropertyMode(txt) {
    var rest = txt, done = "", s, e, n, loop;
    if (rest.indexOf("{") > -1 ) { return cssMode(rest); }
    while (rest.search(":") > -1) {
      s = rest.search(":");
      loop = true;
      n = s;
      while (loop == true) {
        loop = false;
        e = rest.indexOf(";", n);
        if (rest.substring(e - 5, e + 1) == "&nbsp;") {
          loop = true;
          n = e + 1;
        }
      }
      if (e == -1) {e = rest.length;}
      done += rest.substring(0, s);
      done += cssPropertyValueMode(rest.substring(s, e + 1));
      rest = rest.substr(e + 1);
    }
    return "<span style=color:" + csspropertycolor + ">" + done + rest + "</span>";
  }
  function cssPropertyValueMode(txt) {
    var rest = txt, done = "", s,result;

    rest = "<span style=color:" + cssdelimitercolor + ">:</span>" + rest.substring(1);

    while (rest.search(/!important/i) > -1) {
      s = rest.search(/!important/i);
      done += rest.substring(0, s);
      done += cssImportantMode(rest.substring(s, s + 10));
      rest = rest.substr(s + 10);
    }
    result = done + rest;    

    if (result.substr(result.length - 1, 1) == ";" && result.substr(result.length - 6, 6) != "&nbsp;" && result.substr(result.length - 4, 4) != "&lt;" && result.substr(result.length - 4, 4) != "&gt;" && result.substr(result.length - 5, 5) != "&amp;") {
      result = result.substring(0, result.length - 1) + "<span style=color:" + cssdelimitercolor + ">;</span>";
    }

    return "<span style=color:" + csspropertyvaluecolor + ">" + result + "</span>";
  }
  function cssImportantMode(txt) {
    return "<span style=color:" + cssimportantcolor + ";font-weight:bold;>" + txt + "</span>";
  }
  function jsMode(txt) {
    var rest = txt, done = "", esc = [], i, cc, tt = "", sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, numpos, mypos, dotpos, y;
    for (i = 0; i < rest.length; i++)  {
      cc = rest.substr(i, 1);
      if (cc == "\\") {
        esc.push(rest.substr(i, 2));
        cc = "<JUAJSESCAPE";
        i++;
      }
      tt += cc;
    }
    rest = tt;
    y = 1;
    while (y == 1) {
      sfnuttpos = getPos(rest, "'", "'", jsStringMode);
      dfnuttpos = getPos(rest, '"', '"', jsStringMode);
      compos = getPos(rest, /\/\*/, "*/", commentMode);
      comlinepos = getPos(rest, /\/\//, "\n", commentMode);      
      numpos = getNumPos(rest, jsNumberMode);
      keywordpos = getKeywordPos("js", rest, jsKeywordMode);
      dotpos = getDotPos(rest, jsPropertyMode);
      if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], keywordpos[0], dotpos[0]) == -1) {break;}
      mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, dotpos);
      if (mypos[0] == -1) {break;}
      if (mypos[0] > -1) {
        done += rest.substring(0, mypos[0]);
        done += mypos[2](rest.substring(mypos[0], mypos[1]));
        rest = rest.substr(mypos[1]);
      }
    }
    rest = done + rest;
    for (i = 0; i < esc.length; i++) {
      rest = rest.replace("<JUAJSESCAPE", "<span style=color:#9532ff; >"+esc[i]+"</span>");
    }
    return "<span style=color:" + jscolor + ">" + rest + "</span>";
  }
  function jsStringMode(txt) {
    return "<span style=color:" + jsstringcolor + ">" + txt + "</span>";
}
  function jsKeywordMode(txt) {
  if (txt == "var") {  return "<span style=color:" + jspropertycolor + ">" + txt + "</span>";}
  if (txt == "function") {  return "<span style=font-style:italic;color:" + jspropertycolor + ">" + txt + "</span>";}
  if (txt == "arguments") {  return "<span style=font-style:italic;color:orange;>" + txt + "</span>";}
  if (txt == "var") {  return "<span style=color:" + jspropertycolor + ">" + txt + "</span>";}
  if (txt == "let") {  return "<span style=font-style:italic;color:" + jspropertycolor + ">" + txt + "</span>";}
  if (txt == "const") {  return "<span style=font-style:italic;color:" + jspropertycolor + ">" + txt + "</span>";}
  if (txt == "false") {  return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";}
  if (txt == "true") {  return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";}
  if (txt == "undefined") {  return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";}
  if (txt == "NaN") {  return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";}
  if (txt == "null") {  return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";}


     return "<span style=color:" + jskeywordcolor + ">" + txt + "</span>";
  }
  function jsNumberMode(txt) {
    return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";
  }
  function jsPropertyMode(txt) {
    return "<span style=color:" + jspropertycolor + ">" + txt + "</span>";
  }
  function getDotPos(txt, func) {
    var x, i, j, s, e, cc,arr = [".","<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%"];
    s = txt.indexOf(".");
    if (s > -1) {
      x = txt.substr(s + 1);
      for (j = 0; j < x.length; j++) {
        cc = x[j];
        for (i = 0; i < arr.length; i++) {          
          if (cc.indexOf(arr[i]) > -1) {
            e = j;
            return [s + 1, e + s + 1, func];
          }
        }
      }
    }
    return [-1, -1, func];
  }
  function getMinPos() {
    var i, arr = [];
    for (i = 0; i < arguments.length; i++) {
      if (arguments[i][0] > -1) {
        if (arr.length == 0 || arguments[i][0] < arr[0]) {arr = arguments[i];}
      }
    }
    if (arr.length == 0) {arr = arguments[i];}
    return arr;
  }
  function getKeywordPos(typ, txt, func) {
    var words, i, pos, rpos = -1, rpos2 = -1, patt;
    if (typ == "js") {
      words = ["abstract","arguments","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete",
      "do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import",
      "in","instanceof","int","interface","let","long","NaN","native","new","null","package","private","protected","public","return","short","static",
      "super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield","=","+","?","/","<",
      ">","!","@","$","%","^","&","*","-","|","\\"];
    }
    for (i = 0; i < words.length; i++) {
      pos = txt.indexOf(words[i]);
      if (pos > -1) {
        patt = /\W/g;
        if (txt.substr(pos + words[i].length,1).match(patt) && txt.substr(pos - 1,1).match(patt)) {
          if (pos > -1 && (rpos == -1 || pos < rpos)) {
            rpos = pos;
            rpos2 = rpos + words[i].length;
          }
        }
      } 
    }
    return [rpos, rpos2, func];
  }
  function getPos(txt, start, end, func) {
    var s, e;
    s = txt.search(start);
    e = txt.indexOf(end, s + (end.length));
    if (e == -1) {e = txt.length;}
    return [s, e + (end.length), func];
  }
  function getNumPos(txt, func) {
    var arr = ["\n", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%", "="], i, j, c, startpos = 0, endpos, word;
    for (i = 0; i < txt.length; i++) {
      for (j = 0; j < arr.length; j++) {
        c = txt.substr(i, arr[j].length);
        if (c == arr[j]) {
          if (c == "-" && (txt.substr(i - 1, 1) == "e" || txt.substr(i - 1, 1) == "E")) {
            continue;
          }
          endpos = i;
          if (startpos < endpos) {
            word = txt.substring(startpos, endpos);
            if (!isNaN(word)) {return [startpos, endpos, func];}
          }
          i += arr[j].length;
          startpos = i;
          i -= 1;
          break;
        }
      }
    }  
    return [-1, -1, func];
  }  
}



this.typeof = function(test){
var Jua = typeof test;
var isNode = false;

if (typeof test == "string") {Jua = "string";}
if (typeof test == "number") {
  Jua = "number";
  if (Number.isInteger(test)) {
    Jua = "integer";
  }
  if (String(test).indexOf(".") != 0 && String(test).indexOf(".") != -1) {
    Jua = "float";
  }
  if (String(test).indexOf("-") == 0 && String(test).indexOf("-") != -1) {
    Jua = "negative "+Jua;
  }
}

if (typeof test == "object") {
  Jua = "object";
  if (test instanceof Array) {
  Jua = "array";
  }
  if (test.Jua) {
  Jua = "jua";
  }

  for (let x in Node) {
    if (test[x]) {
  isNode = true;
    }else{
  isNode = false;
    }

  }
if (test.constructor) {
  if (test instanceof Document) {
  isNode = false;
  Jua = "document";
}
}
}
if (isNode) {
  Jua = "node";
}
return Jua;
}

this.document = function(){
 return Jua(ownerDoc);
};

this.body = function(){
return Jua(ownerDoc.body);
};

 this.new = function(tagName,ns){
  function split(st,sy){
    return st.split(sy).join(" ");
  };

  tagName = tagName.replaceAll(" ","");
  var attrs = new Array();
  if (tagName.indexOf("#") != -1) {
   var dots = [".","["," "]
  for (var i = 0; i < dots.length; i++) {
    var pos = tagName.indexOf(dots[i],tagName.indexOf("#"));
    if (i == dots.length-1) {pos = tagName.length}
   if (pos != -1) {
attrs["id"] = split(tagName.substring(tagName.indexOf("#")+1,pos),"#");
tagName = tagName.substring(0,tagName.indexOf("#"))+tagName.substring(pos,tagName.length);
break;
   }
  }
  }

  if (tagName.indexOf(".") != -1) {
   var dots = ["#","["," "]
  for (var i = 0; i < dots.length; i++) {
    var pos = tagName.indexOf(dots[i],tagName.indexOf("."));
    if (i == dots.length-1) {pos = tagName.length}
   if (pos != -1) {
attrs["class"] = split(tagName.substring(tagName.indexOf(".")+1,pos),".");
tagName = tagName.substring(0,tagName.indexOf("."))+tagName.substring(pos,tagName.length);
break;
   }

  }
  }

  if (tagName.indexOf("[") != -1) {
var s = tagName.indexOf("[");
var e = tagName.indexOf("]",s);
var text = tagName.substring(s+1,e);
tagName = tagName.substring(0,s)+tagName.substring(e+1,tagName.length);
var attr = text.split(",");
for (var i = 0; i < attr.length; i++) {
  attrs[attr[i].split("=")[0]] = attr[i].split("=")[1];
}

  }

  var parent = ownerDoc.createElement("div");
  if (ns) {
   parent.appendChild(ownerDoc.createElementNS(ns,tagName));
  }else{
   parent.appendChild(ownerDoc.createElement(tagName));
  }
  if (attrs) {Jua(parent.children[0]).attr(attrs)};
  return Jua(parent.children[0]);}


this.slideShow = function(selector,type){  
var types = {
  normal:"normal",
  "3d":"3d",
}
if (typeof type == "string" && type.toLowerCase() in types) {type = type;}else{
  type ="normal";
}



var script = `<style>.Jua-slideshow-container {  max-width: 1000px; width: max-content; height: max-content; position: relative;  margin: auto;  border-radius: 25px;   overflow: hidden;}.Jua-slideshow-container .Jua-slideshow-image { vertical-align: middle; cursor: zoom-in;}.Jua-slideshow-container .Jua-slideshow-prev-button, .Jua-slideshow-next-button{  cursor: pointer;  position: absolute;  top: 50%;  width: auto;  padding: 16px;  margin-top: -22px;  color: white;  font-weight: bold;  font-size: 18px;  transition: 0.6s ease;  border-radius: 0 3px 3px 0;  user-select: none;}.Jua-slideshow-container .Jua-slideshow-next-button {  right: 0;  border-radius: 3px 0 0 3px;}.Jua-slideshow-container .Jua-slideshow-prev-button {  left: 0;  border-radius: 3px 0 0 3px;}.Jua-slideshow-container .Jua-slideshow-prev-button:hover, .Jua-slideshow-next-button:hover {  background-color:  black;  color: white;}.Jua-preview-image-fade-container{position: fixed;top: 0px;right: 0px;left: 0px;bottom: 0px;background: #00000096;z-index: 99999999999999999999;}.Jua-preview-image-fade-container .Jua-preview-image-fade{  position: absolute; top:0;  left:0; bottom:0; right:0;  margin: auto;}</style>`;
var elem = Jua(selector).child("img");
var length = elem.length;
var app = Jua.new("div");
elem.each(function(g,t){
    g.addClass("Jua-slideshow-image");
    app.append(g);
});
app.addClass("Jua-slideshow-container");
app.node.innerHTML += script; 
app.node.innerHTML += `<a class="Jua-slideshow-next-button">&#10095;</a><a class="Jua-slideshow-prev-button" >&#10094;</a>`;
Jua(selector)[0].empty();
Jua(selector)[0].append(app);
slide(app,type)


}


this.asNumber = function(string){
  if (typeof string != "string") {
  return string;
  }else{
    var str = "";
  for (var i = 0; i < string.toString().length; i++) {
    if (Number(string.toString()[i]) || Number(string.toString()[i]) == 0 || string.toString()[i] == "." || string.toString()[i] == "e" && string.toString()[i+1] == "+" || string.toString()[i] == "+" && string.toString()[i-1] == "e" && str[str.length-1] != "+") {
      str += string.toString()[i]
    };
  }
  return Number(str);
  }
}


this.select = function(selectorOrNode,multipop){
      var ob = {ownerDoc:ownerDoc,}
if (Jua.typeof(multipop) == "jua" || Jua.typeof(multipop) == "node" || Jua.typeof(multipop) == "document") {
  ob.ownerDoc = multipop;
};

if (typeof selectorOrNode == "string") {
  if (selectorOrNode.search(",") != -1) {
    var selectorOrcomaNode = selectorOrNode.split(",");
    selectorOrNode = new Array();
for (var i = 0; i < selectorOrcomaNode.length; i++) {
  var s = selectorOrcomaNode[i].replaceAll(" ","").search("<");
  var e = selectorOrcomaNode[i].replaceAll(" ","").indexOf(">",s);
  if(s != -1 && e != -1){selectorOrNode[i] = Jua.new(selectorOrcomaNode[i].replaceAll(" ","").substring(s+1,e),multipop);};
}
  }else{
    var s = selectorOrNode.replaceAll(" ","").search("<");
  var e = selectorOrNode.replaceAll(" ","").indexOf(">",s);
  if(s != -1 && e != -1){selectorOrNode = Jua.new(selectorOrNode.replaceAll(" ","").substring(s+1,e),multipop);};
  }

}
  var objectt = new JUA();

  function JUA(){
  // process selectorOrNode to this //

if (Jua.isJua(selectorOrNode)) {
var selectorOrNodeThis = this;

selectorOrNode.each(function(e,t){ 
   selectorOrNodeThis[t] = e;
})

}else{

if (selectorOrNode) {
  if (typeof selectorOrNode == "object"){
    if (selectorOrNode.ownerDocument) {ob.ownerDoc = selectorOrNode.ownerDocument;}
if (selectorOrNode.length == undefined) {
     this[0] = Object.create({});
     this[0].node = selectorOrNode;
     this[0].index = g;


   }else{
if (selectorOrNode.length == 0) {
}else{
      var g = 0;
   for (var i = 0; i < selectorOrNode.length; i++) {
    if (Jua.isJua(selectorOrNode[g])) {
      selectorOrNode[g] = selectorOrNode[g].node;
    }
   if (selectorOrNode[g]) {
     this[g] = Object.create({});
     this[g].node = selectorOrNode[g];
     this[g].index = g;

     g++
   }
   }

   

}

   }
}

 if (typeof selectorOrNode == "string") {

  for (var i = 0; i < ob.ownerDoc.querySelectorAll(selectorOrNode).length; i++) {
       this[i] =  Object.create({});
       this[i].node =  ob.ownerDoc.querySelectorAll(selectorOrNode)[i];
       this[i].index = i;
  }
  }
}
}}


if (selectorOrNode) {
for(let x in objectt){
objectt[x] = new JuaNode(objectt[x]);
};

function JuaNode(JuA){
var JuAJUA =  JuA[0] || JuA;
var object = JuAJUA.node;
var onWork = true;
var index = JuAJUA.index;
JuA.node = object;
var elementArray = new Array();
if (JuA[0]) {
  onWork = false;
for(let x in JuA){
 if (!isNaN(x)) {JuA.length = Number(x)+1;}
}
}
if(JuA.node){
if (!JuA.node.hiddenValue) {JuA.node.hiddenValue = new Array();};
if(!JuA.node.hiddenValue.detail){JuA.node.hiddenValue.detail = {};}
JuA.Jua = true;
}
JuA.selector = selectorOrNode;
JuA.__proto__.detail = function(name,value){if(!JuA.node.hiddenValue.detail){JuA.node.hiddenValue.detail = {};} if (value) {JuA.node.hiddenValue.detail[name] = value;}else{if (name) {return JuA.node.hiddenValue.detail[name]}else{return JuA.node.hiddenValue.detail;} }; return JuA;};
JuA.__proto__.ready = function(callback){if(!JuA.node.doctype){callback()}else{if (JuA.node.readyState === "complete" || JuA.node.readyState === "interactive") { JuA.node.onload = callback;} else { JuA.node.addEventListener("DOMContentLoaded", callback);}}};
JuA.__proto__.add = function(node,index){onWork = false;var num = index; if (num) {JuA[JuA.length] = Jua(node)[num];JuA.length++;}else{Jua(node).each(function(e){e.index = JuA.length;JuA[JuA.length] = e;JuA.length++;})} return JuA;}
JuA.__proto__.child = function(selector){ if(!onWork){Ifall("child",...arguments)}; if (selector) {return Jua.select(JuA.node.children).filter(selector);}else{return Jua.select(JuA.node.children);}};
JuA.__proto__.parent = function(node){if(!onWork){Ifall("parent",...arguments)};if (JuAJUA.node.parentNode && node) {return nodeChanged(Jua.createParent(JuAJUA.node,node));}else{return Jua(JuAJUA.node.parentNode)}};
JuA.__proto__.prevNode = function(node){if(!onWork){Ifall("prevNode",...arguments)}; if (typeof node == "object") { nodeChanged(Jua.replaceElement(JuAJUA.node.previousElementSibling,node))}; return Jua(this.node.previousElementSibling);};
JuA.__proto__.nextNode = function(node){if(!onWork){Ifall("nextNode",...arguments)}; if (typeof node == "object") { nodeChanged(Jua.replaceElement(JuAJUA.node.nextElementSibling,node))}; return Jua(this.node.nextElementSibling);};
JuA.__proto__.on = function(type , callback,opt = false){ if(!onWork){Ifall("on",...arguments)}; JuAJUA.node.addEventListener(type,callback,opt); return JuA};
JuA.__proto__.attr = function(attrName,attrValue) { if(!onWork){  Ifall("attr",...arguments)}; if(attrName != undefined && attrValue != undefined){   JuAJUA.node.setAttribute(attrName,attrValue); }else if(attrName != undefined){  if (typeof attrName == "object") {          for (let x in attrName) {           if (!Number(x)) {JuAJUA.node.setAttribute(x,attrName[x]); }         }   }else{    return JuAJUA.node.getAttribute(attrName);  } } return JuAJUA.node.attributes};
JuA.__proto__.removeAttr = function(attrName) {if(!onWork){Ifall("removeAttr",...arguments)}; if (Jua.typeof(attrName) == "object") {     for (let x in attrName) {     JuAJUA.node.removeAttribute(x)     } }else{ if (Jua.typeof(attrName) == "array") {     for (var i = 0; i < attrName.length; i++) {     JuAJUA.node.removeAttribute(attrName[i])     } }else{ return JuAJUA.node.removeAttribute(attrName) }} return JuAJUA.node};
JuA.__proto__.getSelector = function(){if(!onWork){Ifall("getSelector",...arguments)}; return generateQuerySelector(object);}
JuA.__proto__.dragg = function(){if(!onWork){Ifall("dragg",...arguments)}; return Jua.draggable(object);}
JuA.__proto__.resize = function(pos,type){if(!onWork){Ifall("resize",...arguments)}; return Jua.resizable(object,pos,type);}
JuA.__proto__.toggleClass = function(className , classValue){  if(!onWork){Ifall("toggleClass",...arguments)};if (JuAJUA.node.hiddenValue["data-toggle-style-"+className]) {  JuAJUA.class(className , JuAJUA.node.hiddenValue["data-toggle-style-"+className]);JuAJUA.node.hiddenValue["data-toggle-style-"+className] = null;  }else{JuAJUA.node.hiddenValue["data-toggle-style-"+className] = JuAJUA.class(className);  JuAJUA.class(className , classValue); }}
JuA.__proto__.anim = function( css , ms , ease){ if(!onWork){Ifall("anim",...arguments)}; var transition = ms || 2000;  var ltrans = "";var lFs = "";var allcss = new Array();var Pendingcss = new Array();var status = "Playing";var element = JuAJUA.node;var retunAll = {status:status,pause:function(){pauseNow()},play:function(){playNow()},onFinish:null,reAnim:function(){Animre()},};var reCaller = {status:status,reAnim:function(){Animre()},};function Animre(){ element.style.transition = "";  for (let name in allcss) {    if ("transform".search(name) != -1) {    if (allcss[name] == "matrix(1, 0, 0, 1, 0, 0)" || allcss[name] == "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)") {       element.style[name] = "";    }    }else{      element.style[name] = allcss[name];    }}setTimeout(function() {  var reCalling =  JuAJUA.anim(css,ms,ease); reCalling.onFinish = retunAll.onFinish;retunAll = reCalling;status = "Playing";}, 10);}ltrans = JuA.class("transition-duration");lFs = JuA.class("transition-timing-function");element.style.transitionDuration = transition+"ms";  if (ease) {element.style.transitionTimingFunction = ease;}var timing = setTimeout(AnimtionFinish, transition);setTimeout(function() {  for (let name in css) { element.style[name] = css[name]; allcss[name] = JuAJUA.class(name); }}, 1);function AnimtionFinish(){element.style.transitionDuration = ltrans;element.style.transitionTimingFunction = lFs;   status = "Finished";if (typeof retunAll.onFinish == "function") {retunAll.onFinish(reCaller)}}function playNow(){  if (status == "Playing") {  console.log("Animation Is Now Running ! No Need To Start ! ");}if (status == "Paused") {  element.style.transition = transition+"ms";  if (ease) {element.style.transitionTimingFunction = ease;}  status = "Playing";  for (let name in css) { element.style[name] = css[name];}timing = setTimeout(AnimtionFinish, transition);}if (status == "Finished") {  console.log("Animation Is Finished ! use reAnim function ! ");}}function pauseNow(){ if (status == "Playing") { for (let name in css) { Pendingcss[name] = JuAJUA.class(name); JuAJUA.class(name,JuAJUA.class(name))}element.style.transition = "";clearTimeout(timing)}if (status == "Paused") {  console.log("Animation Is Paused ! No Need To Pause ! ");}if (status == "Finished") {  console.log("Animation Is Finished ! use reAnim function ! ")}status = "Paused";}   return retunAll;}
JuA.__proto__.toggleAttr = function(attrName , attrValue){if(!onWork){Ifall("toggleAttr",...arguments)}; if (JuAJUA.node.hiddenValue["data-toggle-"+attrName] == undefined || JuAJUA.node.hiddenValue["data-toggle-"+attrName] == "undefined") { JuAJUA.node.hiddenValue["data-toggle-"+attrName] = JuAJUA.attr(attrName);JuAJUA.attr(attrName , attrValue); }else{JuAJUA.attr(attrName , JuAJUA.node.hiddenValue["data-toggle-"+attrName]);JuAJUA.node.hiddenValue["data-toggle-"+attrName] = "undefined";} }
JuA.__proto__.class = function(styleName, styleValue) {if (!onWork) {        Ifall("class", ...arguments)    };    var styles = window.getComputedStyle(object);    styles.extract = function() {        var ReturningArray = new Array();        var defaultStyle = "";        var element = ob.ownerDoc.createElement("Jua");        ob.ownerDoc.body.appendChild(element);        defaultStyle = window.getComputedStyle(element);        var style = window.getComputedStyle(object);        var currentNum = 0;        for (var i = 0; i < style.length; i++) {            if (style[i] in defaultStyle) {                if (defaultStyle[style[i]] != style[style[i]]) {                    ReturningArray[currentNum++] = style[i];                    ReturningArray[style[i]] = style[style[i]];                }            } else {                ReturningArray[currentNum++] = style[i];                ReturningArray[style[i]] = style[style[i]];            }        };        ReturningArray.Jua = true;        ReturningArray.background = style.background;        ReturningArray.color = style.color;        ReturningArray.height = style.height;        ReturningArray.width = style.width;        ob.ownerDoc.body.removeChild(element);        return ReturningArray;    };    if (styleValue) {        JuAJUA.node.style[styleName] = styleValue;    } else {        if (styleName) {            if (typeof styleName == "object") {                for (let name in styleName) {                  if(isNaN(name)){                    JuAJUA.node.style[name] = styleName[name];                  }                }            } else {                return styles[styleName];            }        } else {            return styles;        }    }    return this;};
JuA.__proto__.replaceWith = function(node) {if(!onWork){Ifall("replaceWith",...arguments)}; if (Jua.isJua(node)) {var element = node.node;}; Jua.replaceElement(object,element); nodeChanged(element); return JuA;}
JuA.__proto__.select = function(selector){ if(!onWork){Ifall("select",...arguments)};if (typeof selector == "object") {return Jua.select(ob.ownerDoc.querySelectorAll(Jua(selector).getSelector()));} return Jua.select(JuA.node.querySelectorAll(selector));};
JuA.__proto__.pick = function(num) {if (typeof num == "string") {if(num.toLowerCase() == "all"){return objectt}else{return JuA.select(num);}} return objectt[num];};
JuA.__proto__.tagName = function(tagName){if (tagName) {if(!onWork){Ifall("tagName",...arguments)}; var wns = object;var lmn = ob.ownerDoc.createElement(tagName);var index;while (wns.firstChild) {    lmn.appendChild(wns.firstChild);}for (index = wns.attributes.length - 1; index >= 0; --index) {    lmn.attributes.setNamedItem(wns.attributes[index].cloneNode());}JuAJUA.replaceWith(lmn); return Jua.select(lmn);}else{return JuAJUA.node.tagName} };
JuA.__proto__.fadeOut = function(ms){ if(!onWork){Ifall("fadeOut",...arguments)};   return JuAJUA.anim({opacity:"0"},ms);return JuAJUA;}
JuA.__proto__.fadeIn = function(ms){if(!onWork){Ifall("fadeIn",...arguments)}; return JuAJUA.anim({opacity:"1"},ms);return JuAJUA;}
JuA.__proto__.blurOut = function(ms){ if(!onWork){Ifall("blurOut",...arguments)}; return JuAJUA.anim({filter:"blur(0px)"},ms);return JuAJUA;}
JuA.__proto__.blurIn = function(ms,blurRate){if(!onWork){Ifall("blurIn",...arguments)}; blurRate = Number(blurRate) || 50; return JuAJUA.anim({filter:"blur("+blurRate+"px"},ms);;return JuAJUA;}
JuA.__proto__.slideUp = function(ms,ease,callback){ if(!onWork){Ifall("slideUp",...arguments)}; if (JuAJUA.node.hiddenValue["data-height-slideDown"] == undefined || JuAJUA.node.hiddenValue["data-height-slideDown"] == "undefined") {JuAJUA.node.hiddenValue["data-height-slideDown"] = JuAJUA.class("height");};JuAJUA.class({"overflow":"hidden","transition-duration":"0s","transition-timing-function":"ease"}); var ret = JuAJUA.anim({height:"0px"},ms,ease);ret.onFinish = function(e){JuAJUA.class("display","none");if (typeof callback == "function") {callback(e)}};return ret;}
JuA.__proto__.slideDown = function(ms,ease,callback){ if(!onWork){Ifall("slideDown",...arguments)}; if (JuAJUA.node.hiddenValue["data-height-slideDown"] != undefined || JuAJUA.node.hiddenValue["data-height-slideDown"] != "undefined") {var ret = JuAJUA.anim({overflow:"hidden",display:"block",height:JuAJUA.node.hiddenValue["data-height-slideDown"]},ms,ease);ret.onFinish = function(e){if (typeof callback == "function") {callback(e)}};JuAJUA.node.hiddenValue["data-height-slideDown"]  = "undefined";return ret}else{return JuAJUA;}}
JuA.__proto__.hide = function(){if(!onWork){Ifall("hide",...arguments)};     JuAJUA.class("display","none");return JuAJUA;}
JuA.__proto__.show = function(display){if(!onWork){Ifall("show",...arguments)};     JuAJUA.class("display",display||"block");return JuAJUA;}
JuA.__proto__.change = function(callback,opt){if(!onWork){Ifall("change",...arguments)};     if(callback){JuAJUA.on("change",callback,opt)}else{var clickEvent  = ob.ownerDoc.createEvent ('Event');clickEvent.initEvent ('change', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.click = function(callback,opt){if(!onWork){Ifall("click",...arguments)};     if(callback){JuAJUA.on("click",callback,opt)}else{JuAJUA.node.click()}; return JuA;};
JuA.__proto__.focus = function(callback,opt){if(!onWork){Ifall("focus",...arguments)};     if(callback){JuAJUA.on("focus",callback,opt)}else{JuAJUA.node.focus()}; return JuA;};
JuA.__proto__.dblclick = function(callback,opt){if(!onWork){Ifall("dblclick",...arguments)};      if(callback){JuAJUA.on("dblclick",callback,opt)}else{var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('dblclick', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mouseover = function(callback,opt){if(!onWork){Ifall("mouseover",...arguments)};     if(callback){JuAJUA.on("mouseover",callback,opt)}else{var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mouseover', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mouseleave = function(callback,opt){  if(!onWork){Ifall("mouseleave",...arguments)};        if(callback){JuAJUA.on("mouseleave",callback,opt)}else{   var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mouseleave', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mousedown = function(callback,opt){ if(!onWork){Ifall("mousedown",...arguments)};       if(callback){JuAJUA.on("mousedown",callback,opt)}else{    var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mousedown', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mousemove = function(callback,opt){ if(!onWork){Ifall("mousemove",...arguments)};       if(callback){JuAJUA.on("mousemove",callback,opt)}else{    var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mousemove', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mouseout = function(callback,opt){ if(!onWork){Ifall("mouseout",...arguments)};       if(callback){JuAJUA.on("mouseout",callback,opt)}else{    var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mouseout', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mouseenter = function(callback,opt){ if(!onWork){Ifall("mouseenter",...arguments)};       if(callback){JuAJUA.on("mouseenter",callback,opt)}else{    var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mouseenter', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mouseup = function(callback,opt){ if(!onWork){Ifall("mouseup",...arguments)};       if(callback){JuAJUA.on("mouseup",callback,opt)}else{    var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mouseup', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.mousewheel = function(callback,opt){ if(!onWork){Ifall("mousewheel",...arguments)};       if(callback){JuAJUA.on("mousewheel",callback,opt)}else{    var clickEvent  = ob.ownerDoc.createEvent ('MouseEvents');clickEvent.initEvent ('mousewheel', true, true);JuA.node.dispatchEvent (clickEvent);}; return JuA; };
JuA.__proto__.keydown = function(callback,opt){   if(!onWork){Ifall("keydown",...arguments)};         if(callback){JuAJUA.on("keydown",callback,opt)}else{            var clickEvent  = ob.ownerDoc.createEvent ('KeyboardEvents');        clickEvent.initEvent ('keydown', true, true);    JuA.node.dispatchEvent (clickEvent);}; return JuA;   };
JuA.__proto__.keyup = function(callback,opt){   if(!onWork){Ifall("keyup",...arguments)};         if(callback){JuAJUA.on("keyup",callback,opt)}else{            var clickEvent  = ob.ownerDoc.createEvent ('KeyboardEvents');        clickEvent.initEvent ('keyup', true, true);    JuA.node.dispatchEvent (clickEvent);}; return JuA;   };
JuA.__proto__.keypress = function(callback,opt){   if(!onWork){Ifall("keypress",...arguments)};         if(callback){JuAJUA.on("keypress",callback,opt)}else{            var clickEvent  = ob.ownerDoc.createEvent ('KeyboardEvents');        clickEvent.initEvent ('keypress', true, true);    JuA.node.dispatchEvent (clickEvent);}; return JuA;   };
JuA.__proto__.blur = function(callback,opt){   if(!onWork){Ifall("blur",...arguments)};         if(callback){JuAJUA.on("blur",callback,opt)}else{            var clickEvent  = ob.ownerDoc.createEvent ('KeyboardEvents');        clickEvent.initEvent ('blur', true, true);    JuA.node.dispatchEvent (clickEvent);}; return JuA;   };
JuA.__proto__.remove = function(child){if(!onWork){Ifall("remove",...arguments)}; if (child) {Jua(child).remove();}else{JuAJUA.node.remove();}};
JuA.__proto__.append = function(nodeORText){if(!onWork){Ifall("append",...arguments)};if (typeof nodeORText == "string") {var node = Jua.stringToNode(nodeORText);}else{var node = nodeORText}; Jua(node).each(function(e){JuA.node.appendChild(e.node)}); return JuA;};
JuA.__proto__.html = function(html,add){var after = "";var before = ""; if (add) {if(add.toLowerCase() == "+"){add = "after";} if (add.toLowerCase() == "before") {after = JuAJUA.node.innerHTML;}; if(add.toLowerCase() == "after"){before = JuAJUA.node.innerHTML;}} if (typeof html == "function") {JuA.node.innerHTML = html(index,JuA.node.innerHTML);}else{if (html) {JuA.node.innerHTML = before+html+after;}else{return JuA.node.innerHTML;}};  if(!onWork){Ifall("html",...arguments)};};
JuA.__proto__.text = function(text,add){var after = "";var before = ""; if(add){if(add.toLowerCase() == "+"){add = "after";} if (add.toLowerCase() == "before") {after = JuAJUA.node.textContent;}; if(add.toLowerCase() == "after"){before = JuAJUA.node.textContent;}} if (typeof text == "function") {JuA.node.textContent = text(index,JuA.node.textContent);}else{if (text) {JuA.node.textContent = before+text+after;}else{return JuA.node.textContent;}};  if(!onWork){Ifall("text",...arguments)};};
JuA.__proto__.val = function(value,add){var after = "";var before = ""; if(add){if(add.toLowerCase() == "+"){add = "after";} if (add.toLowerCase() == "before") {after = JuAJUA.node.value;}; if(add.toLowerCase() == "after"){before = JuAJUA.node.value;}} if (typeof value == "function") {JuA.node.valueContent = value(index,JuA.node.valueContent);}else{if (value) {JuA.node.value = before+value+after;}else{return JuA.node.value;}}; if(!onWork){Ifall("val",...arguments)};  };
JuA.__proto__.empty = function(){var g = new Array();for (var i = 0; i < object.children.length; i++) {g[i] = object.children[i];}g.each(function(e){e.remove();});if(!onWork){Ifall("empty",...arguments)};return JuA;}
JuA.__proto__.toggle = function(type){if (type) {if (type == "hide") {JuAJUA.hide()}if(type == "show"){JuAJUA.show()}}else{Jua.toggleFunc(function(){JuAJUA.hide();type = "hide";},function(){JuAJUA.show();type = "show";});} if(!onWork){Ifall("toggle",type)};};
JuA.__proto__.toggleFade = function(type){if (type) {if (type == "hide") {JuAJUA.fadeOut()}if(type == "show"){JuAJUA.fadeIn()}}else{Jua.toggleFunc(function(){JuAJUA.fadeOut();type = "hide";},function(){JuAJUA.fadeIn();type = "show";});} if(!onWork){Ifall("toggleFade",type)};};
JuA.__proto__.each = function(callback){if (typeof callback == "function") {if (JuA.length) { for(let i = 0;i < JuA.length;i++){callback.call(JuA[i],JuA[i],i)} }else{if(JuA.node){callback(JuA,0)};}}};
JuA.__proto__.random = function(){return Jua.random(JuA);};
JuA.__proto__.hasClass = function(className){if (JuA.node.className && JuA.node.className.search(className) != -1) {return true;}; return false;}
JuA.__proto__.hasAttr = function(attrName){return JuA.node.hasAttribute(attrName);}
JuA.__proto__.toggleClassName = function(className){JuA.toggleAttr("class",className);if(!onWork){Ifall("toggleClassName",...arguments)};return JuA;}
JuA.__proto__.addClass = function(className){if(JuA.node.className.lastIndexOf(" ") == (JuA.node.className.toString().length-1)){JuA.node.className += " "+className;}else{JuA.node.className += className;}if(!onWork){Ifall("addClass",...arguments)};return JuA;};
JuA.__proto__.removeClass = function(className){JuA.node.className = JuA.node.className.replaceAll(className,"");if(!onWork){Ifall("removeClass",...arguments)};return JuA;};
JuA.__proto__.filter = function(selector){var newi = Jua.new("div"); JuA.each(function(e){var g = e.clone(); g.detail("node",e.node); newi.append(g);}); newi = newi.select(selector); var snewi = new Array(); var c = 0;  newi.each(function(e,g){if (e.detail("node")) {snewi[c] = e.detail("node"); c++} });  return Jua(snewi);};
JuA.__proto__.clone = function(cloneType = true){return Jua(JuA.node.cloneNode(cloneType));};
JuA.__proto__.write = function(text,speed,type){if(!onWork){Ifall("write",...arguments)}Jua.write(JuA.node,text,speed,type);if(!onWork){Ifall("type",...arguments)};return JuA;};
JuA.__proto__.record = function(fps,fileName){if(!onWork){Ifall("record",...arguments)};return Jua.record(JuA.node,fps,fileName);};
JuA.__proto__.newParent = function(node){if(!onWork){Ifall("newParent",...arguments)};return Jua.createParent(JuA.node,node);};
JuA.__proto__.addParent = function(node){if(!onWork){Ifall("addParent",...arguments)};return Jua.createParent(JuA.node,node);};
JuA.__proto__.createParent = function(node){if(!onWork){Ifall("createParent",...arguments)};return Jua.createParent(JuA.node,node);};
JuA.__proto__.editable = function(boolean){if(!onWork){Ifall("editable",...arguments)};JuA.node.contentEditable = true;if(!onWork){Ifall("editable",...arguments)};return Jua;};
JuA.__proto__.droppable = function(target,callback){if(!onWork){Ifall("droppable",...arguments)};JuA.on('dragover', function(e) {e.stopPropagation();e.preventDefault();e.dataTransfer.dropEffect = 'copy';});JuA.on('drop', function(e) {e.stopPropagation();e.preventDefault();var files = e.dataTransfer.files;if (target) {target=Jua(target);target.node.files = files;target.change();};if (typeof callback == "function") {callback(files)}});}
JuA.__proto__.isIn = function(parent){parent = Jua(parent).node;return parent == JuA.node || Boolean(parent.compareDocumentPosition(JuA.node) & 16);}
JuA.__proto__.appendTo = function(target){if(!onWork){Ifall("appendTo",...arguments)};target = Jua(target); target.append(JuA.node);};
JuA.__proto__.toString = function(){return Jua.nodeToString(JuA.node);};
JuA.__proto__.ctx = function(contextID = "2d",attributes){return JuA.node.getContext(contextID,attributes);}
JuA.__proto__.log = function(...data){if(!onWork){Ifall("log",...arguments)};console.log(JuA,...data)};
JuA.__proto__.getJsSyntax = function(){return JsSyntax(JuA.node);}
JuA.__proto__.removeOn = function(type,callback,opt = false){if(!onWork){Ifall("removeOn",...arguments)}; JuA.node.removeEventListener(type,callback,opt);return JuA;}
JuA.__proto__.zoom = function(opt){if(!onWork){Ifall("zoom",...arguments)};return zoom(JuA.node,opt);};
JuA.__proto__.offset = function(){return {left:JuA.node.offsetLeft,top:JuA.node.offsetTop,height:JuA.node.offsetHeight,width:JuA.node.offsetWidth,parent:Jua(JuA.node.offsetParent)}};
JuA.__proto__.insertBefore = function(node){node = Jua(node).node;JuA.node.insertAdjacentElement("beforeBegin",node);if(!onWork){Ifall("insertBefore",...arguments)};return JuA;};
JuA.__proto__.insertAfter = function(node){node = Jua(node).node;JuA.node.insertAdjacentElement("afterEnd",node);if(!onWork){Ifall("insertAfter",...arguments)};return JuA;};
JuA.__proto__.height = function(height){return JuA.class("height",height);};
JuA.__proto__.width = function(width){return JuA.class("width",width);};
JuA.__proto__.removeAllOn = function(cloneType = true){if(!onWork){Ifall("removeAllOn",...arguments)};var j = JuA.clone(cloneType); JuA.replaceWith(j); nodeChanged(j); return this;};
JuA.__proto__.compile = function(obj = {}){if(!onWork){Ifall("compile",...arguments)};var text = JuA.html();for (let x in obj) {text = text.replaceAll("{{"+x+"}}",obj[x]);}JuA.html(text);return JuA;};

for (let x in plugins.select) {
   if (!JuA[x]) {
    if (typeof plugins.select[x] == "function") {
     JuA.__proto__[x] = function(){
        return plugins.select[x].call(this,...arguments);
      }
    }else{
      JuA[x] = plugins.select[x];
    }
   }
  }

if (!JuA.index) {JuA.index = 0};

function nodeChanged(node){
if (Jua.isJua(node)) {node = node.node;}
for (let x in JuA.node.hiddenValue) {
  Jua(node).detail();
  Jua(node).node.hiddenValue[x] = JuA.node.hiddenValue[x];
};
object = node;
JuAJUA.node = node;
JuA.node = node;

return Jua(node);
}

function Ifall(name,...argument){
   if(name) {
if (!onWork) {
       onWork = true;
     JuA.each(function(e,t){
      if (!object.isSameNode(e.node)) {   
      if(e[name]){
        e[name](...argument)
      }
     }
     })
    onWork = false;
}
   }
}
return JuA;

}
objectt = new JuaNode(objectt);
return objectt;
  }}
// important!
};

var Jua = function(selector,multipop){if(this){return Jua.new(selector,multipop)};if (selector) {if (typeof selector == "function") {return new jua().select(ownerDoc).ready(selector)}else{return new jua().select(selector,multipop)}}else{return new jua();}};
for(let x in new jua()){
Jua[x] = new jua()[x];
}
Jua.ready(function(){
  Jua["body"] = Jua("body");
})

 return Jua;
    }));