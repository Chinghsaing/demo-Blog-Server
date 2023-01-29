const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user')
const artHandler = require('../router_handler/article')
router.post('/reg',userHandler.reg)
router.post('/log',userHandler.log)

router.get('/artlist',artHandler.artlist)
router.post('/artpost',artHandler.artpost)

module.exports = router