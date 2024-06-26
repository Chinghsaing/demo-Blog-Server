const express = require('express')
const multer = require('multer')
const router = express.Router()
const artHandler = require('../router_handler/article')
const userHandler = require('../router_handler/user')
const signHandler = require('../router_handler/sign')
const cmtHandler = require('../router_handler/comment')
const picHandler = require('../router_handler/pic')
router.post('/artpost', multer({ dest: 'uploads/' }).single('articleCover'), artHandler.artPost)

router.post('/avatar', multer({ dest: 'uploads/' }).single('avatar'), userHandler.avatarUpdate)
router.post('/nickname', userHandler.nicknameUpdate)
router.post('/usertag', userHandler.tagUpdate)

router.get('/getuser', signHandler.getUserInfo)
router.post('/cmtpost', cmtHandler.cmtPost)
router.post('/authorized', signHandler.authorized)
router.get('/userarticle', userHandler.getUserArticle)
router.post('/artdelete', artHandler.artDelete)
router.post('/cmtreply', cmtHandler.cmtReply)
router.post('/artimg', multer({ dest: 'uploads/' }).array('images'), artHandler.artImg)
router.post('/picpost', multer({ dest: 'uploads/' }).array('pics'), picHandler.picPost)
module.exports = router