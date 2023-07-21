const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.patch("/status", userController.changeStatus);
router.patch("/role", userController.changeAdmin);
router.get("/auth", authMiddleware, userController.check);
router.get("/", userController.getALL);
router.delete("/", userController.delete);

module.exports = router;
