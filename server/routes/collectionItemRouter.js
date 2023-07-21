const Router = require("express");
const router = new Router();
const collectionItemController = require('../controllers/collectionItemController');

router.post("/", collectionItemController.create);
router.patch("/modify", collectionItemController.modifyCollectionItem);
router.get("/all", collectionItemController.getAllCollectionItems);
router.get("/allItems", collectionItemController.getAllItems);
router.get("/latest", collectionItemController.getLatestItems);
router.delete("/", collectionItemController.deleteCollectionItem);
router.get("/one/:id", collectionItemController.getOneCollectionItem);

module.exports = router;
