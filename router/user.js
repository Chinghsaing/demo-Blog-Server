const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user')

router.post('/reg',userHandler.reg)
router.post('/log',userHandler.log)

module.exports = router