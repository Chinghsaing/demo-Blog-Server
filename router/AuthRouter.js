const express = require('express')
const multer = require('multer')
const router = express.Router()
const artHandler = require('../router_handler/article')
const userHandler = require('../router_handler/user')

router.post('/artpost', multer({ dest: 'uploads/' }).single('articleCover'), artHandler.artPost)

router.post('/avatar', multer({ dest: 'uploads/' }).single('avatar'), userHandler.avatarUpdate)
router.post('/nickname', userHandler.nicknameUpdate)
router.post('/usertag', userHandler.tagUpdate)
module.exports = router