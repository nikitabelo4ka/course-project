const Router = require("express");
const router = new Router();
const likeController = require('../controllers/likeController');

router.post("/", likeController.create);
router.get("/userLikes/:userId", likeController.getAllUserLikes);
router.get("/itemLikes/:itemId", likeController.getAllItemLikes);
router.delete("/userLikes/delete", likeController.delete);

module.exports = router;
