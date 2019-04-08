var faker = require('faker/locale/en_US');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function successData(datas) {
    return Object.assign({ result: true, message: 'get datas success' }, { datas })
}

function errorData(message) {
    return { result: false, message };
}

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, ng-params-one, ng-params-two, ng-params-three');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    req.method == 'OPTIONS' ? res.send(200) : next();
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/avatar', function (req, res) {
    const base64 = fs.readFileSync('assets/avatar.jpg', 'base64');
    res.send('data:image/jpg;base64,' + base64);
});
app.get('/qrcode', function (req, res) {
    const base64 = fs.readFileSync('assets/qrcode.png', 'base64');
    res.send('data:image/png;base64,' + base64);
});

app.post('/login', function (req, res) {
    const user = req.body;
    const datas = (user.account === user.password && user.password === 'admin')
        ? successData({
            id: 1,
            token: 'TVQ4bExUTitwWkVpeEJPYUtSdTBBZWNXZ1c4SWJIN0RmbjEvN0p6SEdLY2pWMHdFNy9nZzR2dktSR0w3K0RXUEZENzNnWmJVUkRyZWN3bElmNUpPYjVaSlprSWVnbyt1YnhvWGdrbnExb0dxVk5NWDlPUU0vTjg0c1JLRU1sNmdEVGE1VElxbzhJY0lCYkJDMmc4d2xQOEIveWNNelBxWXNVRUx5ektZSmVWcHlvbUZ5VDZmZmhkUGNocFdOaFl3OFNDWnBlY25qaldSSC82SlVZMCtDcW9NRmNjWmU4QXFXT290ZS92U1VETlNPNUZIM1psejRqRjJmSTlYVEhMTC0tNDdGN3RhVFRidmFCNmFSMTQ1cU90dz09--04205c5c134e06796a432f99a37e16d3476477f3',
            platform: 'app'
        })
        : errorData('账号或密码错误');
    res.send(datas);
});

app.get('/info', function (req, res) {
    res.send(successData({
        id: 1,
        account: 'admin',
        role: {
            id: 1,
            roleName: '超级会员'
        },
        nickName: '梦想的乡',
        avatar: 'https://hello1024.oss-cn-beijing.aliyuncs.com/upload/goods/201808310421101174382331f7a611f0fcec856c2120ab5b88c236f3fa19.63574178.jpg'
    }));
});

app.get('/list', function (req, res) {
    const limit = Number(req.query.limit || 10);
    const offset = Number(req.query.offset || 0);
    const total = 100;
    const datas = {
        total: total,
        rows: []
    };
    if (offset + limit <= total) {
        for (let i = 0; i < limit; i++) {
            datas.rows.push({
                image: `https://picsum.photos/200/300?image=${10 + offset + i}`,
                name: faker.name.findName(),
                address: faker.address.streetAddress()
            });
        }
    }
    setTimeout(() => res.send(successData(datas)), 300);
});

app.listen(8080);