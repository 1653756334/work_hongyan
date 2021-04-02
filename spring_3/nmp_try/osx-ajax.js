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