const router = require("express").Router();
const authController = require("./controllers/auth-controller");
const activateController = require("./controllers/activate-controller");
const authMiddleware = require("./middlewares/authMiddleware");
const roomsController = require("./controllers/rooms-controller");

router.post("/api/send-otp", authController.sendOtp);
router.post("/api/verify-otp", authController.verifyOtp);
router.post("/api/activate", authMiddleware, activateController.activate);
router.get("/api/refresh", authController.refresh);
router.post("/api/logout", authMiddleware, authController.logout);
router.post("/api/rooms", authMiddleware, roomsController.create);
router.get("/api/rooms", authMiddleware, roomsController.index);
router.get("/api/rooms/:roomId", authMiddleware, roomsController.show);
router.get(
  "/api/rooms/owner/:ownerId",
  authMiddleware,
  roomsController.indexByOwner
);
router.post("/api/login-email", authController.loginEmail);

module.exports = router;
