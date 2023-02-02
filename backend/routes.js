const router = require('express').Router();
const authController = require('./controllers/auth-controller');
const activateController=require('./controllers/activate-controller')
const activateMiddleware=require('./middlewares/activateMiddleware')
const authMiddleware=require('./middlewares/authMiddleware')

router.post('/api/send-otp', authController.sendOtp);
router.post('/api/verify-otp', authController.verifyOtp);
router.post('/api/activate',activateMiddleware, activateController.activate);
router.get('/api/refresh',authController.refresh)
router.post('/api/logout',authMiddleware,authController.logout)

module.exports = router;
