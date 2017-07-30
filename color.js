/**
 * Created by zhang on 2017-07-30.
 */

//TODO keyValue 转换成数组 提供抽奖

const colorMap = {
    "Red": "\x1b[31m",
    "Green": "\x1b[32m",
    "Yellow": "\x1b[33m",
    "Blue": "\x1b[34m",
    "Magenta": "\x1b[35m",
    "Cyan": "\x1b[36m",
    "White": "\x1b[37m"
};

const colors = (()=>{
    let allColors = []
    Object.keys(colorMap).forEach((key)=>{
        allColors.push(colorMap[key])
    })
    return allColors
})()

//随机抛出一个颜色

let pickRandomColor = function (colors) {
    let index =  parseInt(Math.random()*colors.length)
    return colors[index]
}

module.exports = {
    colorLog:function (...str) {
        let color = pickRandomColor(colors)
        console.log(color,...str);
    }
}