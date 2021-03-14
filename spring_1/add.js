const save = (timer, fn) => {
    let nums = [];
    return function (num) {
        if(--timer === 0) {
            return fn(nums)
        }
        else nums.push(num)
    }
}

let add = save(3, (arg) => arg.reduce((a, b)=> a + b))
add(100);
add(200);
console.log(add()); // 300
