
$(() => {

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

    //推荐歌单
    let recSongs = $('.rec_songs');
    $.ajax({
        url: "http://127.0.0.1:3000/personalized?limit=8",
        dataType: "json",
        success: function (data) {
            data.result.forEach(function (ele, index) {
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

    //侧边栏滚动
    $(window).scroll(function() {
        let left_nav = $(".left_nav");
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

    //搜索页面
    let search = $("#search").get(0);

    $(document).keyup(function(event){
        if (search === document.activeElement && event.keyCode === 13) {
            let text = search.value;
        }
    });

});