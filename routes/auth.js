const express = require('express');
const {
    register,
    getUsers,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    confirmEmail,
} = require('../controllers/auth');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', getMe);
router.get('/confirmemail', confirmEmail);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;