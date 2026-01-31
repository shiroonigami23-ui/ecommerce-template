const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const Review = require('../models/Review.model');
const AppError = require('./errorHandler').AppError;
const { formatFileResponse, deleteCloudinaryFile, deleteLocalFile } = require('../utils/upload');

exports.getAllProducts = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Handle price range
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    // Handle rating
    if (req.query.rating) {
      queryObj.ratingsAverage = { $gte: Number(req.query.rating) };
    }

    // Handle inStock
    if (req.query.inStock === 'true') {
      queryObj.quantity = { $gt: 0 };
    } else if (req.query.inStock === 'false') {
      queryObj.quantity = { $lte: 0 };
    }

    // Handle featured
    if (req.query.featured === 'true') {
      queryObj.featured = true;
    }

    // Handle discount
    if (req.query.discount === 'true') {
      queryObj.discount = { $gt: 0 };
    }

    // Handle search
    if (req.query.search) {
      queryObj.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    let query = Product.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortMap = {
        'price': 'price',
        '-price': '-price',
        'rating': 'ratingsAverage',
        '-rating': '-ratingsAverage',
        'newest': '-createdAt',
        'popular': '-sold',
      };
      query = query.sort(sortMap[req.query.sort] || '-createdAt');
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;
    const total = await Product.countDocuments(queryObj);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'reviews',
      options: { sort: { createdAt: -1 }, limit: 10 },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      options: { sort: { createdAt: -1 }, limit: 10 },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Get all subcategory IDs including the main category
    const categoryIds = [category._id];
    const subcategories = await Category.find({ parent: category._id });
    subcategories.forEach(sub => categoryIds.push(sub._id));

    // Build query
    const queryObj = { category: { $in: categoryIds } };
    const query = Product.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortMap = {
        'price': 'price',
        '-price': '-price',
        'rating': 'ratingsAverage',
        '-rating': '-ratingsAverage',
        'newest': '-createdAt',
      };
      query.sort(sortMap[req.query.sort] || '-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    query.skip(skip).limit(limit);

    const products = await query;
    const total = await Product.countDocuments(queryObj);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: {
        products,
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => formatFileResponse(file));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Update product data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => formatFileResponse(file));
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Delete uploaded images
    if (product.images && product.images.length > 0) {
      if (process.env.NODE_ENV === 'production') {
        // Delete from Cloudinary
        for (const image of product.images) {
          if (image.publicId) {
            await deleteCloudinaryFile(image.publicId);
          }
        }
      } else {
        // Delete local files
        for (const image of product.images) {
          if (image.url && image.url.startsWith('/uploads/')) {
            deleteLocalFile(image.url);
          }
        }
      }
    }

    await product.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProductReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });

    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400));
    }

    // Create review
    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
      title: req.body.title,
      verifiedPurchase: false, // You can check if user purchased this product
    });

    // Update product ratings
    await Product.calcAverageRatings(product._id);

    res.status(201).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const limit = parseInt(req.query.limit, 10) || 4;

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(limit)
      .sort('-ratingsAverage -createdAt');

    res.status(200).json({
      status: 'success',
      results: relatedProducts.length,
      data: {
        products: relatedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const searchTerm = req.query.q;
    const limit = parseInt(req.query.limit, 10) || 5;

    const suggestions = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    })
      .select('name slug images price discount')
      .limit(limit);

    res.status(200).json({
      status: 'success',
      data: {
        suggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin functions
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const queryObj = {};
    
    if (req.query.search) {
      queryObj.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } },
        { 'category.name': { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    let query = Product.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortMap = {
        'createdAt': 'createdAt',
        '-createdAt': '-createdAt',
        'name': 'name',
        '-name': '-name',
      };
      query.sort(sortMap[req.query.sort] || '-createdAt');
    }

    query.skip(skip).limit(limit);

    const products = await query;
    const total = await Product.countDocuments(queryObj);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductStatistics = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalInStock: { $sum: { $cond: [{ $gt: ['$quantity', 0] }, 1, 0] } },
          totalOutOfStock: { $sum: { $cond: [{ $lte: ['$quantity', 0] }, 1, 0] } },
          averagePrice: { $avg: '$price' },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          featuredProducts: { $sum: { $cond: ['$featured', 1, 0] } },
        },
      },
    ]);

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          categoryName: '$category.name',
          count: 1,
          averagePrice: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overall: stats[0] || {
          totalProducts: 0,
          totalInStock: 0,
          totalOutOfStock: 0,
          averagePrice: 0,
          totalValue: 0,
          featuredProducts: 0,
        },
        byCategory: categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const user = req.user;
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return next(new AppError('Product already in wishlist', 400));
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = req.user;
    const productId = req.params.id;

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId.toString()
    );
    
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};
