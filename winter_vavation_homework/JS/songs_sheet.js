$(function () {

    let img_show = $(".images_show");
    let pre_show = $(".body_info");
    let sheet_sq = $(".song_sheets");
    let song_s_change = $(".s_s_change");
    let sheets = $(".sheets_info");
    let sheet_detail = $(".sheet_detail");
    song_s_change.on("click", function () {
        disappear(img_show);
        disappear(pre_show);
        show(sheet_sq);
        $.ajax({
            url: "http://127.0.0.1:3000/top/playlist?limit=35&order=hot",
            dataType: "json",
            success: function (data) {
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
    function show(ele) {
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
    function show_sheet(id) {
        disappear(img_show);
        disappear(pre_show);
        disappear(sheet_sq);
        show(sheet_detail);
        $.ajax({
            url: "http://127.0.0.1:3000/playlist/detail?id="+id+"",
            dataType: "json",
            success: function (data) {
                console.log(data);
                sheet_detail.append(createDetail(data));
            },
            error: function (e) {
                console.warn(e);
            }
        })
    }

    function createDetail(data) {
        let createTime = new Date(data.playlist.createTime);
        let format_time = createTime.getFullYear()  +"-"+ createTime.getMonth() +"-"+ createTime.getDate();

        let desc = data.playlist.description.replace(/\s/g,"<br>");
        console.log(desc);
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
            "                <li>\n" +
            "                    <div class=\"list_1\">\n" +
            "                        <span class=\"s_sort\">1</span>\n" +
            "                        <a href=\"javascript:void(0)\" class=\"l_play\"></a>\n" +
            "                    </div>\n" +
            "                    <div class=\"list_2\">\n" +
            "                        <a href=\"javascript:void(0)\" class=\"music_title\">大名鼎鼎</a>\n" +
            "                    </div>\n" +
            "                    <div class=\"list_3\">\n" +
            "                        <span class=\"music_time\">05:02</span>\n" +
            "                    </div>\n" +
            "                    <div class=\"list_4\">\n" +
            "                        <span class=\"m_singer\">大大大</span>\n" +
            "                    </div>\n" +
            "                    <div class=\"list_5\">\n" +
            "                        <div class=\"m_album\">我的专辑</div>\n" +
            "                    </div>\n" +
            "                </li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
            "                <li></li>\n" +
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
            "            <div class=\"c_num\">共有33条评论</div>\n" +
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
            "                <li>\n" +
            "                    <img src=\"\" alt=\"\">\n" +
            "                    <div class=\"com_det\">\n" +
            "                        <div class=\"com_box\">\n" +
            "                            <a class=\"u_name\" href=\"javascript:void(0)\">7or0</a>\n" +
            "                            ：我收藏歌单的步骤：1封面好看 2歌单名字吸引我 3歌曲不是那种经常听到且没有意义的歌 达成这三点基本就可以躺我收藏夹里吃灰（不是）是收藏起来慢慢听了\n" +
            "                        </div>\n" +
            "                        <div class=\"pub_date\">2020年8月1日</div>\n" +
            "                    </div>\n" +
            "                </li>\n" +
            "                <li></li>\n" +
            "            </ul>\n" +
            "        </div>\n" +
            "    </div>");
    }

});