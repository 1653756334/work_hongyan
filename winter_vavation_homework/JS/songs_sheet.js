$(function () {

    let img_show = $(".images_show");
    let pre_show = $(".body_info");
    let sheet_sq = $(".song_sheets");
    let song_s_change = $(".s_s_change");
    let sheets = $(".sheets_info");
    let sheet_detail = $(".sheet_detail");

    let $audio = $("audio");
    let player = new Player($audio);

    let music_progress = $(".play_bar");
    let music_line = $(".play_line");

    let progress = Progress(music_progress, music_line);
    progress.progressClick(function (value) {
        player.musicTo(value)
    });
    progress.progressMove(function (value) {
        player.musicTo(value);
    });

    let voice_progress = $(".voice_bar");
    let voice_line = $(".voice_line");
    let v_progress = Progress(voice_progress, voice_line);
    v_progress.progressClick(function (value) {
        if(value <= 1 && value >= 0){
            player.voiceTo(value);
        }

    });
    v_progress.progressMove(function (value) {
        if(value <= 1 && value >= 0){
            player.voiceTo(value);
        }
    })
    //初始化歌词信息
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

    //初始化歌词信息
    let lyricBox = $(".lyric");
    let lyrics;
    function initMusicLyric(music) {
        if (music.lyric === undefined) return;
        lyrics = Lyric(music.lyric);
        lyrics.parseLyric();
        while (lyricBox[0].hasChildNodes()) {
            lyricBox[0].removeChild(lyricBox[0].firstChild);
        }
        lyrics.lyrics.forEach(function (ele, index) {
            let item = $("<li>"+ele+"</li> <br>");
            lyricBox.append(item);
        })

    }

    
    song_s_change.on("click", function () {
        disappear(img_show);
        disappear($(".search_h"));
        disappear(pre_show);
        disappear(sheet_detail);
        appear(sheet_sq);
        $.ajax({
            url: "http://127.0.0.1:3000/top/playlist?limit=35&order=hot",
            dataType: "json",
            success: function (data) {
                while (sheets[0].hasChildNodes()) {
                    sheets[0].removeChild(sheets[0].firstChild);
                }
                data.playlists.forEach(function (ele) {
                    sheets.append(createRecSongs(ele));
                })
            },
            error: function (e) {
                console.log(e);
            }
        })
    })

    $(".ul_nav li").on("click", function () {
        $(this).addClass("ul_nav-choose");
        $(this).siblings().removeClass("ul_nav-choose");
    })

    function disappear(ele) {
        ele.css("display", "none");
    }
    function appear(ele) {
        ele.css("display", "block");
    }

    function createRecSongs(data) {
        let count = data.playCount > 50000 ? (parseInt(data.playCount/10000)+"万") : data.playCount;
        return $("<li class='sheet' id="+data.id+">\n" +
            "            <div class=\"song_sheet_cover\">\n" +
            "                <img src=\""+data.coverImgUrl+"\" alt=\"\">\n" +
            "                <div class=\"bottom\">\n" +
            "                    <span class=\"ico_listen\"></span>\n" +
            "                    <span class=\"visit_num\">"+count+"</span>\n" +
            "                    <span class=\"play_first\"></span>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <p><a href=\"javascript:void(0)\">"+data.name+"</a></p>\n" +
            "        </li>")
    }

    sheets.delegate("li","click", function () {
        show_sheet($(this)[0].id);
    })
    $('.rec_songs').delegate("li","click", function () {
        show_sheet($(this)[0].id);
    })
    $(".my_songs_sheet").delegate("li","click",function () {
        show_sheet($(this)[0].id);
    })

    function show_sheet(id) {
        disappear(img_show);
        disappear(pre_show);
        disappear(sheet_sq);
        disappear($(".search_h"));
        appear(sheet_detail);
        $.ajax({
            url: "http://127.0.0.1:3000/playlist/detail?id="+id+"",
            dataType: "json",
            success: function (data) {
                while (sheet_detail[0].hasChildNodes()) {
                    sheet_detail[0].removeChild(sheet_detail[0].firstChild);
                }
                sheet_detail.append(createDetail(data));
                player.currentIndex = -1;

                let t_s_songs = $(".t_s_songs");
                let hot_comment = $(".comment");
                let song_list = data.playlist.tracks

                if(data.playlist.tracks.length > 10) {
                    song_list = song_list.slice(0,10);
                }
                player.music_list = song_list;
                song_list.forEach((ele, index)=>{
                    t_s_songs.append(createMusicList(ele,index));
                })
                //评论
                $.ajax({
                    url: "http://127.0.0.1:3000/comment/playlist?id="+id+"",
                    dataType: "json",
                    success: function (data) {
                        if(data.hotComments) {
                            data.hotComments.forEach((com)=> {
                                hot_comment.append(createHotComment(com));
                            })
                        }
                        data.comments.forEach((com)=> {
                            hot_comment.append(createHotComment(com));
                        });
                    },
                    error: function (e) {
                        console.warn(e);
                    }
                });

                //歌曲时长
                for(let i = 0; i < song_list.length; i++) {
                    $.ajax({
                        url: "http://127.0.0.1:3000/song/url?id="+song_list[i].id,
                        dataType: "json",
                        success: function (data) {
                            let musicTimes = $(".music_time");
                            let t_audios = $(".require_time");
                            t_audios[i].src = data.data[0].url;
                            t_audios[i].addEventListener("canplay", function () {
                                let time = parseInt(t_audios[i].duration);
                                let minute = parseInt((time / 60)) > 10 ? parseInt((time / 60)) : "0"+parseInt((time / 60));
                                let second = parseInt((time % 60)) > 10 ? parseInt((time % 60)) : "0"+parseInt((time % 60));
                                musicTimes[i].innerHTML = minute +":"+ second;
                            })
                        },
                        error: function (e) {
                            console.warn(e)
                        }
                    })
                }

            },
            error: function (e) {
                console.warn(e);
            }
        })
    }

    //渲染歌单页面
    function createDetail(data) {
        let createTime = new Date(data.playlist.createTime);
        let format_time = createTime.getFullYear()  +"-"+ (createTime.getMonth()+1) +"-"+ createTime.getDate();

        if(data.playlist.description) {
            var desc = data.playlist.description.replace(/\s/g,"<br>");
        } else {
            desc = '';
        }

        return $("<div class=\"description_sheet\">\n" +
            "        <div class=\"t_l_sheet\">\n" +
            "            <img src=\""+data.playlist.coverImgUrl+"\" alt=\"\" class=\"sheet_cover\">\n" +
            "            <span class=\"cover_mask\"></span>\n" +
            "        </div>\n" +
            "        <div class=\"t_r_sheet\">\n" +
            "            <div class=\"title_box\">\n" +
            "                <span class=\"s_tag\"></span>\n" +
            "                <span class=\"sheet_title\">"+data.playlist.name+"</span>\n" +
            "            </div>\n" +
            "            <div class=\"create_d\">\n" +
            "                <img src=\""+data.playlist.creator.avatarUrl+"\" alt=\"\">\n" +
            "                <a href=\"javascript:void(0)\" class=\"cre_name\">"+data.playlist.creator.nickname+"</a>\n" +
            "                <span class=\"cre_time\">"+format_time+" 创建</span>\n" +
            "            </div>\n" +
            "            <p class=\"s_desc\">介绍："+desc+"</p>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "    <div class=\"songs_list\">\n" +
            "        <div class=\"s_l_top\">\n" +
            "            <h2>歌曲列表</h2>\n" +
            "            <span class=\"s_count\">"+data.playlist.trackCount+"首歌</span>\n" +
            "            <span class=\"h_num\">播放：<strong>"+data.playlist.playCount+"</strong>次</span>\n" +
            "        </div>\n" +
            "        <div class=\"songs_box\">\n" +
            "            <div class=\"s_b_top\">\n" +
            "                <span>&nbsp;</span>\n" +
            "                <span>歌曲标题</span>\n" +
            "                <span>时长</span>\n" +
            "                <span>歌手</span>\n" +
            "                <span>专辑</span>\n" +
            "            </div>\n" +
            "            <ul class=\"t_s_songs\">\n" +
            "            </ul>\n" +
            "            <div class=\"more_download\">\n" +
            "                <p>查看更多内容，请下载客户端</p>\n" +
            "                <div><a href=\"https://music.163.com/#/download\">立即下载</a></div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "    <div class=\"sheet_comments\">\n" +
            "        <div class=\"com_top\">\n" +
            "            <h2>评论</h2>\n" +
            "        </div>\n" +
            "        <div class=\"write_com\">\n" +
            "            <div class=\"head\">\n" +
            "                <img src=\"http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=50y50\" alt=\"\">\n" +
            "            </div>\n" +
            "            <div class=\"right_part\">\n" +
            "                <textarea name=\"\" id=\"\" cols=\"30\" rows=\"3\" class=\"w_text\" placeholder=\"评论\"></textarea>\n" +
            "                <div class=\"i_at_publish\">\n" +
            "                    <span class=\"faces\"></span>\n" +
            "                    <span class=\"at_sb\"></span>\n" +
            "                    <div class=\"pub_com\">评论</div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"hot_comments\">\n" +
            "            <div class=\"h_c_top\">精彩评论</div>\n" +
            "            <ul class=\"comment\">\n" +
            "            </ul>\n" +
            "        </div>\n" +
            "    </div>");
    }
    // 渲染歌单歌曲
    function createMusicList(ele,index) {
        let $item = $(" <li class=\"list_music\">\n" +
            "                    <div class=\"list_1\">\n" +
            "                        <span class=\"s_sort\">"+(index+1)+"</span>\n" +
        "                        <a href=\"javascript:void(0)\" class=\"l_play\"></a>\n" +
        "                    </div>\n" +
        "                    <div class=\"list_2\">\n" +
        "                        <a href=\"javascript:void(0)\" class=\"music_title\">"+ele.name+"</a>\n" +
        "                    </div>\n" +
        "                    <div class=\"list_3\">\n" +
        "                        <span class=\"music_time\">05:02</span>\n" +
        "                    </div>\n" +
        "                    <div class=\"list_4\">\n" +
        "                        <span class=\"m_singer\">"+ele.ar[0].name+"</span>\n" +
        "                    </div>\n" +
        "                    <div class=\"list_5\">\n" +
        "                        <div class=\"m_album\">"+ele.al.name+"</div>\n" +
        "                    </div>\n" +
        "                </li>\n")
        $item.get(0).index = index;
        $item.get(0).music = ele;

        //获取歌曲链接
        let time_audio = $(".require_time");
        $.ajax({
            url: "http://127.0.0.1:3000/song/url?id="+ele.id+"",
            dataType: "json",
            success: function (data) {
                $item.get(0).music.link_url = data.data[0].url;
            },
            error: function (e) {
                console.warn(e);
            }
        })

        //获取歌曲歌词
        $.ajax({
            url: "http://127.0.0.1:3000/lyric?id="+ele.id+"",
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
    //渲染歌曲评论
    function createHotComment(data) {
        let time = new Date(data.time);
        let pub_time = time.getFullYear() + "年" + (time.getMonth()+1) + "月" + time.getDate();
        return $("<li>\n" +
            "                    <img src=\""+data.user.avatarUrl+"\" alt=\"\">\n" +
            "                    <div class=\"com_det\">\n" +
            "                        <div class=\"com_box\">\n" +
            "                            <a class=\"u_name\" href=\"javascript:void(0)\">"+data.user.nickname+"</a>\n" +
            "                            "+data.content+"\n" +
            "                        </div>\n" +
            "                        <div class=\"pub_date\">"+pub_time+"</div>\n" +
            "                    </div>\n" +
            "                </li>\n");
    }

    //添加子菜单播放按钮的监听
    let musicPlay = $("span.play");
    sheet_detail.delegate(".l_play","click" ,function () {

        //添加正在播放类，可以靠这个判断是否在播放
        $(this).toggleClass("playing");
        $(this).parents(".list_music").siblings().find(".l_play").removeClass("playing");
        //为正在播放添加标记
        $(this).parents(".list_music").find(".music_title").css("color","red");
        $(this).parents(".list_music").siblings().find(".music_title").css("color", "#666");
        //同步底部播放按钮
        if($(this).hasClass("playing")){
            musicPlay[0].innerHTML = "";
        } else {
            musicPlay[0].innerHTML = "";
        }


        let $item = $(this).parents(".list_music").get(0);
        //播放音乐
        player.playMusic($item.index, $item.music);

        //切换歌曲信息
        initMusicInfo($item.music);
        initMusicLyric($item.music);
    })

    //底部控制区域
    let musicPre = $(".pre_s");
    let musicNext = $(".next_s");


        //播放
        musicPlay.on("click", function () {
            $(".signal_cover").toggleClass("an");
            if($(".search_h")[0].style.display === "none") {
                if (player.currentIndex === -1) {  //判断有没有播放
                    $(".list_music").eq(0).find(".l_play").trigger("click");
                    //rigger("click") 主动触发点击事件
                } else {
                    $(".list_music").eq(player.currentIndex).find(".l_play").trigger("click");
                }
            }
        })
        //上一首
        musicPre.on("click", function () {
            if($(".search_h")[0].style.display === "none") {
                $(".list_music").eq(player.index_pre()).find(".l_play").trigger("click");
            }
        })
        //下一首
        musicNext.on("click", function () {
            if($(".search_h")[0].style.display === "none") {
                $(".list_music").eq(player.index_next()).find(".l_play").trigger("click");
            }
        })

    //监听播放进度
    player.$audio.on("timeupdate", function () {
        //同步时间
        changeTime();
        //同步进度条
        let value = (player.getMusicCurrentTime() / player.getMusicDuration()) * 100;
        progress.setProgress(value);

        //歌词同步
        if($(".search_h")[0].style.display === "none") {
            if(!lyrics) return;
            let l_index = lyrics.currentIndex(player.getMusicCurrentTime());
            let cur_lyric = $(".lyric li").eq(l_index);
            cur_lyric.css("color", "red")
            cur_lyric.siblings().css("color", "#333");
        }
    });
    //改变底部时间的函数
    function changeTime() {
        let musicTime = $(".total_t");
        let currentTime = $(".current_t");

        if (isNaN(player.getMusicDuration())) return;

        let minute = (player.getMusicDuration() / 60) > 10 ? parseInt(player.getMusicDuration()/60) : "0" + parseInt(player.getMusicDuration() / 60);
        let seconds = (player.getMusicDuration() % 60) > 10 ? parseInt(player.getMusicDuration() % 60) : "0" + parseInt(player.getMusicDuration() % 60);
        musicTime.text(minute +":"+ seconds);

        let c_minute = (player.getMusicCurrentTime() / 60) > 10 ? parseInt(player.getMusicCurrentTime()/60) : "0" + parseInt(player.getMusicCurrentTime() / 60);
        let c_seconds = (player.getMusicCurrentTime() % 60) > 10 ? parseInt(player.getMusicCurrentTime() % 60) : "0" + parseInt(player.getMusicCurrentTime() % 60);
        currentTime.text(c_minute +":"+ c_seconds);
    }

    //监听声音按钮的点击
    let sounds = true;
    $(".voice_control span").on("click", function () {
        // 声音图标
        if (sounds) {
            $(this).text("");
            // 变为没有声音
            player.voiceTo(0)
            sounds = false;
        } else {
            $(this).text("");
            // 变为有声音
            player.voiceTo(1);
            sounds = true;
        }
    })
});