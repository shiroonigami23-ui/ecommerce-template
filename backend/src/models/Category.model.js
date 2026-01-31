const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image: {
    url: String,
    alt: String,
    publicId: String
  },
  icon: String,
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    maxlength: [70, 'Meta title cannot exceed 70 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  seoKeywords: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent: 1 });
categorySchema.index({ featured: 1 });
categorySchema.index({ displayOrder: 1 });

// Virtual field for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  foreignField: 'parent',
  localField: '_id'
});

// Virtual field for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  foreignField: 'category',
  localField: '_id',
  count: true
});

// Query middleware to exclude inactive categories
categorySchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Query middleware to populate subcategories
categorySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'subcategories',
    select: 'name slug image'
  });
  next();
});

// Middleware to create slug from name
categorySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
    
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ parent: null })
    .populate({
      path: 'subcategories',
      populate: {
        path: 'subcategories'
      }
    })
    .sort('displayOrder');
    
  return categories;
};

// Static method to get category with all descendants
categorySchema.statics.getCategoryWithDescendants = async function(categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return null;
  
  const getDescendants = async (parentId) => {
    const children = await this.find({ parent: parentId });
    const descendants = [];
    
    for (const child of children) {
      const childDescendants = await getDescendants(child._id);
      descendants.push({
        ...child.toObject(),
        subcategories: childDescendants
      });
    }
    
    return descendants;
  };
  
  const subcategories = await getDescendants(categoryId);
  
  return {
    ...category.toObject(),
    subcategories
  };
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
