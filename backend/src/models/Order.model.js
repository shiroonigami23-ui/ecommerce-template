const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Order item must belong to a product']
  },
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  image: {
    url: String,
    alt: String
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  size: String,
  color: String,
  variation: {
    name: String,
    value: String
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: {
      type: String,
      required: [true, 'Full name is required']
    },
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    }
  },
  billingAddress: {
    sameAsShipping: {
      type: Boolean,
      default: true
    },
    fullName: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  shippingFee: {
    type: Number,
    required: true,
    min: [0, 'Shipping fee cannot be negative'],
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative'],
    default: 0
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    default: 0
  },
  discountCode: String,
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'stripe', 'cod', 'bank_transfer'],
    required: [true, 'Payment method is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentId: String,
  paymentDetails: mongoose.Schema.Types.Mixed,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  notes: String,
  isDigital: {
    type: Boolean,
    default: false
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.email': 1 });

// Virtual field for readable status
orderSchema.virtual('statusText').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'returned': 'Returned'
  };
  return statusMap[this.status] || this.status;
});

// Virtual field for readable payment status
orderSchema.virtual('paymentStatusText').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'processing': 'Processing',
    'completed': 'Completed',
    'failed': 'Failed',
    'refunded': 'Refunded',
    'cancelled': 'Cancelled'
  };
  return statusMap[this.paymentStatus] || this.paymentStatus;
});

// Pre-save middleware to generate order number and calculate totals
orderSchema.pre('save', function(next) {
  // Generate order number if new
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}-${random}`;
  }

  // Calculate item totals if items exist
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.total = item.price * item.quantity;
    });

    // Calculate subtotal
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

    // Calculate total
    this.total = this.subtotal + this.shippingFee + this.tax - this.discount;
  }

  // If billing address is same as shipping, copy values
  if (this.billingAddress && this.billingAddress.sameAsShipping) {
    this.billingAddress = {
      sameAsShipping: true,
      fullName: this.shippingAddress.fullName,
      street: this.shippingAddress.street,
      city: this.shippingAddress.city,
      state: this.shippingAddress.state,
      country: this.shippingAddress.country,
      zipCode: this.shippingAddress.zipCode
    };
  }

  next();
});

// Query middleware to populate user and items
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'items.product',
    select: 'name slug images'
  });
  next();
});

// Static method to get order statistics
orderSchema.statics.getStatistics = async function(userId = null) {
  const matchStage = userId ? { user: userId } : {};
  
  const stats = await this.aggregate([
    {
      $match: matchStage
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        processingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
        },
        shippedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  };
};

// Instance method to update product quantities after order
orderSchema.methods.updateProductQuantities = async function() {
  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      product.quantity -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }
  }
};

// Instance method to cancel order and restore quantities
orderSchema.methods.cancelOrder = async function() {
  if (this.status === 'cancelled') {
    throw new Error('Order is already cancelled');
  }

  // Restore product quantities
  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      product.quantity += item.quantity;
      product.sold -= item.quantity;
      await product.save();
    }
  }

  this.status = 'cancelled';
  this.paymentStatus = 'cancelled';
  await this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
