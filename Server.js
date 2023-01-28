const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')
const connect = require('./db/db')
const app = express()

connect()
app.use(function (req, res, next) {
    res.back = function (code, err, data) {
      res.send({
        res_code: code,
        res_message: err instanceof Error ? err.message : err,
        res_data:data
      })
    }
    next()
  })
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use('/api',userRouter)

app.listen(80,()=>{
    console.log('服务器开启于http://127.0.0.1');
})