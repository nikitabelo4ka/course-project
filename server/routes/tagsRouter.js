const Router = require("express");
const router = new Router();
const tagsController = require('../controllers/tagsController');

router.get("/", tagsController.getAll);
router.get("/itemTags/:itemId", tagsController.getAllItemsTags);

module.exports = router;
