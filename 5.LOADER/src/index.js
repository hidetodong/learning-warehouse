let logo = require('./march.png')

console.log(logo)


let img = new Image()
img.src = logo.default
document.body.appendChild(img)