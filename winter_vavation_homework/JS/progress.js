(function (window) {
    function Progress(music_progress, music_line) {
        return new Progress.prototype.init(music_progress, music_line);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function (music_progress, music_line) {
            this.music_progress = music_progress;
            this.music_line = music_line;
        },
        isMove: false,
        progressClick: function (callBack) {
            let $this  = this;
            //监听背景点击
            this.music_progress.on("click", function (e) {
                //获取背景距离窗口位置
                let initial = $(this).offset().left;
                //获取点击距离窗口位置
                let clickDist = e.pageX;
                //设置进度条进度
                $this.music_line.css("width", clickDist-initial);
                //计算进度条比列
                let value = (clickDist - initial) / $(this).width();
                callBack(value);
            })
        },
        progressMove: function (callBack) {
            let $this = this;
            let clickDist;
            let initial;
            //按下
            this.music_progress.on("mousedown", function () {
                $this.isMove = true;
                //获取背景距离窗口位置
                initial = $(this).offset().left;
                //移动
                $(document).on("mousemove", function (e) {
                    //获取点击距离窗口位置
                    clickDist = e.pageX;
                    //设置进度条进度
                    if(clickDist-initial <= $this.music_progress.width() && clickDist-initial >= 0) {
                        $this.music_line.css("width", clickDist-initial);
                    } else if (clickDist-initial < 0){
                        $this.music_line.css("width", 0);
                    } else {
                        $this.music_line.css("width", $this.music_progress.width());
                    }
                    //计算进度条比列
                    let value = (clickDist - initial) / $this.music_progress.width();
                    callBack(value);
                })
                //抬起
                $(document).on("mouseup", function () {
                    $(document).off("mousemove");
                    $this.isMove = false;
                })
            })
        },
        setProgress:function (value) {
            if (this.isMove) return;
            if(value < 0 && value > 1)  return;
            this.music_line.css("width", value+"%");
        }
    };
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);