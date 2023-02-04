const express = require('express')
const router = express.Router()
const signHandler = require('../router_handler/sign')
const artHandler = require('../router_handler/article')

router.post('/reg',signHandler.reg)
router.post('/log',signHandler.log)
router.get('/artlist',artHandler.artList)

module.exports = router