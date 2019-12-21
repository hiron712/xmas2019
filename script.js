function ready(callback){
    if (document.readyState!='loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function getpos(e){
    var isFirefox,pageX,pageY;
    var isTouch = ('ontouchstart' in window);
    if(navigator.userAgent.indexOf('Firefox')!=-1){
        isFirefox = true;
    }else{
        isFirefox = false;
    }

    if(isTouch){
        if('originalEvent' in e){
            if('pageX' in e.originalEvent){
                pageX = e.originalEvent.pageX;
                pageY = e.originalEvent.pageY;
            }else if('touches' in e.originalEvent){
                pageX = e.originalEvent.touches[0].pageX;
                pageY = e.originalEvent.touches[0].pageY;
            }

        }else if('changedTouches' in event){
            pageX = event.changedTouches[0].pageX;
            pageY = event.changedTouches[0].pageY;
        }else  if('pageX' in e){
            pageX = e.pageX;
            pageY = e.pageY;
        }

    }else{
        pageX = e.pageX;
        pageY = e.pageY;
    }

    return {
        x : Math.round(pageX),
        y : Math.round(pageY)
    }
}

function snow(){
    this.init();
}

snow.prototype = {
    init:function(){
        var me = this;
        me.$body = document.getElementsByTagName('body')[0];

        me.q = 100;
        me.h = 600;

        me.mouseX = 0;
        me.mouseY = 0;

        me.px = me.mouseX;
        me.py = me.mouseY;

        window.addEventListener('resize',function(){
            me.onresize();
        });

        me.setBody();
        me.setFont();
        me.$xmas = me.setText();

        var loop = function(){
            for(var i = 0; i < me.snows.length; i++){

                me.snows[i].z += me.snows[i].az;

                me.px += (me.mouseX - me.px)/200;
                me.py += (me.mouseY - me.py)/200;

                var dat = me.threeToTwo(me.snows[i].x + me.px,me.snows[i].y + me.py,me.snows[i].z);

                if(me.snows[i].z > me.h){
                    me.snows[i].z = me.h * -1;
                    me.snows[i].reset();
                }

                if(me.snows[i].z < 0){
                    var alpha = Math.abs(me.snows[i].z)/me.h;
                    me.snows[i].style.opacity = 1 - alpha;
                }else{
                    me.snows[i].style.opacity = 1;
                }
        
                me.snows[i].setPos(dat.x,dat.y,dat.scale);
        
            }

            for(var i = 0; i < me.stars.length; i++){
                me.stars[i].reset();
            }

            requestAnimationFrame(loop);
        }

        me.$body.addEventListener('mousemove',function(e){
            var pos = getpos(e);
            me.mouseX = (me.midx - pos.x)/10;
            me.mouseY = (me.midy - pos.y)/10;
        });
        
        setTimeout(function(){
            me.onresize();
            setTimeout(function(){
                me.setStar();
                me.setSnow();
                requestAnimationFrame(loop);
                me.$body.style.opacity = 1;
            },100);
        },100);
    },
    setText:function(){
        var me = this;
        var $text = document.createElement('div');
        $text.style.color = '#ffff00';
        $text.style.fontSize = '60px';
        $text.style.fontFamily = "'Playball', cursive";
        $text.style.position = 'absolute';
        $text.style.left = '50%'; 
        $text.style.top = '50%'; 
        $text.style.transform = 'translate(-50%,-50%)';

        $text.style.background = '-webkit-linear-gradient(0deg, #40E0D0, #FF8C00, #FF0080)';
        $text.style.webkitBackgroundClip = 'text';
        $text.style.webkitTextFillColor = 'transparent';

        var newtext = document.createTextNode('Happy Merry Christmas!');
        $text.appendChild(newtext);
        me.$body.appendChild($text);

        return $text;
    },
    setSnow:function(){
        var me = this;
        me.snows = [];
        for(var i = 0; i < me.q; i++){
            var $snow = me.createSnow();
            me.snows.push($snow);
            me.$body.appendChild($snow);
        }
    },
    setStar:function(){
        var me = this;
        me.stars = [];
        for(var i = 0; i < me.q; i++){
            var $star = me.createStar();
            me.stars.push($star);
            me.$body.appendChild($star);
        }
    },
    createSnow:function(){
        var me = this;
        var $div = document.createElement('div');

        $div.reset = function(){
            var size = Math.random() * 35 + 5;

            $div.style.width = size + 'px';
            $div.style.height = size + 'px';
            $div.style.borderRadius = '50%';
            $div.style.position = 'absolute';
    
            $div.x = Math.random() * 800 - 400;
            $div.y = Math.random() * 800 - 400;
    
            $div.az = Math.random() * 22 + 3;    
        };

        $div.z = Math.random() * 1200 - 600;
        $div.style.backgroundColor = '#ffffff';
        $div.style.filter = 'blur(4px)';

        $div.setPos = function(x,y,scale){
            this.style.transform = 'translate(' + x + 'px,' + y +'px) scale('+ scale +')';
        };

        $div.left = function(num){
            this.style.left = num + 'px';
        };
        $div.top = function(num){
            this.style.top = num + 'px';
        };

        $div.scale = function(num){
            this.style.transform = 'scale('+ num +')';
        };

        $div.reset();

        return $div;
    },
    createStar:function(){
        var me = this;
        var $div = document.createElement('div');
        $div.style.width = '3px';
        $div.style.height = '3px';
        $div.style.position = 'absolute';
        $div.style.left = '0px';
        $div.style.top = '0px';
        $div.style.zIndex = -1;

        $div.reset = function(){
            $div.style.backgroundColor = 'rgb(' + Math.round(Math.random()*255) +',' + Math.round(Math.random()*255)+',' + Math.round(Math.random()*255) +')';
        };
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;
        $div.style.borderRadius = '50%';
        $div.style.transform = 'translate('+ x +'px,'+ y +'px)';    

        $div.reset();

        return $div;
    },
    threeToTwo:function(xpoz,ypoz,zpoz){
        var me = this;

        _x = (me.h * xpoz)/(me.h - zpoz) + me.midx;
        xx = (me.h * (xpoz+100))/(me.h - zpoz) + me.midx;
        _y = (me.h * ypoz)/(me.h - zpoz) + me.midy;
    
        sl = xx-_x;

        return {
            x : _x,
            y : _y,
            scale : sl/100,
        }
    },
    setBody:function(){
        var me = this;

        me.$body.style.backgroundColor = '#001122';
        me.$body.style.margin = 0;
        me.$body.style.padding = 0;
        me.$body.style.position = 'absolute';
        me.$body.style.top = 0;
        me.$body.style.bottom = 0;
        me.$body.style.left = 0;
        me.$body.style.right = 0;
        me.$body.style.overflow = 'hidden';
        me.$body.style.transition = 'all 1500ms 0s ease';
        me.$body.style.opacity = 0;
    },
    setFont:function(){
        var me = this;
        var $link = document.createElement('link');
        $link.setAttribute('href','https://fonts.googleapis.com/css?family=Playball&display=swap');
        $link.setAttribute('rel','stylesheet');
        me.$body.appendChild($link);
    },
    onresize:function(){
        var me = this;
        me.midx = window.innerWidth/2;
        me.midy = window.innerHeight/2;
    }
};

ready(function(){
    new snow();
});