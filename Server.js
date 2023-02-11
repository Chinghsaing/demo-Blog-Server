const express = require('express')
const cors = require('cors')
const PublicRouter = require('./router/PublicRouter')
const AuthRouter = require('./router/AuthRouter')
const connect = require('./db/db')
const app = express()
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const secretKey = 'dev By HJX'
connect()
app.use(function (req, res, next) {
    res.back = function (code, err, data, token) {
        res.send({
            code: code,
            message: err instanceof Error ? err.message : err,
            data: data,
            token: token,
        })
    }
    next()
})
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(expressJWT.expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }))
app.use('/api', PublicRouter)
app.use('/user', AuthRouter)
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') return res.back(0, '登录无效或者过期!')
})

app.listen(80, () => {
    console.log('服务器开启于http://127.0.0.1');
})