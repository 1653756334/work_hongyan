
$(() => {

    let $audio = $(".audio");
    let player = Player($audio);

    //实现图片轮播
    (() => {
        let images = $('.show');
        let mask = $('.mask');
        let imgNav = $('.image_lists');
        let leftBtn = $('.left_btn');
        let rightBtn = $('.right_btn');
        let i = 0;

        //切换图片核心函数
        function foo() {
            let nowSHow = `../images/${i}.jpg`
            images.attr('src', nowSHow);
            //改背景
            mask.css('background-image', `url(${nowSHow})`);
            //改小红点
            imgNav.children().eq(i).addClass('image_choose');
            imgNav.children().eq(i).siblings().removeClass('image_choose');
            clearInterval(interval);
            interval = setInterval(() => {
                rightBtn.click();
            }, 3000);
        }

        images.on("mouseenter", function () {
            clearInterval(interval);
        })

        images.on("mouseleave", function () {
            interval = setInterval(() => {
                rightBtn.click();
            }, 3000);
        })

        let interval = setInterval(() => {
            rightBtn.click();
        }, 2000);

        //点击imgNav
        $('.image_lists li').on('click', function () {
            i = $('.image_lists li').index(this);
            foo();
        })
        //左移
        leftBtn.on('click', function () {
            i > 0 ? i-- : i=7;
            foo();
        })
        //右移
        rightBtn.on('click', function () {
            i < 7 ? i++ : i=0;
            foo();
        })
    })();

    $(".ul_nav-choose").on("click", function () {
        appear(img_show);
        appear(pre_show);
        disappear(sheet_detail);
        disappear(sheet_sq);
        disappear(search_h);
    })
    //推荐歌单
    let recSongs = $('.rec_songs');
    $.ajax({
        url: "http://127.0.0.1:3000/personalized?limit=8",
        dataType: "json",
        success: function (data) {
            data.result.forEach(function (ele) {
                recSongs.append(createRecSongs(ele));
            })
        },
        error: function (e) {
            console.log(e);
        }
    })

    //生成推荐歌单
    function createRecSongs(data) {
        let count = data.playCount > 50000 ? (parseInt(data.playCount/10000)+"万") : data.playCount;
        return $("<li class='sheet' id="+data.id+">\n" +
            "                            <div class=\"song_sheet_cover\">\n" +
            "                                <img src=\""+data.picUrl+"\" alt=\"\">\n" +
            "                                <div class=\"bottom\">\n" +
            "                                    <span class=\"ico_listen\"></span>\n" +
            "                                    <span class=\"visit_num\">"+count+"</span>\n" +
            "                                    <span class=\"play_first\"></span>\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                            <p><a href=\"javascript:void(0)\">"+data.name+"</a></p>\n" +
            "                        </li>")
    }

    // 显示登录页面
    let loginBtn = $(".login");
    let login = $(".login_h");
    loginBtn.on("click", function () {
        login.css("display","block");
    })

    let close_h = $(".top_close");
    close_h.on("click", function () {
        login.css("display","none");
    })

    //侧边栏显示
    let left_nav = $(".left_nav");
    $(document).on("mousemove", function (e) {
        if(e.pageX < 20) {
            left_nav.slideDown(1000);
        }
        if(e.pageX > 220) {
            left_nav.slideUp(1000);
        }
    })

    //侧边栏滚动
    $(window).scroll(function() {
        //为了保证兼容性，这里取两个值，哪个有值取哪一个
        //scrollTop就是触发滚轮事件时滚轮的高度
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if(scrollTop <= 100) {
            let distance = 100 - scrollTop;
            left_nav.css("top",`${distance}px`);
        } else {
            left_nav.css("top",`0px`);
        }
    })

    function disappear(ele) {
        ele.css("display", "none");
    }
    function appear(ele) {
        ele.css("display", "block");
    }

    let img_show = $(".images_show");
    let pre_show = $(".body_info");
    let sheet_sq = $(".song_sheets");
    let sheet_detail = $(".sheet_detail");
    let search = $("#search").get(0);
    let search_list = $(".search_list");
    let resText = $(".s_result");
    let s_text = $(".s_text").get(0);
    let search_h = $(".search_h");
    //顶部搜索
    $(document).keyup(function(event){
        if (search === document.activeElement && event.keyCode === 13) {
            search_core(search.value);
        }
    });
    $(".s_btn").on("click", function () {
        search_core($(".s_text")[0].value);
    })
    $(document).keyup(function(event) {
        if($(".s_text").get(0) === document.activeElement && event.keyCode === 13) {
            $(".s_btn").trigger("click");
        }
    });
    //搜索页面
    let musicPlay = $("span.play");
    let musicNext = $(".next_s");
    let musicPre = $(".pre_s");
    function search_core(value) {
        //生成页面
        disappear(img_show);
        disappear(pre_show);
        disappear(sheet_detail);
        disappear(sheet_sq);
        appear(search_h);
        //加载搜索结果
        s_text.value = value;
        $.ajax({
            url: "http://127.0.0.1:3000/cloudsearch?keywords= "+value+"",
            dataType: "json",
            success:function (data) {
                while (search_list[0].hasChildNodes()) {
                    search_list[0].removeChild(search_list[0].firstChild);
                }
                resText[0].innerHTML= "搜索“"+value+"”，找到 <span>"+data.result.songs.length+"</span> 首单曲";
                player.currentIndex = -1;
                data.result.songs.forEach(function (ele, index) {
                    search_list.append(createSearchResult(ele, index));
                });
                player.music_list = data.result.songs;
            }
        })
    }

    //播放按钮
    musicPlay.on("click", function () {
        if (search_h[0].style.display === "block") {
            if(player.currentIndex === -1) {
                $(".res_detail").eq(0).find(".s_play").trigger("click");
            } else {
                $(".res_detail").eq(player.currentIndex).find(".s_play").trigger("click");
            }
        }
    })

    //下一曲
    musicNext.on("click", function () {
        if (search_h[0].style.display === "block") {
            $(".res_detail").eq(player.index_next()).find(".s_play").trigger("click");
        }
    })
    //上一曲
    musicPre.on("click", function () {
        if (search_h[0].style.display === "block") {
            $(".res_detail").eq(player.index_pre()).find(".s_play").trigger("click");
        }
    })

    //搜索歌曲列表
    function createSearchResult(music, index) {
        // console.log(music)
        if (music.alia[0]) {
            music.name = music.name + ' - ' + music.alia[0];
        }
        let $item = $("<li class=\"res_detail\">\n" +
            "                <div class=\"s_play\"></div>\n" +
            "                <div class=\"s_title\">"+music.name+"</div>\n" +
            "                <div class=\"s_singer\">"+music.ar[0].name+"</div>\n" +
            "                <div class=\"s_album\">《"+music.al.name+"》</div>\n" +
            "                <div class=\"s_time\">05:13</div>\n" +
            "            </li>")
        $item.get(0).index = index;
        $item.get(0).music = music;

        let time_audio = $(".require_time");
        $.ajax({
            url: "http://127.0.0.1:3000/song/url?id="+music.id+"",
            dataType: "json",
            success: function (data) {
                $item.get(0).music.link_url = data.data[0].url;
                time_audio.src = data.data[0].url;
                time_audio.on("loadedmetadata", function () {
                    let dur = time_audio.duration;
                    console.log(dur);
                })
            }
        })
        $.ajax({
            url: "http://127.0.0.1:3000/lyric?id="+music.id+"",
            dataType: "json",
            success: function (data) {
                if(data.lrc === undefined) return
                $item.get(0).music.lyric = data.lrc.lyric;
            },
            error: function (e) {
                console.warn(e);
            }
        })
        return $item;
    }

    // 歌曲播放和按钮同步
    search_list.delegate(".s_play", "click", function () {
        $(this).toggleClass("playing");
        $(this).parents(".res_detail").siblings().find(".s_play").removeClass("playing");
        $(this).parents(".res_detail").find(".s_title").css("color", "red");
        $(this).parents(".res_detail").siblings().find(".s_title").css("color", "#333");
        if($(this).hasClass("playing")){
            musicPlay[0].innerHTML = "";
        } else {
            musicPlay[0].innerHTML = "";
        }

        let item = $(this).parents(".res_detail").get(0);
        player.playMusic(item.index, item.music);

        initMusicInfo(item.music);
        initMusicLyric(item.music);
    })
    function initMusicInfo(music) {
        let musicImg = $(".m_c_lft img");
        let musicName = $(".mu_name");
        let musicSinger = $(".sing_name");

        musicImg.attr("src", music.al.picUrl);
        musicName.text(music.name);
        musicSinger.text(music.ar[0].name);
        $(".signal_title").text(music.name);
        $(".signal_singer a").text(music.ar[0].name);
        $(".signal_album a").text(music.al.name);
        $(".signal_cover").attr("src", music.al.picUrl);
    }

    let lyrics;
    let lyricBox = $(".lyric");
    function initMusicLyric(music) {
        if(music.lyric === undefined) return;
        while (lyricBox[0].hasChildNodes()) {
            lyricBox[0].removeChild(lyricBox[0].firstChild);
        }
        lyrics = Lyric(music.lyric);
        lyrics.parseLyric();
        lyrics.lyrics.forEach(function (ele, index) {
            lyricBox.append($("<li>"+ele+"</li> <br>"));
        })

    }

    let signal = $(".signal_music");
    $(".m_c_lft img").on("click", function () {
        signal.stop()
        signal.toggle(600);
        if(signal[0].style.display === "block") {
            left_nav.css("top", 0);
        }
    })

    //热搜榜功能能实现
    let searchBox = $(".hot_search_box");

    //显示和隐藏热搜榜
    $("#search").focus(function(){
        appear(searchBox);
    })
    $("#search").blur(function () {
        setTimeout(function () {
            disappear(searchBox)
        },100);
    })
    $("#search").bind("input porpertychange", function (e) {
        if(this.value !== "") {
            disappear(searchBox);
        } else {
            appear(searchBox);
        }
    })

    //获取热搜
    $.ajax({
        url: "http://127.0.0.1:3000/search/hot",
        dataType: "json",
        success: function (data) {
            data.result.hots.forEach(function (ele, index) {
                searchBox.append($("<li><span>"+(index+1)+"</span>  "+ele.first+"</li>"))
            })
        },
        error: function (e) {
            console.warn(e);
        }
    })

    //点击热搜搜索
    searchBox.delegate("li", "click", function () {
        let val = this.innerText
        let value = val.replace(/^\w\s/, "");
        search_core(value);
    })
});