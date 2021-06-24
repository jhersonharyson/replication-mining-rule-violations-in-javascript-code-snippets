const fs = require('fs')


const file = fs.readFileSync("my-new.json")
const lines = file.toString().trim().split("\n")
const file_dir = 'javascript_code'

console.log("Total lines in json file: "+lines.length)

lines.forEach((line, i) => {
    const object = JSON.parse(line)
    const filename = `${object["PostId"]}.js`;
    const content = object["Content"]
    fs.writeFileSync(`${file_dir}/${i}__${filename || ('___'+i)}`, content)
});

fs.readdir("javascript_code", (error, files) => {
    if(error) throw error
    console.log("Total files in disk: "+ files.length)
})

