
let my_ajax = require("osx-ajax")

/*let a = new my_ajax({
    url: "http://musicapi.leanapp.cn/personalized"
});*/

let a = new my_ajax({
    url: "http://musicapi.leanapp.cn/top/playlist",
    params: {
        "limit": "35",
        "order": "hot"
    }
})

a.get().then(value => console.log(value))
