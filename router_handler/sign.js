const userModule = require('../module/userModule')
const userIdModule = require('../module/userIdModule')
const jwt = require('jsonwebtoken')
const secretKey = 'dev By HJX'
exports.reg = (req, res) => {
    const userReg = /^[a-zA-Z0-9]{6,12}$/
    const pwsReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/
    const userInfo = req.body
    if (!userInfo.username || !userInfo.password || !userInfo.checkpassword) {
        return res.back(101, '用户名密码不能为空')
    }
    else {
        if (!userReg.test(userInfo.username)) {
            return res.back(104, '用户名不能包含中文和特殊字符，且长度需在6到12位!')
        }
        else if (!pwsReg.test(userInfo.password)) {
            return res.back(105, '密码需要字母和数字组成!')
        }
        else if (userInfo.checkpassword !== userInfo.password) {
            return res.back(106, '两次输入的密码不一致')
        }
        else {
            userModule.find({ 'username': userInfo.username }, { 'username': 1, '_id': 0 }, (err, doc) => {
                if (doc.length == 0) {
                    function UserCreate() {
                        userIdModule.findOneAndUpdate({ name: 'user' }, { $inc: { id: 1 } }, { new: true }, (err, docs) => {
                            userModule.create({ 'uid': docs.id, 'username': userInfo.username, 'password': userInfo.password, 'nickname': userInfo.username, 'nametag': '从这里开始!', 'avatar': 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', 'follows': 0, 'like': 0, 'article': [] })
                                .then(() => {
                                    res.back(100, '注册成功!')
                                })
                                .catch((err) => res.back(102, '注册失败' + err))
                        })
                    }
                    return UserCreate()
                }
                else {
                    if (doc[0].username == userInfo.username) {
                        return res.back(103, '用户名已经存在')
                    } else {
                        return UserCreate()
                    }
                }
            })
        }
    }
}

exports.log = (req, res) => {
    async function handler() {
        const userInfo = req.body
        if (!userInfo.username || !userInfo.password) {
            return res.back(101, '用户名密码不能为空')
        } else {
            const userDoc = await userModule.findOne({ 'username': userInfo.username }, { '_id': 0, '__v': 0 })
            if (userDoc === null) {
                console.log(baseURL);
                return res.back(201, '用户名不存在!')
            } else {
                if (userInfo.password !== userDoc.password)
                    return res.back(202, '密码错误!')
                else {
                    const tokenStr = 'Bearer ' + jwt.sign({ username: userInfo.username, uid: userDoc.uid }, secretKey, { expiresIn: '1d' })
                    const doc = await userModule.findOne({ 'username': userInfo.username }, { '_id': 0, '__v': 0, 'password': 0 })
                    return res.back(200, '登录成功!', doc, tokenStr)
                }
            }
        }
    }
    handler()
}
exports.getUserInfo = (req, res) => {
    async function handler() {
        const user = req.auth
        const userInfo = await userModule.findOne({ 'username': user.username }, { '_id': 0, 'article': 1, 'follows': 1, 'like': 1 })
        res.send(userInfo)
    }
    handler()
}

exports.authorized = (req, res) => {
    return res.back(1, '1')
}

