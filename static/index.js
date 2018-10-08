
Array.prototype._random = function() {
    this.sort(function(d, e) {
        return Math.random() <= .5 ? -1 : 1;
    });
    return this;
};

Array.prototype.random = function() {
    var d = Math.ceil(this.length / 2), e = this.length;
    var f = this.slice(0, d), g = this.slice(d, this.length);
    f._random(), g._random();
    for (var h = 0; h < e; h += 2) {
        var i = Math.floor(h / 2);
        f[i] && (this[h] = f[i]);
        g[i] && (this[h + 1] = g[i]);
    }
    this._random();
    return this;
};

Array.prototype.remove = function(d) {
    if (d <= 0) {
        this.shift();
    } else if (d >= this.length - 1) {
        this.pop();
    } else {
        var e = this.slice(0, d).concat(this.slice(d + 1, this.length));
        for (var f = 0, max = this.length; f < max; f++) {
            this.pop();
        }
        for (var f = 0, max = e.length; f < max; f++) {
            this.push(e[f]);
        }
        e = null;
    }
    return this;
};

String.prototype.format = function(d, e) {
    return this.replace(e || /\${([^}]*)}/g, function(f, h) {
        var i = d;
        if (h.indexOf(".") >= 0) {
            var j = h.split("."), k;
            while (k = j.shift()) {
                i = i[k];
                if (!i) break;
            }
        } else {
            i = i[h];
        }
        return i || "";
    });
};

var a = {};

a.debug = false;

a.width = 480;

a.height = 760;

a.time=0;

a.timer=null;

btGame.makePublisher(a);


~function(a) {
   
    var _url = window.location.href;
    var codeindex = _url.indexOf('code=');
    var stateindex = _url.indexOf('&state');
    var start = sessionStorage.getItem('start');
    if(true){
        $.ajax({
            type: 'GET',
            url: 'https://api.huanjiaohu.com/api/material/random/imageList',
            dataType: 'json',
            timeout: 5000,
            success: function(map){

                a.gameMap = map;
                a.gameList = map['1'].concat(map['2']).concat(map['3']).concat(map['4']);
                a.maxLevel = 30;
                a.currentLevel = 0;
                a.maxGate = 3;
                a.picPath = "https://static.huanjiaohu.com/image/material";
                a.MODE = {
                    PIC: "picture",
                    NAM: "name"
                };
                a.playMode = a.MODE.PIC;
                a.setPlayMode = function(h) {
                    a.playMode = a.MODE.PIC;
                    a.fire("playModeChange", a.playMode);
                };

                
                for (var g = 0, max = a.gameList.length; g < max; g++) {
                    var h = a.gameList[g];
                    if(h){
                        h.pic = a.picPath+h.pic;
                        a.load.add({
                            id: h.key,
                            src: h.pic
                        });
                    }
                    
                    if(g==29){
                        sessionStorage.removeItem('start');
                        a.setPlayMode($(this).index() - 1);
                        a.fire("pageChange", 1);
                        a.fire("gameStart");
                        a.timer=setInterval(function(){a.time+=1},100);
                    }
                }
               
                
            },
            error: function(xhr, type){
              alert(type)
            }
          });
          var _code = _url.slice(codeindex+5,stateindex);
          $.ajax({
            type: 'GET',
            url: 'https://api.huanjiaohu.com/api/users/login/weixin',
            data: { code: _code },
            dataType: 'json',
            timeout: 5000,
            success: function(data){
                sessionStorage.setItem('user_id',data.id);
            },
            error: function(xhr, type){
              //alert(type)
            }
          })
    
    }
    }(a);

~function(a) {
    a.load = [];
    var d = null;
    a.load.add = function(e) {
        a.load.push(e);
    };
    a.load.start = function() {
        var e = a.load, f = 0, g = e.length;
        d = $("<div></div>");
        d.css({
            position: "absolute",
            top: 1,
            left: 1,
            "z-index": -1,
            opacity: 0,
            overflow: "hidden",
            height: 1,
            width: 1
        });
        $("body").append(d);
        a.fire("loadProgress", 0);
        for (var h = 0, max = e.length; h < max; h++) {
            var i = $("<img />");
            i.one("load error", function() {
                f++;
                a.fire("loadProgress", f / g);
            });
            d.append(i);
            var j = e[h];
            i.attr({
                "data-id": j.id || j.src,
                src: j.src
            });
        }
    };
    a.load.get = function(e) {
        return d.find("[data-id='" + e + "']");
    };
    a.on("loadProgress", function(e, f) {
        btGame.gameLoading(f);
    });
}(a);



~function(a) {
    var d = $("#main .page"), e = "hide", f = 200;
    function g() {
        var h = Math.random() > .5 ? "100%" : "-100%", i = Math.random() > .5 ? "100%" : "-100%";
        return {
            left: h,
            top: i
        };
    }
    a.on("pageChange", function(h, i) {
        d.css(g());
        var j;
        if (typeof i === "number") {
            j = d.eq(i);
        } else {
            j = d.filter(i);
        }
        j.removeClass("animate");
        j.css(g());
        setTimeout(function() {
            j.addClass("animate");
            j.css({
                left: 0,
                top: 0
            });
        }, f);
    });
}(a);

~function(a) {
    var d = $("#start");
    d.on("click", ".guessPic", function(e) {
        sessionStorage.setItem('start','start');
        window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6edb9c7695fb8375&redirect_uri=https://game.huanjiaohu.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    });
    d.on("click", ".guessNam", function(e) {
        window.location.href='https://group.huanjiaohu.com';
    });
    d.on("click", ".rule", function(e) {
        overlay('rule-dialog');
    });
    d.on("click", ".ranking", function(e) {
        $.ajax({
            type: 'GET',
            url: 'https://api.huanjiaohu.com/api/game/list',
            dataType: 'json',
            timeout: 5000,
            success: function(datas){
                var week = datas.week;
                var month = datas.month;
                var totle = datas.totle;

                var weektr = ["<tr><th width='55px' style='text-align:center'>排名</th><th>用户名</th><th width='70px'>称号</th><th width='50px'>用时</th></tr>"];
                var monthtr = ["<tr><th width='55px' style='text-align:center'>排名</th><th>用户名</th><th width='70px'>称号</th><th width='50px'>用时</th></tr>"];
                var totletr = ["<tr><th width='55px' style='text-align:center'>排名</th><th>用户名</th><th width='70px'>称号</th><th width='50px'>用时</th></tr>"];

                $.each(week,function (i,data){
                    var name = data['name'].length<=8?data['name']:data['name'].substring(0,8)+'...';
                    var _tr = "<tr><td>"+(i+1)+"</td><td><div class='name' width='70px'><div class='head'><img src='"+data['headimgurl']+"'></div><div style='padding-top:5px;'>&nbsp;&nbsp;"+name+"</div></div></td><td>"+data['title']+"</td><td>"+Number(data['time'])/10+"</td></tr>";
                    weektr.push(_tr)
                });
                $.each(month,function (i,data){
                    var name = data['name'].length<=8?data['name']:data['name'].substring(0,8)+'...';
                    var _tr = "<tr><td>"+(i+1)+"</td><td><div class='name' width='70px'><div class='head'><img src='"+data['headimgurl']+"'></div><div style='padding-top:5px;'>&nbsp;&nbsp;"+name+"</div></div></td><td>"+data['title']+"</td><td>"+Number(data['time'])/10+"</td></tr>";
                    monthtr.push(_tr)
                });
                $.each(totle,function (i,data){
                    var name = data['name'].length<=8?data['name']:data['name'].substring(0,8)+'...';
                    var _tr = "<tr><td>"+(i+1)+"</td><td><div class='name' width='70px'><div class='head'><img src='"+data['headimgurl']+"'></div><div style='padding-top:5px;'>&nbsp;&nbsp;"+name+"</div></div></td><td>"+data['title']+"</td><td>"+Number(data['time'])/10+"</td></tr>";
                    totletr.push(_tr)
                });
                $("#weekranking").html(weektr.join(""));
                $("#monthranking").html(monthtr.join(""));
                $("#totleranking").html(totletr.join(""));

                overlay('ranking-dialog');
            },
            error: function(xhr, type){
              alert(type)
            }
          })
    });

}(a);

~function(a) {
    var d = "", e = $(".container"), f = $("#play .time"), g = $("#play .tip");
    var h = $(".heartList"), i = $("#play .level");
    a.on("playModeChange", function(k, l) {
        d = $(l === a.MODE.PIC ? "#template_game_pic" : "#template_game_nam").html();
        d = $.trim(d);
    });
    a.on("gameStart", function(k) {
        for (var l in a.gameMap) {
           a.gameMap[l].random();
        }
        var user_id = sessionStorage.getItem('user_id');
        if(!user_id){
            j.reset(1);
        }else{
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()+1;
            if(month<10)month='0'+month;
            var day = today.getDate();
            if(day<10)day='0'+day;
            var date = year+''+month+''+day;
            $.ajax({
                type: 'POST',
                url: 'https://api.huanjiaohu.com/api/tools/share/select',
                data: {'param':'type=game','user_id':Number(user_id),'date':date },
                dataType: 'json',
                timeout: 5000,
                success: function(data){
                    if(data&&data.length>0){
                        j.reset(3);
                    }else{
                        j.reset(1);
                    }
                },
                error: function(xhr, type){
                  alert(type)
                }
              })
        }
    });
    var j = {
        reset: function(heart) {
            a.currentLevel = 0;
            a.maxWrongCount = heart;
            a.wrongCount = 0;
            this.next(false);
            var k = 3, l = this;
            var m = setInterval(function() {
                k--;
                if (k <= 0) {
                    clearInterval(m);
                    l.timer.start();
                }
                a.fire("playPrepare", k);
            }, 1e3);
            a.fire("playPrepare", k);
            this.heart(heart);
        },
        next: function(k) {
            var l = ++a.currentLevel;
            if (a.currentLevel > a.maxLevel) {
                a.fire("gameEnd");
                return;
            }
            var m = Math.ceil(a.currentLevel / 10), n = a.gameMap[m][l - (m - 1) * 10 - 1];
            var o = a.gameList.slice(0).remove(n.key - 1).random().slice(0, 3);
            o.push(n);
            o.random();
            a.fire("nextLevel", o, n);
            if (k) {
                this.timer.start();
            }
        },
        heart: function(k) {
            a.fire("resetHeartCount", k);
        },
        timer: {
            timer: null,
            start: function() {
                clearInterval(this.timer);
                var k = 10, l = this;
                a.fire("timeChange", k);
                this.timer = setInterval(function() {
                    k--;
                    a.fire("timeChange", k);
                    if (k <= 0) {
                        l.timeup();
                        clearInterval(l.timer);
                    }
                }, 1e3);
                a.isTimeup = false;
            },
            stop: function() {
                clearInterval(this.timer);
                this.timer = null;
            },
            timeup: function() {
                a.fire("gameEnd");
                a.isTimeup = true;
            }
        }
    };
    a.on("gameEnd", function() {
        j.timer.stop();
    });
    a.on("playPrepare", function(k) {
        f.html(10);
    });
    e.on("click", ".answer1, .answer2", function() {
        var k = $(this);
        if (a.wrongCount >= a.maxWrongCount || a.isPreparingNext || a.isTimeup) {
            return false;
        }
        var l = e.find(".gameTip");
        var m = k.data("key"), n = l.data("key");
        if (m == n) {
            k.addClass("right");
            a.isPreparingNext = true;
            j.timer.stop();
            setTimeout(function() {
                j.next(true);
                a.isPreparingNext = false;
            }, 1e3);
        } else {
            k.addClass("error");
            setTimeout(function() {
                k.removeClass("error");
            }, 2e3);
            a.wrongCount++;
            a.fire("answerWrong", a.wrongCount);
        }
    });
    a.on("nextLevel", function(k, l, m) {
        i.html(a.currentLevel);
        e.html(d.format({
            data: m,
            arr1: l[0],
            arr2: l[1],
            arr3: l[2],
            arr4: l[3]
        }));
        if (a.debug) {
            e.find("a[data-key='" + m.key + "']").css("background", "#99ccff");
        }
    });
    a.on("timeChange", function(k, l) {
        f.html(l);
    });
    a.on("playModeChange", function(k, l) {
        if (l == a.MODE.PIC) {
            g.html("根据提示的名字，找出对应的照片");
        } else {
            g.html("根据提示的照片，找出对应的名字");
        }
    });
    a.on("answerWrong", function(k, l) {
        a.fire("resetHeartCount", a.maxWrongCount - l);
        if (l >= a.maxWrongCount) {
            setTimeout(function() {
                a.fire("gameEnd");
            }, 500);
        }
    });
    a.on("resetHeartCount", function(k, l) {
        var m = "";
        for (var n = 0; n < l; n++) {
            m += '<em class="heart"></em>';
        }
        h.html(m);
    });
    if (a.debug) {
        window.b = j;
        a.on("nextLevel", function(k, l, m) {
            console.log(l);
        });
    }
}(a);

~function(a) {
    var d = $("#prepare"), e = d.find(".text");
    a.on("playPrepare", function(f, g) {
        if (g <= 0) {
            d.css("top", "-100%");
            setTimeout(function() {
                d.css("top", 0);
                d.hide();
            }, 500);
        } else {
            d.show();
            e.html(g);
        }
    });
    d.hide();
}(a);

~function(a) {
    var d = $("#end"), e = d.find(".level"), f = d.find(".title");
    d.on("click", ".again", function() {
        $("body").css("background","#4799CB"); 
        a.fire("pageChange", 0);
        return true;
    }).on("click", ".notify", function() {
        $("body").css("background","#4799CB"); 
        sessionStorage.removeItem('start');
        a.setPlayMode($(this).index() - 1);
        a.fire("pageChange", 1);
        a.fire("gameStart");
        a.timer=setInterval(function(){a.time+=1},100);
        return true;
    }).on("click", ".publishLink", function() {
         btGame.playShareTip();
         return false;
    });
    var g = [ {
        key: 0,
        title: "青魔"
    }, {
        key: 5,
        title: "西瓜刨"
    }, {
        key: 10,
        title: "公子小丑"
    }, {
        key: 15,
        title: "粉蓝吊"
    }, {
        key: 20,
        title: "金毛巾"
    }, {
        key: 25,
        title: "鸡心吊"
    }, {
        key: 29,
        title: "眼镜仙"
    }, {
        key: 30,
        title: "薄荷仙"
    } ];
    function h(i) {
        var j = g[0].title;
        for (var k = 0, max = g.length; k < max; k++) {
            var l = g[k];
            j = l.title;
            if (i <= l.key) {
                break;
            }
        }
        return j;
    }
    window.c = h;
    a.on("gameEnd", function() {
        clearInterval(a.timer);
        a.fire("pageChange", 2);
        var i = h(a.currentLevel - 1);
        f.html(i);
        e.html("LV" + (a.currentLevel - 1));
        var j = {
            level: a.currentLevel - 1,
            title: i
        };
        a.fire("gameResult", j);
        $("body").css("background","#ffffff");
        var user_id = sessionStorage.getItem('user_id');
        $.ajax({
            type: 'GET',
            url: 'https://api.huanjiaohu.com/api/game/finish',
            data: { 'level': j.level,'title':j.title,'user_id':Number(user_id),'time':a.time },
            dataType: 'json',
            timeout: 5000,
            success: function(data){
            },
            error: function(xhr, type){
              alert(type)
            }
          })
        wx.miniProgram.postMessage({
            data: {
                'param': 'type=game',
                "shareUserId":user_id,
                'title': document.title,
                'imageUrl': 'https://static.huanjiaohu.com/image/share/game.jpg?r='+Math.random()
            }
        });
    });
 
}(a);

~function(a, btGame) {
    a.on("gameResult", function(d, e) {
        var f = "我玩《礁岩荣耀》获得【" + e.title + "】称号，还不测试一下你的称号？";
        if (e.level >= 5) {
            f = "我玩《礁岩荣耀》获得【" + e.title + "】称号，还不测试一下你的称号？";
        }
        var f = btGame.setShare({
            title: f
        });
        // setTimeout(function() {
        //     btGame.playScoreMsg("你认出" + e.level + "个老湿,获得【" + e.title + "】称号，快去刷屏吧！");
        // }, 300);
    });
}(a, btGame);

~function(a, btGame) {
    var d = $("body,html"), e = $("#main");
    function f() {
        var g = a.width, h = window.innerWidth;
        var i = h / g;
        if (i > 1) i = 1;
        var j = "scale(" + i + ")";
        e.css({
            "-webkit-transform": j,
            "-moz-transform": j,
            "-o-transform": j,
            transform: j,
            top: -a.height * (1 - i) / 2,
            left: -g * (1 - i) / 2
        });
        if (i < 1) {
            d.css("height", a.height * i);
        } else {
            d.css("height", "auto");
        }
    }
    btGame.checkHScreen(f, false);
    $(function() {
        setTimeout(f, 1e3);
    });
}(a, btGame);


~function(a) {
    $("body").css("background","#4799CB");
    wx.miniProgram.postMessage({
        data: {
            'param': 'type=game',
            "shareUserId":null,
            'title': '礁岩荣耀',
            'imageUrl': 'https://static.huanjiaohu.com/image/share/game.jpg?r='+Math.random()
        }
    });
}(a);


function overlay(id){
    var e1 = document.getElementById(id);
    e1.style.visibility =  (e1.style.visibility == "visible"  ) ? "hidden" : "visible";
}
