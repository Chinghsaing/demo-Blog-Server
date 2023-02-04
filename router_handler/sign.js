const userModel = require('../module/userModule')
const idModel = require('../module/idsModule')
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
            userModel.find({ 'username': userInfo.username }, { 'username': 1, '_id': 0 }, (err, doc) => {
                if (doc.length == 0) {
                    function UserCreate() {
                        idModel.findOneAndUpdate({ name: 'user' }, { $inc: { id: 1 } }, { new: true }, (err, docs) => {
                            userModel.create({ 'uid': docs.id, 'username': userInfo.username, 'password': userInfo.password, 'nickname': userInfo.username, 'nametag': '从这里开始!', 'avatar': '', 'follows': 0, 'like': 0, 'article': [] })
                                .then(() => {
                                    res.back(100, '注册成功!')
                                })
                                .catch((err) => res.back(102, '注册失败' + err))
                        })
                    }
                    UserCreate()
                }
                else {
                    if (doc[0].username == userInfo.username) {
                        res.back(103, '用户名已经存在')
                    } else {
                        UserCreate()
                    }
                }
            })
        }
    }
}

exports.log = (req, res) => {
    const userInfo = req.body
    if (!userInfo.username || !userInfo.password) {
        return res.back(101, '用户名密码不能为空')
    } else {
        userModel.find({ 'username': userInfo.username }, { '_id': 0, '__v': 0 }, (err, doc) => {
            if (doc.length === 0) {
                res.back(201, '用户名不存在！')
            } else {
                if (userInfo.password !== doc[0].password)
                    res.back(202, '密码错误！')
                else {
                    const tokenStr = 'Bearer ' + jwt.sign({ username: userInfo.username, uid: doc[0].uid }, secretKey, { expiresIn: '10m' })
                    res.back(200, '登录成功！', doc, tokenStr)
                }
            }
        })
    }
}

