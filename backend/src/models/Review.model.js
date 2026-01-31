const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    url: String,
    alt: String,
    publicId: String
  }],
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  notHelpful: {
    type: Number,
    default: 0,
    min: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  response: {
    comment: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: 1 });
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ isFeatured: 1 });

// Query middleware to populate user
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name avatar'
  });
  next();
});

// Static method to get product reviews summary
reviewSchema.statics.getProductReviewsSummary = async function(productId) {
  const summary = await this.aggregate([
    {
      $match: { 
        product: mongoose.Types.ObjectId.createFromHexString(productId),
        isApproved: true 
      }
    },
    {
      $group: {
        _id: '$product',
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        totalReviews: 1,
        averageRating: { $round: ['$averageRating', 1] },
        ratingDistribution: {
          '5': {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                as: 'rating',
                cond: { $eq: ['$$rating', 5] }
              }
            }
          },
          '4': {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                as: 'rating',
                cond: { $eq: ['$$rating', 4] }
              }
            }
          },
          '3': {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                as: 'rating',
                cond: { $eq: ['$$rating', 3] }
              }
            }
          },
          '2': {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                as: 'rating',
                cond: { $eq: ['$$rating', 2] }
              }
            }
          },
          '1': {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                as: 'rating',
                cond: { $eq: ['$$rating', 1] }
              }
            }
          }
        }
      }
    }
  ]);

  return summary[0] || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0
    }
  };
};

// Instance method to mark review as helpful
reviewSchema.methods.markHelpful = async function() {
  this.helpful += 1;
  await this.save();
};

// Instance method to mark review as not helpful
reviewSchema.methods.markNotHelpful = async function() {
  this.notHelpful += 1;
  await this.save();
};

// Instance method to add response
reviewSchema.methods.addResponse = async function(comment, userId) {
  this.response = {
    comment,
    respondedBy: userId,
    respondedAt: new Date()
  };
  await this.save();
};

// Post-save middleware to update product ratings
reviewSchema.post('save', async function() {
  if (this.isApproved) {
    const Product = mongoose.model('Product');
    await Product.calcAverageRatings(this.product);
  }
});

// Post-remove middleware to update product ratings
reviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  await Product.calcAverageRatings(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
