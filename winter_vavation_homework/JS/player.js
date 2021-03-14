(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        music_list: [],
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            //判断是否是同一首音乐
            if(this.currentIndex === index) {
                //同一首音乐
                if(this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                this.audio.src = music.link_url;
                this.audio.play();
                this.currentIndex = index;
            }
        },
        index_pre: function () {
            let index = this.currentIndex - 1;
            if(index < 0) {
                index = this.music_list.length -1;
            }
            return index;
        },
        index_next: function () {
            let index = this.currentIndex + 1;
            if(index > this.music_list.length - 1) {
                index = 0;
            }
            return index;
        },
        getMusicDuration: function () {
            return this.audio.duration;
        },
        getMusicCurrentTime: function () {
            return this.audio.currentTime;
        },
        musicTo: function (value) {
            if (isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        voiceTo: function (value) {
            if (isNaN(value)) return;
            //volue 取值（0 - 1）
            this.audio.volume = value;
        }
    };
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);