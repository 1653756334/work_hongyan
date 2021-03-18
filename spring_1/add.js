let add = (a, b) => {
    return a + b;
}

let save = (fn) => {
    let arr = [];
    return function replay() {
        let arg = Array.prototype.slice.apply(arguments);
        arr = arr.concat(arg)

        if(arg.length === 0) return arr.reduce(fn)

        else return replay
    }
}

add = save(add)

add(100)
add(200)
console.log(add()) // 300