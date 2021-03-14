(function (window) {
    function Lyric(lyric) {
        return new Lyric.prototype.init(lyric);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (lyric) {
            this.lyric = lyric;
        },
        times: [],
        lyrics: [],
        index: -1,
        parseLyric: function () {
            let $this = this;
            this.lyrics = [];
            this.times = [];
            let arr = this.lyric.split("\n");
            // 取出每一条歌词
            //歌词格式  [00:00.000] 作词 : 郭顶
            let timeReg = /\[(\d*:\d*\.\d*)\]/;
            arr.forEach(function (ele, index ) {
                let lrc = ele.split("]");
                if (lrc.length === 1) return true;
                $this.lyrics.push(lrc[1]);

                let result = timeReg.exec(ele);
                if(result === null) return true;
                let timeStr = result[1];
                let result2 = timeStr.split(":");
                let time = parseFloat(((parseInt(result2[0]) * 60) + (parseFloat(result2[1]))).toFixed(2));
                $this.times.push(time);
            })
        },
        currentIndex: function (currentTime) {
            if(currentTime >= this.times[0]-0.2) {
                this.index++;
                //没判断一个就把第一个删除，让每次的判断都是当前播放的进度
                this.times.shift();
            }
            return this.index;
        }
    };
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);