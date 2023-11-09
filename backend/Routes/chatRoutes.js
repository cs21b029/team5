const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const router = express.Router();
const {accessChat,getChats,createGroup,renameGroups,getGroups,deleteGroups} = require('../Controllers/chatController');
router.route("/").post(protect,accessChat);
router.route("/").get(protect,getChats);
router.route("/group").get(protect,getGroups);
router.route("/group").post(protect,createGroup);
router.route("/rename").put(protect,renameGroups);
router.route("/delete/:id").delete(protect,deleteGroups);
module.exports =router;