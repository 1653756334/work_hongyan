import "./index.css"

const ball1 = document.querySelector('.ball1')
const ball2 = document.querySelector('.ball2')
const ball3 = document.querySelector('.ball3')
// callback 用法
/*function move(ball, target, cb) {
    let len = 0
    let timer = setInterval(()=>{
        if (len >= target) {
            clearInterval(timer)
            if (!cb()) return
        }
        len += 1
        ball.style.marginLeft = `${len}px`
    }, 1000/60)
}
move(ball1, 200, function () {
    move(ball2, 200, function () {
        move(ball3, 200)
    })
})*/

// Promise 用法的 demo
function move(ball, target) {
    return new Promise((resolve, reject) => {
        let len = 0
        let timer = setInterval(()=>{
            if (len >= target) {
                clearInterval(timer)
                resolve(move)
                reject("失败")
            }
            len += 2
            ball.style.marginLeft = `${len}px`
        }, 1000/60)

    })
}
// move(ball1, 200).then(value => value(ball2, 200)).then(value => value(ball3, 200))

// async/await 用法的 demo
async function go() {
    await move(ball1, 200)
    await move(ball2, 200)
    await move(ball3, 200)
}

go()