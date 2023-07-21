const Router = require("express");
const router = new Router();
const collectionsController = require('../controllers/collectionsController');

router.post("/", collectionsController.create);
router.get("/", collectionsController.getAll);
router.get("/one/:id", collectionsController.getOne);
router.get("/user/:userId", collectionsController.getAllUserCollections);
router.delete("/", collectionsController.deleteCollection);
router.patch("/", collectionsController.modifyCollection);

module.exports = router;
