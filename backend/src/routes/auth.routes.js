const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// Public routes
router.post(
  '/register',
  [
    body('name').notEmpty().trim().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    body('phone').optional().trim(),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  authController.login
);

router.post(
  '/logout',
  authController.logout
);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  validate,
  authController.forgotPassword
);

router.patch(
  '/reset-password/:token',
  [
    param('token').notEmpty(),
    body('password').isLength({ min: 8 }),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ],
  validate,
  authController.resetPassword
);

router.post(
  '/verify-email',
  [
    body('token').notEmpty(),
  ],
  validate,
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  validate,
  authController.resendVerificationEmail
);

router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty(),
  ],
  validate,
  authController.refreshToken
);

// Protected routes
router.use(protect);

router.get(
  '/me',
  authController.getMe
);

router.patch(
  '/update-me',
  [
    body('name').optional().trim().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('address.street').optional().trim(),
    body('address.city').optional().trim(),
    body('address.state').optional().trim(),
    body('address.country').optional().trim(),
    body('address.zipCode').optional().trim(),
  ],
  validate,
  authController.updateMe
);

router.patch(
  '/update-password',
  [
    body('currentPassword').notEmpty(),
    body('password').isLength({ min: 8 }),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ],
  validate,
  authController.updatePassword
);

router.delete(
  '/delete-me',
  [
    body('password').notEmpty(),
  ],
  validate,
  authController.deleteMe
);

// Admin routes
router.get(
  '/admin/users',
  authController.getAllUsers
);

router.patch(
  '/admin/users/:id/role',
  [
    param('id').isMongoId(),
    body('role').isIn(['user', 'admin', 'moderator']),
  ],
  validate,
  authController.updateUserRole
);

router.delete(
  '/admin/users/:id',
  [
    param('id').isMongoId(),
  ],
  validate,
  authController.deleteUser
);

module.exports = router;
