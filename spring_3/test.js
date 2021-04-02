
let my_ajax = require("osx-ajax")

let a;
/*a = new my_ajax({
    url: "http://musicapi.leanapp.cn/personalized"
});*/
a = new my_ajax({
    url: "http://musicapi.leanapp.cn/top/playlist",
    params: {
        "limit": "35",
        "order": "hot"
    }
})

a.get().then(value => console.log(value))