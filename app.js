const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT_NUM = 1080;
const USER_NUM = process.argv[2]; // first argument: $node app.js <user_num>
const QUERY_UPDATE = 'Update';
const QUERY_RECEIVE_NOD_DATA = 'ReceiveNodData';
const QUERY_RECEIVE_NOD_DATA_COMPLETED = 'NodDataCompleted';
const QUERY_TASK_END = 'TaskEnd';
const PATH_DATA = path.join('data');
const PATH_COMMENT = path.join('data', 'comment.txt');
const PATH_USER_NOD = path.join('data', 'user' + USER_NUM + '.csv');
const PATH_USER_LOG = path.join('data', 'user' + USER_NUM + '_log.csv');
let str_history = '';


var getClientIp = function(req) {
    return (req.headers['X-Forwarded-For'] ||
            req.headers['x-forwarded-for'] ||
            '').split(',')[0] ||
           req.client.remoteAddress;
};
const app = http.createServer((req, res) => {
    console.log(Date(), getClientIp(req));
    let queryData = url.parse(req.url, true).query;
    if (queryData.q === QUERY_UPDATE) {
        console.log('Recieved update');
        commentData = fs.readFileSync(PATH_COMMENT, 'utf8');
        if (commentData !== str_history) {
            let diff = '';
            if (str_history === '') {
                diff = commentData;
            }
            else {
                diff = commentData.substr(str_history.length - 1);
            }
            res.write(diff);
            console.log(diff);
            str_history = commentData;
        }
    }
    else if (queryData.q === QUERY_RECEIVE_NOD_DATA) {
        console.log('Recieved Nod Data: ' + queryData.data);
        fs.writeFileSync(PATH_USER_NOD, queryData.data + '\n', { flag: 'a' });
        console.log('Written to file.');
        res.write('NodDataRecieved');
    }
    else if (queryData.q === QUERY_TASK_END) { 
        console.log('Recieved Exit');
        res.write('exit');
    }
    else {
        console.log('Unknown query: ' + queryData.q);
    }
    res.write('');
    res.end();
    console.log('');
})

function onServerStart() {
    if (USER_NUM === undefined) {
        console.log('Usage: node app.js <USER_NUM>');
        console.log('USER_NUM undefined. Exit server.');
        process.exit(1);
    }
    console.log('Start server.');
    if (!fs.existsSync(PATH_DATA)){
        fs.mkdirSync(PATH_DATA);
    }
    fs.writeFileSync(PATH_COMMENT, '', { flag: 'a'} );
    console.log('Created ' + PATH_COMMENT);
    fs.writeFileSync(PATH_USER_LOG, '', { flag: 'a'} );
    console.log('Created ' + PATH_USER_LOG);
    fs.writeFileSync(PATH_USER_NOD, '', { flag: 'a'} );
    console.log('Created ' + PATH_USER_NOD);
    console.log('Now listening with USER_NUM=' + USER_NUM + '...')
}
app.listen(PORT_NUM, onServerStart);