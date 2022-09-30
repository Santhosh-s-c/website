(function (global, factory) {            
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = 
factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.__Jua = factory();         

    } (this,function() {
"use strict";
/// start
var Jua = window.__Jua;
 var ownerDoc = document;
 function generateQuerySelector(elem){
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
           
        return `${generateQuerySelector(parentNode)} > ${str}`;
        }catch(err){
          return false;
        }
 };


var getSelectorOfNode = function(elem){
  var i = generateQuerySelector(elem);
if (i.toString().search("false") == 0) {return i.toString().substring(i.toString().search(">")+2,i.toString().length);}else{return i;}
}


  

 function select(selector,context){
        var getnode = function(selector){
            var selectorType = typeof selector;
            if (selectorType == "string") {
                var div = _Jua(document.createElement("div"));
                div.html(selector);
                var child = div.child();
                if (child.node) {return child.toArray()};
                return (context||ownerDoc).querySelectorAll(selector);
            };
            if (selectorType == "object" && selector instanceof Node) {
                return [selector];
            };
            if (selectorType == "object" && selector instanceof _Jua.JuaNodePrototype) {
                return selector.toArray();
            };
            return [];
        };
        
        var nodes = new Array();
        var selectorType = typeof selector;

        switch(selectorType){
            case 'string':
                nodes.push(...getnode(selector));
            break;

            case 'object':
                if (selector.length) {
                    if (selector.Jua) {
                        if (selector.toArray) {
                            selector = selector.toArray();
                        }else{
                            var _selector = [];
                            for (var i = 0; i < selector.length; i++) {
                                _selector.push(selector[i].node);
                            };
                        }
                        
                    }
                    for (var i = 0; i < selector.length; i++) {
                        nodes.push(...getnode( selector[i]));
                    };
                };
                if (selector instanceof Node) {
                    nodes.push(selector);
                };
            break;
        };

        var juaNodes = [];


////////////////////////////////////////////////////////////////////////////////////////////////////

        var Jua = function(node){
            if(node instanceof Node && !node["JuaExpando"]){
                node["JuaExpando"] = "JUA_NODE_"+_Jua.randomId()+_Jua.randomId();
            };
            this.selector = selector;
            this.node = node;
            this.Jua = true;
            this.__proto__ = new _Jua.JuaNodePrototype(node);
        };
////////////////////////////////////////////////////////////////////////////////////////////////////

        juaNodes.push(new Jua(nodes[0]));
        juaNodes[0].length = nodes.length;
        nodes.forEach(function(e,i){
            juaNodes[0][i] = new Jua(e)
            juaNodes[0][i][0] = juaNodes[0][i];
            juaNodes[0][i].length = 1;
        });

        return juaNodes[0];
};



var Jua = function(selector,context){
      if (this == undefined) {
        return new Jua(selector);
    };

    if (selector) {
        return select(selector,context);
    }

    
/// start
    
    
    this.ownerDoc = ownerDoc;
    this.ready = function(callback){
        Jua(this.ownerDoc).ready(callback);
    };
    this.events = {
            "abort": "UiEvent",
            "afterprint": "Event",
            "animationend": "AnimationEvent",
            "animationiteration": "AnimationEvent",
            "animationstart": "AnimationEvent",
            "beforeprint": "Event",
            "beforeunload": "UiEvent",
            "blur": "FocusEvent",
            "canplay": "Event",
            "canplaythrough": "Event",
            "change": "Event",
            "click": "MouseEvent",
            "contextmenu": "MouseEvent",
            "copy": "ClipboardEvent",
            "cut": "ClipboardEvent",
            "dblclick": "MouseEvent",
            "drag": "DragEvent",
            "dragend": "DragEvent",
            "dragenter": "DragEvent",
            "dragleave": "DragEvent",
            "dragover": "DragEvent",
            "dragstart": "DragEvent",
            "drop": "DragEvent",
            "durationchange": "Event",
            "ended": "Event",
            "error": "ProgressEvent",
            "focus": "FocusEvent",
            "focusin": "FocusEvent",
            "focusout": "FocusEvent",
            "fullscreenchange": "Event",
            "fullscreenerror": "Event",
            "hashchange": "HashChangeEvent",
            "input": "InputEvent",
            "invalid": "Event",
            "keydown": "KeyboardEvent",
            "keypress": "KeyboardEvent",
            "keyup": "KeyboardEvent",
            "load": "Event",
            "loadeddata": "Event",
            "loadedmetadata": "ProgressEvent",
            "loadstart": "Event",
            "message": "MouseEvent",
            "mousedown": "MouseEvent",
            "mouseenter": "MouseEvent",
            "mouseleave": "MouseEvent",
            "mousemove": "MouseEvent",
            "mouseover": "MouseEvent",
            "mouseout": "MouseEvent",
            "mouseup": "WheelEvent",
            "mousewheel": "WheelEvent",
            "offline": "Event",
            "online": "Event",
            "open": "Event",
            "pagehide": "PageTransitionEvent",
            "pageshow": "PageTransitionEvent",
            "paste": "ClipboardEvent",
            "pause": "Event",
            "play": "Event",
            "playing": "Event",
            "popstate": "PopStateEvent",
            "progress": "Event",
            "ratechange": "Event",
            "resize": "UiEvent",
            "reset": "Event",
            "search": "Event",
            "seeked": "Event",
            "seeking": "Event",
            "select": "UiEvent",
            "show": "Event",
            "stalled": "Event",
            "storage": "StorageEvent",
            "submit": "Event",
            "suspend": "Event",
            "timeupdate": "Event",
            "toggle": "Event",
            "touchcancel": "TouchEvent",
            "touchend": "TouchEvent",
            "touchmove": "TouchEvent",
            "touchstart": "Touch Event",
            "transitionend": "TransitionEvent",
            "unload": "UiEvent",
            "volumechange": "Event",
            "waiting": "Event",
            "wheel": "WheelEvent"
        };

    this.__proto__.about = {
        name:"Jua.js",
        author:"Santhosh.S",
        version: "1.0",
    };

    this.about = {
        name:"Jua.js",
        author:"Santhosh.S",
        version: "1.0",
    };

    this.strToEscape = function(str){
      return str.replace(/[\s\S]/g, function(character) {
        var escape = character.charCodeAt().toString(16),
            longhand = escape.length > 2;
        return '\\' + (longhand ? 'u' : 'x') + ('0000' + escape).slice(longhand ? -4 : -2);
      })
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
    
    this.strToHtmlNumeric = function(str){
       var stri = "";
      for (var i = 0; i < str.length; i++) {
       stri += "&#"+this.strToEscape(str[i]).replaceAll("\\","")+";";
      };
    return stri;
    };
    
    this.randomId = function(){
      var id = Math.random().toString(36).slice(2);
      var abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return (Number(id[0]) == 0 || Number(id[0])) ? Jua.random(...abc)+id:id; ;
    }    

    this.randomColor = function(){
      return "rgb("+Jua.randomNumber(255)+","+Jua.randomNumber(255)+","+Jua.randomNumber(255)+")";
    }
    
    this.random = function(array){
     if (arguments.length == 1) {
       return array[Math.floor(Math.random() * array.length)];
     }else{
       return arguments[Math.floor(Math.random() * arguments.length)];
     }
    };

    this.randomNumber = function(max = 10){
       return Math.floor(Math.random() * max);
    };

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

    this.uniformDeg = function(deg){
     deg = deg - (parseInt(deg/360)*360);
     deg = (deg < 0) ? deg+360:deg;
      return deg;
    }
    
   this.hslToRgb = function(hsl){
  let ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
  if (ex.test(hsl)) {
    let sep = hsl.indexOf(",") > -1 ? "," : " ";
    hsl = hsl.substr(4).split(")")[0].split(sep);
    var isPct = false;

    let h = hsl[0],
      s = hsl[1].substr(0,hsl[1].length - 1) / 100,
      l = hsl[2].substr(0,hsl[2].length - 1) / 100;

    // strip label and convert to degrees (if necessary)
    if (h.indexOf("deg") > -1)
      h = h.substr(0,h.length - 3);
    else if (h.indexOf("rad") > -1)
      h = Math.round(h.substr(0,h.length - 3) / (2 * Math.PI) * 360);
    else if (h.indexOf("turn") > -1)
      h = Math.round(h.substr(0,h.length - 4) * 360);
    // keep hue fraction of 360 if ending up over
    if (h >= 360)
      h %= 360;
    
    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    if (isPct) {
      r = +(r / 255 * 100).toFixed(1);
      g = +(g / 255 * 100).toFixed(1);
      b = +(b / 255 * 100).toFixed(1);
    }

    return "rgb("+ (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")";

  } else {
    return "Invalid input color";
  }
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
    
    this.PI = 22/7;
    
    this.options = function(){
    return Jua();
    };

    this.timer = function(){
      var starting = Date.now();
    return {
        now: function(){
            return {
                ms: Date.now() - starting,
                s: (Date.now() - starting)/1000,
            }
        }};
    };

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
      if (str == "") {return NaN;}
      return Number(str);
      }
    };


    this.select = select;

    this.asPX = function(val){
        var div = Jua("<div>");
        div.class("height",val);
        Jua("body").append(div);
        var val = div.class("height");
        div.remove();
        return parseFloat(val);
    };

        

    this.createMany = function(d,callback = function(){return;}){
            /*
            var data = {
            height: 63,
            marginTop: 10,
            marginBottom: 10,
            showAbleHeight: 900,
            parent: Jua("div"),
            values: [],
            scrollElement: Jua(document),
            getNode:function(v){
                return Jua("<li>"+v+"</li>");
            },
        };
            */
        
        
        
            if (Jua(d.scrollElement).node instanceof Document) {
                var se = Jua(d.scrollElement).node.scrollingElement;
            }else{
                var se = Jua(d.scrollElement).node;
            }
        
        
            var parent = Jua(d.parent);
            var nodeForScroll = Jua("<div>");
            var elementHeight = (d.height+d.marginTop+d.marginBottom);
            var parentHeight = d.showAbleHeight;
            var id = Jua.randomId();
        
            nodeForScroll.class({
                position: "relative",
                display: "inline-block",
                margin: "0px",
                height: Number(elementHeight * d.values.length).toString() + "px",
                width: "100%",
                padding: "0px",
                background: "transparent",
            });
            parent.class("overflow-y","auto");
            parent.append(nodeForScroll);
            var elements = [];
        
                            
                var scrollY = se.scrollTop;

                var cache = [];

            function scroll(e){
                if(e == true ||se.scrollTop !== scrollY) {
                  scrollY = se.scrollTop;
                }else{
                  return;
                }

        
                        Jua(elements).remove();
                        elements = [];
                var max = Math.min(100,window[id].showAbleHeight/elementHeight);
                
        
                    var s = Math.round(se.scrollTop/elementHeight);
                    for (var i = s-1; i < s+max; i++) {
                        if (d.values[i] != 0 && !d.values[i]) {
                            continue;
                        };
                            var element = cache[i]||d.getNode(d.values[i],i);
                            element.class({
                                position: "absolute",
                                top: Number(elementHeight*i).toString() + "px",
                            });
                            if (!cache[i]) {
                                cache[i] = element;
                            };
                            elements.push(element);
                    };

                 elements  = callback(elements) || elements;
                nodeForScroll.append(elements);

            };
            d["scroll"] = scroll;
            window[id] = d;
            
            Jua(d.scrollElement).node.onscroll = scroll;
            scroll(true);
            return id;
        };


    this.Animation = function(elem,css,duration = 1000,ease){
        var elem = Jua(elem);
        var transition = {
            transitionDuration: elem.class("transitionDuration"),
            transitionTimingFunction: elem.class("transitionTimingFunction"),
        };
        for(let name in css){
            elem.class(name,elem.class(name));
        };
        elem.class({
            transitionDuration: duration+"ms",
            transitionTimingFunction: ease,
        });
        elem.class(css);
    setTimeout(function() {elem.class(transition)}, duration);
    };


    this.JuaNodePrototype = function(node){
///////////////////////////////////////////////////////////////////////
            this.each = function(callback){
                if (!this.node) {
                    return;
                };

               if (typeof callback != 'function') {
                    return this;
                };
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i],this[i],i,this);
                };
            return this;
            };
///////////////////////////////////////////////////////////////////////
            this.callEvent = function(eventName,type = "auto"){
                if (!this.node) {
                    return;
                };

                this.each(function(e) {
                    if (type == 'auto') {
                        type = _Jua.events[eventName];
                    }
                    var event = ownerDoc.createEvent(type);
                    event.initEvent( eventName, true, false);
                    e.node.dispatchEvent(event);
                });
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.on = function( type, callback, opt){

                if (!this.node) {
                    return;
                };


                this.each(function(e){
                    e.node.addEventListener(type ,callback, opt);
                });
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.removeOn = function( type, callback, opt){                
                if (!this.node) {
                    return;
                };


                 this.each(function(e){
                    e.node.removeEventListener(type ,callback, opt);
                });
                return this;
            }
///////////////////////////////////////////////////////////////////////
            this.click = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'click', callback, opt);
                            }else{
                                this.callEvent('click');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.focus = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'focus', callback, opt);
                            }else{
                                this.callEvent('focus');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.dblclick = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'dblclick', callback, opt);
                            }else{
                                this.callEvent('dblclick');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mousedown = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mousedown', callback, opt);
                            }else{
                                this.callEvent('mousedown');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mouseup = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mouseup', callback, opt);
                            }else{
                                this.callEvent('mouseup');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mouseover = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mouseover', callback, opt);
                            }else{
                                this.callEvent('mouseover');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mouseleave = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mouseleave', callback, opt);
                            }else{
                                this.callEvent('mouseleave');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mousedown = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mousedown', callback, opt);
                            }else{
                                this.callEvent('mousedown');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mousemove = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mousemove', callback, opt);
                            }else{
                                this.callEvent('mousemove');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mouseout = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mouseout', callback, opt);
                            }else{
                                this.callEvent('mouseout');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mouseenter = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mouseenter', callback, opt);
                            }else{
                                this.callEvent('mouseenter');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mousewheel = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mousewheel', callback, opt);
                            }else{
                                this.callEvent('mousewheel');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.mousewheel = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'mousewheel', callback, opt);
                            }else{
                                this.callEvent('mousewheel');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.keydown = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'keydown', callback, opt);
                            }else{
                                this.callEvent('keydown');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.keyup = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'keyup', callback, opt);
                            }else{
                                this.callEvent('keyup');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.keypress = function(callback,opt){                
                if (!this.node) {
                    return;
                };


                            if (callback) {
                                this.on( 'keypress', callback, opt);
                            }else{
                                this.callEvent('keypress');
                            };
                        return this;
                        };
///////////////////////////////////////////////////////////////////////
            this.ready = function(callback){                
                if (!this.node) {
                    return;
                };


                if (typeof callback != 'function') {
                    return this;
                };

                if (node instanceof Document) {
                    if (node.readyState === "complete" 
                         || 
                        node.readyState === "interactive") {
                            this.on("load",callback);
                    }else{
                       this.on("DOMContentLoaded", callback);
                    };
                }else{
                    callback(this);
                };
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.push = function(...nodes){                
                if (!this.node) {
                    return;
                };


                var _this = this;
                _Jua(nodes).each(function(e){
                    _this[_this.length] = e;
                    _this.length += 1;
                });
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.toArray = function(){                
                if (!this.node) {
                    return;
                };


                var array = [];
                this.each(function(e){
                    array.push(e.node);
                });
                return array;
            };
///////////////////////////////////////////////////////////////////////
            this.child = function(){                
                if (!this.node) {
                    return;
                };


                return _Jua(this.node.children);
            };
///////////////////////////////////////////////////////////////////////
            this.parent = function(){                
                if (!this.node) {
                    return;
                };


                return _Jua(this.node.parentNode);
            };
///////////////////////////////////////////////////////////////////////
            this.prev = function(){                
                if (!this.node) {
                    return;
                };


                return _Jua(this.node.previousElementSibling);
            };
///////////////////////////////////////////////////////////////////////
            this.next = function(){                
                if (!this.node) {
                    return;
                };


                return _Jua(this.node.nextElementSibling);
            };
///////////////////////////////////////////////////////////////////////
            this.attr = function( name, value){                
                if (!this.node) {
                    return;
                };


                if (name && value) {
                    this.each(function(e){
                        if (typeof value == "function") {
                            e.node.setAttribute( name, value(this.node.getAttribute( name),e,name,this));
                        }else{
                            e.node.setAttribute( name, value);
                        }
                    });
                }else if (name){
                    if (typeof name == "object") {
                        this.each(function(e){
                        for (let attrName in name) {
                            e.node.setAttribute( attrName, name[attrName]);
                        }
                    });
                    }else{
                        return this.node.getAttribute( name);
                    }
                };
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.id = function( value){                
                if (!this.node) {
                    return;
                };


                if (value) {
                    this.each(function(e){
                        e.node.setAttribute( 'id', value);
                    });
                }else{
                    return this.node.getAttribute( 'id');
                };
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.removeAttr = function( name){                
                if (!this.node) {
                    return;
                };


                if (name instanceof Array) {
                    this.each(function(e){
                         name.forEach(function(name){
                            e.node.removeAttribute(name);
                         });
                    });
                }else{
                    this.each(function(e){
                        e.node.removeAttribute(name);
                    });
                };
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.getSelector = function(){                
                if (!this.node) {
                    return;
                };


                return getSelectorOfNode(this.node);
            };
///////////////////////////////////////////////////////////////////////
            this.css = this.class = function( name, value){                
                if (!this.node) {
                    return;
                };


                if (name && value) {
                    this.each(function(e){
                        if (typeof value == "function") {
                            e.node.style[name] = value(e.node.style[name],e,name,this);
                        }else{
                            e.node.style[name] = value;
                        }
                        
                    });
                }else if( name){
                   if (typeof name == "object") {
                    this.each(function(e){
                        for (let className in name) {
                           e.class(className,name[className]);
                        };
                    });
                   }else{
                     return window.getComputedStyle(this.node)[name];
                   }
                };

                if (!name && !value) {
                    var _this = this;
                    var style = window.getComputedStyle(this.node);
                    style.extract = function(){
                        var style = window.getComputedStyle(_this.node);
                        var div = ownerDoc.createElement("div");
                        document.body.appendChild(div);
                        var defaultStyle = window.getComputedStyle(div);
                        var extracted = {};

                        for (let name in style) {
                           if (style[name] != defaultStyle[name]) {
                             extracted[name] = style[name];
                           };
                        };
                        div.remove();
                        return extracted;
                    };
                    return style; 
                };

                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.clone = function(childs = false){                
                if (!this.node) {
                    return;
                };


                var cloned = [];
                this.each(function(e,i){
                        cloned.push(e.node.cloneNode(childs));
                });
                return _Jua(cloned);
            };
///////////////////////////////////////////////////////////////////////
            this.replaceWith = function(node){                
                if (!this.node) {
                    return;
                };


                var node = _Jua(node);
                if (node.length == this.length) {
                    this.each(function(e,i){
                        if (e.parent().node) {
                            e.parent().node.replaceChild(node[i].node,e.node);
                        };
                    });
                }else{
                    this.each(function(e){
                        if (e.parent().node && node[0].clone().node) {
                            e.parent().node.replaceChild(node[0].clone().node,e.node);
                        };
                    });
                }
                return this;
            };
///////////////////////////////////////////////////////////////////////
            this.toString = function(){                
                if (!this.node) {
                    return;
                };


                return this.node.outerHTML;
            };
///////////////////////////////////////////////////////////////////////
            this.html = function(html,add = false){                
                if (!this.node) {
                    return;
                };


                if (html != '' && !html) {
                    return this.node.innerHTML;
                }
                var _this = this;
            this.each(function(e,i){
                if (typeof html == "function") {
                    var _html = html(e,i,_this);
                }else{
                    var _html = html;
                }
                if (add) {
                    e.node.innerHTML += _html;
                }else{
                    e.node.innerHTML = _html;
                };
            });

                return this;
            };
///////////////////////////////////////////////////////////////////////
        this.text = function(text,add = false){                
                if (!this.node) {
                    return;
                };


                if (text != '' && !text) {
                    return this.node.textContent;
                }
                var _this = this;
            this.each(function(e,i){
                if (typeof text == "function") {
                    var _text = text(e,i,_this);
                }else{
                    var _text = text;
                }
                if (add) {
                    e.node.textContent += _text;
                }else{
                    e.node.textContent = _text;
                };
            });

                return this;
            };
///////////////////////////////////////////////////////////////////////
        this.val = function(val,add = false){                
                if (!this.node) {
                    return;
                };


                if (val != '' && !val) {
                    return this.node.value;
                }
                var _this = this;
            this.each(function(e,i){
                if (typeof val == "function") {
                    var _val = val(e,i,_this);
                }else{
                    var _val = val;
                }
                if (add) {
                    e.node.value += _val;
                }else{
                    e.node.value = _val;
                };
            });

                return this;
            };

///////////////////////////////////////////////////////////////////////
        this.tagName = function(tagName){                
                if (!this.node) {
                    return;
                };


            return this.node.tagName;
        };
///////////////////////////////////////////////////////////////////////
        this.hide = function(){                
                if (!this.node) {
                    return;
                };


            this.each(function(e){
                e.class("display","none");
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.show = function(display = 'block'){                
                if (!this.node) {
                    return;
                };


            this.each(function(e){
                e.class("display",display);
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.remove = function(childNode){                
                if (!this.node) {
                    return;
                };


            var child = _Jua(childNode);
            var _this = this;
            if (child.node) {
                child.each(function(e){
                    _this.node.removeChild(e.node);
                });
            }else{
                this.each(function(e){
                    e.node.remove();
                });
            }
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.isIn = function(parent) {                
                if (!this.node) {
                    return;
                };


            parent = _Jua(parent).node;

            return parent == this.node || Boolean(parent.compareDocumentPosition(this.node) & 16);
        };
///////////////////////////////////////////////////////////////////////
        this.height = function(height){                
                if (!this.node) {
                    return;
                };

            return this.class("height",height);
        };
///////////////////////////////////////////////////////////////////////
        this.width = function(width){                
                if (!this.node) {
                    return;
                };


            return this.class("width",width);
        };
///////////////////////////////////////////////////////////////////////
        this.insertBefore = function(node) {                
                if (!this.node) {
                    return;
                };


            var node = _Jua(node).node;
            this.each(function(e){
                e.node.insertAdjacentElement("beforeBegin", node);
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.insertAfter = function(node) {                
                if (!this.node) {
                    return;
                };


            var node = _Jua(node).node;
             this.each(function(e){
                e.node.insertAdjacentElement("afterEnd", node);
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.append = function(childs){                
                if (!this.node) {
                    return;
                };
                if (!childs) {
                    return;
                }

            this.each(function(e1){
            var nodes = _Jua(childs);
                nodes.each(function(e2){
                    e1.node.appendChild(e2.node);
                });
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.offset = function(){                
                if (!this.node) {
                    return;
                };


            var offset = JSON.parse(JSON.stringify(this.node.getBoundingClientRect()));
            offset.parent = this.parent();
            return offset;
        };
///////////////////////////////////////////////////////////////////////
        this.log = function(...data){                
                if (!this.node) {
                    return;
                };


            console.log(this,...data);
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.ctx = function(contextID = "2d",attributes){                
                if (!this.node) {
                    return;
                };


            return this.node.getContext(contextID,attributes);
        };
///////////////////////////////////////////////////////////////////////
       this.editable = function(boolean){                
                if (!this.node) {
                    return;
                };


            Jua.node.contentEditable = boolean;
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.empty = function(){                
                if (!this.node) {
                    return;
                };


            this.child().each(function(e){
                e.remove();
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.select = this.Jua = this.jua = function(selector){                
                if (!this.node) {
                    return;
                };


            return _Jua(selector,this.node);
        };
///////////////////////////////////////////////////////////////////////
        this.anim = function(css,duration = 1000,ease){                
                if (!this.node) {
                    return;
                };


            var css = css;
            this.each(function(e,i){
                if (typeof css == "function") {
                    css = css(e,i,this,)
                }
                _Jua.Animation(e,css,duration,ease);
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.hasAttr = function(attrName){                
                if (!this.node) {
                    return;
                };


            return this.node.hasAttribute(attrName);
        };
///////////////////////////////////////////////////////////////////////
        this.appendTo = function(node){                
                if (!this.node) {
                    return;
                };


            this.each(function(e){
                Jua(node).append(e);
            });
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.random = function(){                
                if (!this.node) {
                    return;
                };


            return Jua.random(this);
        };
///////////////////////////////////////////////////////////////////////
        this.prop = function(name,value){                
                if (!this.node) {
                    return;
                };


            if (name && value) {
                    this.each(function(e){
                        if (typeof value == "function") {
                            e.node[name] = value(e.node[name],e,name,this);
                        }else{
                            e.node[name] = value;
                        }
                    });
                }else if (name){
                    if (typeof name == "object") {
                        this.each(function(e){
                        for (let propName in name) {
                            e.node[propName] = name[propName];
                        }
                    });
                    }else{
                        return this.node[name];
                    }
                };
                return this;
        };
///////////////////////////////////////////////////////////////////////
        this.data = function(name,value){                
                if (!this.node) {
                    return;
                };


           this.each(function(e){
             if (!_Jua.cache[e.node.JuaExpando]) {
                _Jua.cache[e.node.JuaExpando] = {};
            };
           });

        if (name && value) {
                    this.each(function(e){
                        if (typeof value == "function") {
                            _Jua.cache[e.node.JuaExpando][name] = value(_Jua.cache[e.node.JuaExpando],e,name,this);
                        }else{
                            _Jua.cache[e.node.JuaExpando][name] = value;
                        }
                    });
                }else if (name){
                    if (typeof name == "object") {
                        this.each(function(e){
                        for (let propName in name) {
                           _Jua.cache[e.node.JuaExpando][propName] = name[propName];
                        }
                    });
                    }else{
                        return _Jua.cache[this.node.JuaExpando][name];
                    }
                };
                return this;
        };
///////////////////////////////////////////////////////////////////////
        this.addClass = function(className){                
                if (!this.node) {
                    return;
                };


             this.each(function(){
                this.node.classList.add(className);
             })
             return this;
        };
///////////////////////////////////////////////////////////////////////
        this.removeClass = function(className){                
                if (!this.node) {
                    return;
                };


            this.each(function(){
                this.node.classList.remove(className);
             })
             return this;
        };
///////////////////////////////////////////////////////////////////////
        this.toggleClass = function(className){                
                if (!this.node) {
                    return;
                };


             this.each(function(){
                this.node.classList.toggle(className);
             })
             return this;
        };
///////////////////////////////////////////////////////////////////////
        this.pick = this.get = function(num){                
                if (!this.node) {
                    return;
                };


            return this[num];
        };
///////////////////////////////////////////////////////////////////////
        this.fadeIn = function(speed,ease){                
                if (!this.node) {
                    return;
                };


            this.anim({opacity: "1",},speed,ease);
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.fadeOut = function(speed,ease){                
                if (!this.node) {
                    return;
                };


            this.anim({opacity: "0",},speed,ease);
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.slideDown = function(speed,ease){                
                if (!this.node) {
                    return;
                };


            this.anim(function(e){
                return {height: e.data("old-height"),};
            },speed,ease);
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.slideUp = function(speed,ease){                
                if (!this.node) {
                    return;
                };


            this.each(function(e){
                e.data("old-height",e.class("height"));
            }); 
            this.anim({height: "0px",},speed,ease);
            return this;
        };
///////////////////////////////////////////////////////////////////////
        this.isSame = function(selector){
                if (!this.node) {
                    return;
                };
            return this.node.isSameNode(Jua(selector).node);
        };
///////////////////////////////////////////////////////////////////////
        this.scroll = function(x,y){
            if (!this.node) {
                    return;
            };

            if (x || y) {
                this.each(function(e) {
                if (x == 0 || x) {e.node.scrollX = x;}
                if (y == 0 || y) {e.node.scrollY = y;}
            });
            }else{
                return {x:e.node.scrollTop,y:e.node.scrollY};
            };
            return this;
        };
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

};



/// end

};

for (let opt in Jua()) {
    Jua[opt] = Jua()[opt];
};

Jua.cache = {};

var _Jua = Jua;

return Jua;
/// end

}));