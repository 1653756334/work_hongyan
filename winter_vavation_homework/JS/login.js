$(function () {
    let login_mask = $(".login_mask");
    let content1 = $('.login_content1');
    let other_way_btn = $('.other_ways');
    let other_way_show = $('.login_content2');
    let check_choose = $('.check');
    let back_qr = $(".qr_code");
    let check = $("#agree")
    other_way_btn.on('click', () => {
        content1.css({
            display: 'none'
        });
        other_way_btn.css({
            display: 'none'
        });
        other_way_show.css('display', 'block');
        check_choose.css('display', 'block');
    })
    back_qr.on('click', () => {
        if (check[0].checked == true) {
            other_way_show.css('display', 'none');
            check_choose.css('display', 'none');
            content1.css({
                display: 'block'
            });
            other_way_btn.css({
                display: 'block'
            });
        } else {
            alert("请先勾选同意条款");
        }
    })

    {
        let icons = $('.ways i');
        icons[0].style.backgroundPosition = "-150px -670px";
        icons[1].style.backgroundPosition = "-190px -670px";
        icons[2].style.backgroundPosition = "-230px -670px";
        icons[3].style.backgroundPosition = "-270px -670px";
    }

    let phone_login = $(".phoneNum");
    let phone_h = $(".phoneIn");
    phone_login.on("click", () => {
        if (check[0].checked == true) {
            login_mask.css("display", "none");
            phone_h.css("display", "block");
        } else {
            alert("请先勾选同意条款");
        }
    })

    let back = $(".others");
    back.on("click", function () {
        login_mask.css("display", "block");
        phone_h.css("display", "none");
    })

    let loginBtn = $(".login_button");
    let login_text = $(".login a");
    let login_img = $(".login img");
    let login_img2 = $(".after_login img")[0];
    let login_h = $(".login_h");
    let pre_login = $(".pre_login");
    let after_login = $(".after_login");
    let nick_name = $(".nick_name")[0];
    loginBtn.on("click", function () {
        let phone_num = $(".number").val();
        let phone_password = $(".password").val();
        $.ajax({
            url: "http://127.0.0.1:3000/login/cellphone?phone="+phone_num+"&password="+phone_password+"",
            dataType: "json",
            success: function (data) {
                login_text.css("display", "none");
                login_img[0].src = data.profile.avatarUrl;
                login_img2.src = data.profile.avatarUrl;
                nick_name.innerText = data.profile.nickname;
                loginChange();
                getUserSheet(data.account.id);
            },
            error: function (e) {
                console.log(e);
            }
        })
    })
    function loginChange() {
        login_img.css("display","block");
        login_h.css("display", "none");
        pre_login.css("display", "none");
        after_login.css("display","block");
    }

    function getUserSheet(id) {
        let my_sheets = $(".my_songs_sheet");
        $.ajax({
            url: "http://127.0.0.1:3000/user/playlist?uid="+id+"",
            dataType: "json",
            success: function (data) {
                data.playlist.forEach((content)=>{
                    my_sheets.append("<li id=\""+content.id+"\"> "+content.name+"</li>");
                })
            }
        })
    }
});