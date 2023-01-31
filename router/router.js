const express = require('express')
const multer = require('multer')
const router = express.Router()
const userHandler = require('../router_handler/user')
const artHandler = require('../router_handler/article')
const avatarHandler = require('../router_handler/avatar')

router.post('/reg',userHandler.reg)
router.post('/log',userHandler.log)

router.get('/artlist',artHandler.artlist)
router.post('/artpost',artHandler.artpost)

router.post('/avatar/upload',multer({dest:'uploads/'}).single('avatar'),avatarHandler.upload)
module.exports = router