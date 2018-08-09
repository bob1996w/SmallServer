const readline = require('readline');
const fs = require('fs');
const path = require('path');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const PATH_COMMENT = path.join('data', 'comment.txt');
let task = 1;
console.log('Start listening commands');
if (!fs.existsSync('data')){
    fs.mkdirSync('data');
}
rl.on('line', (line) => {
    if (line === 'f' || line === 'F') {
        fs.writeFileSync(PATH_COMMENT, 'f', { flag: 'a' });
        console.log(`Task${task} [Insert Instruction f]`);
    }
    else if (line === 'n' || line === 'N') {
        fs.writeFileSync(PATH_COMMENT, 'n', { flag: 'a' });
        console.log(`Task${task} [Insert Instruction n]`);
    }
    else if (line === '1' || line === '2' || line === '3' || line === '4' || line === '5' || line === '6' || line === '7') {
        fs.writeFileSync(PATH_COMMENT, line, { flag: 'a' });
        console.log(`Task${task} [Insert Instruction ${line}]`);
    }
    else if (line === 'exit') {
        fs.writeFileSync(PATH_COMMENT, line, { flag: 'a' });
        console.log(`Task${task} [Insert Instruction ${line}]`);
    }
    else {
        console.log(`[Instruction error]`);
    }
    ++task;
});
