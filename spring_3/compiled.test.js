(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function ajax_osx(options={}) {
    return new ajax_osx.prototype.init(options);
}
ajax_osx.prototype = {
    constructor: ajax_osx,
    init: function (options) {
        // this.method = options.method;
        this.url = options.url;
        this.data = options.data;
        this.params = options.params;
    },
    get: function () {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            if (this.params) {
                this.url += '?'
                for (let key in this.params) {
                    this.url += key + '=' + this.params[key] + '&'
                }
            }
            xhr.open('get', this.url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        const res = JSON.parse(xhr.responseText);
                        // console.log(res);
                        resolve(res)
                    } else {
                        reject(xhr.responseText)
                    }
                }
            };
            xhr.send()
        })
    },
    post: function () {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('post', this.url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        const res = JSON.parse(xhr.responseText);
                        // console.log(res);
                        resolve(res)
                    } else {
                        reject(xhr.responseText)
                    }
                }
            };
            xhr.send(this.data)
        })
    }
}


ajax_osx.prototype.init.prototype = ajax_osx.prototype;

module.exports = ajax_osx
},{}],2:[function(require,module,exports){

let my_ajax = require("osx-ajax")

let a;
/*a = new my_ajax({
    url: "http://musicapi.leanapp.cn/personalized"
});*/
a = new my_ajax({
    url: "http://127.0.0.1:3000/top/playlist",
    params: {
        "limit": "35",
        "order": "hot"
    }
})

a.get().then(value => console.log(value))
},{"osx-ajax":1}]},{},[2]);
