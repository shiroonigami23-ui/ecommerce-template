const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const productController = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const upload = require('../utils/upload');
const validate = require('../middleware/validate.middleware');

// Public routes
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isIn(['price', '-price', 'rating', '-rating', 'newest', 'popular']),
    query('category').optional().isMongoId(),
    query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('rating').optional().isFloat({ min: 0, max: 5 }).toFloat(),
    query('search').optional().trim().escape(),
    query('inStock').optional().isBoolean().toBoolean(),
    query('featured').optional().isBoolean().toBoolean(),
    query('discount').optional().isBoolean().toBoolean(),
  ],
  validate,
  productController.getAllProducts
);

router.get(
  '/:id',
  [
    param('id').isMongoId(),
  ],
  validate,
  productController.getProduct
);

router.get(
  '/slug/:slug',
  [
    param('slug').isSlug(),
  ],
  validate,
  productController.getProductBySlug
);

router.get(
  '/category/:categoryId',
  [
    param('categoryId').isMongoId(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isIn(['price', '-price', 'rating', '-rating', 'newest']),
  ],
  validate,
  productController.getProductsByCategory
);

router.get(
  '/search/suggestions',
  [
    query('q').notEmpty().trim().escape(),
    query('limit').optional().isInt({ min: 1, max: 20 }).toInt(),
  ],
  validate,
  productController.getSearchSuggestions
);

router.get(
  '/related/:productId',
  [
    param('productId').isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 20 }).toInt(),
  ],
  validate,
  productController.getRelatedProducts
);

// Protected routes (require authentication)
router.use(protect);

// User-specific routes
router.post(
  '/:id/reviews',
  [
    param('id').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').trim().isLength({ min: 10, max: 1000 }),
    body('title').optional().trim().isLength({ max: 100 }),
  ],
  validate,
  productController.createProductReview
);

router.post(
  '/:id/wishlist',
  [
    param('id').isMongoId(),
  ],
  validate,
  productController.addToWishlist
);

router.delete(
  '/:id/wishlist',
  [
    param('id').isMongoId(),
  ],
  validate,
  productController.removeFromWishlist
);

// Admin routes
router.use(restrictTo('admin', 'moderator'));

router.post(
  '/',
  upload.array('images', 10),
  [
    body('name').notEmpty().trim().isLength({ min: 3, max: 200 }),
    body('description').notEmpty().trim().isLength({ min: 10, max: 2000 }),
    body('shortDescription').optional().trim().isLength({ max: 500 }),
    body('price').isFloat({ min: 0 }),
    body('comparePrice').optional().isFloat({ min: 0 }),
    body('discount').optional().isFloat({ min: 0, max: 100 }),
    body('category').isMongoId(),
    body('subcategory').optional().isMongoId(),
    body('brand').optional().trim(),
    body('sku').optional().trim(),
    body('barcode').optional().trim(),
    body('quantity').isInt({ min: 0 }),
    body('weight').optional().isFloat({ min: 0 }),
    body('dimensions.length').optional().isFloat({ min: 0 }),
    body('dimensions.width').optional().isFloat({ min: 0 }),
    body('dimensions.height').optional().isFloat({ min: 0 }),
    body('tags').optional().isArray(),
    body('attributes').optional().isArray(),
    body('variations').optional().isArray(),
    body('metaTitle').optional().trim().isLength({ max: 70 }),
    body('metaDescription').optional().trim().isLength({ max: 160 }),
    body('seoKeywords').optional().isArray(),
    body('isDigital').optional().isBoolean(),
    body('downloadUrl').optional().trim().isURL(),
    body('featured').optional().isBoolean(),
  ],
  validate,
  productController.createProduct
);

router.patch(
  '/:id',
  upload.array('images', 10),
  [
    param('id').isMongoId(),
    body('name').optional().trim().isLength({ min: 3, max: 200 }),
    body('description').optional().trim().isLength({ min: 10, max: 2000 }),
    body('shortDescription').optional().trim().isLength({ max: 500 }),
    body('price').optional().isFloat({ min: 0 }),
    body('comparePrice').optional().isFloat({ min: 0 }),
    body('discount').optional().isFloat({ min: 0, max: 100 }),
    body('category').optional().isMongoId(),
    body('subcategory').optional().isMongoId(),
    body('brand').optional().trim(),
    body('sku').optional().trim(),
    body('barcode').optional().trim(),
    body('quantity').optional().isInt({ min: 0 }),
    body('weight').optional().isFloat({ min: 0 }),
    body('dimensions.length').optional().isFloat({ min: 0 }),
    body('dimensions.width').optional().isFloat({ min: 0 }),
    body('dimensions.height').optional().isFloat({ min: 0 }),
    body('tags').optional().isArray(),
    body('attributes').optional().isArray(),
    body('variations').optional().isArray(),
    body('metaTitle').optional().trim().isLength({ max: 70 }),
    body('metaDescription').optional().trim().isLength({ max: 160 }),
    body('seoKeywords').optional().isArray(),
    body('isDigital').optional().isBoolean(),
    body('downloadUrl').optional().trim().isURL(),
    body('featured').optional().isBoolean(),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  productController.updateProduct
);

router.delete(
  '/:id',
  [
    param('id').isMongoId(),
  ],
  validate,
  productController.deleteProduct
);

router.get(
  '/admin/all',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isIn(['createdAt', '-createdAt', 'name', '-name']),
    query('search').optional().trim().escape(),
  ],
  validate,
  productController.getAllProductsAdmin
);

router.get(
  '/admin/statistics',
  productController.getProductStatistics
);

module.exports = router;
