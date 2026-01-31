import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

const products = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 129.99,
    discount: 20,
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    tags: ['Best Seller', 'Wireless'],
  },
  {
    id: 2,
    name: 'Premium Leather Wallet',
    category: 'Fashion',
    price: 79.99,
    discount: 15,
    rating: 4.8,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    tags: ['New', 'Premium'],
  },
  {
    id: 3,
    name: 'Smart Fitness Watch',
    category: 'Electronics',
    price: 249.99,
    discount: 30,
    rating: 4.7,
    reviewCount: 256,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    tags: ['Sale', 'Smart'],
  },
  {
    id: 4,
    name: 'Organic Cotton T-Shirt',
    category: 'Fashion',
    price: 34.99,
    discount: 0,
    rating: 4.3,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    tags: ['Eco-Friendly'],
  },
  {
    id: 5,
    name: 'Ceramic Coffee Mug Set',
    category: 'Home',
    price: 45.99,
    discount: 10,
    rating: 4.6,
    reviewCount: 72,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop',
    tags: ['Home Essential'],
  },
  {
    id: 6,
    name: 'Portable Power Bank',
    category: 'Electronics',
    price: 59.99,
    discount: 25,
    rating: 4.4,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop',
    tags: ['Travel'],
  },
]

export default function FeaturedProducts() {
  const calculatePrice = (price: number, discount: number) => {
    return discount > 0 ? price * (1 - discount / 100) : price
  }

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground mt-2">
              Discover our most popular and highly rated products
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="mt-4 md:mt-0">
            <Link href="/shop">
              View All Products
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const finalPrice = calculatePrice(product.price, product.discount)
            
            return (
              <div
                key={product.id}
                className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <Badge variant="destructive" className="absolute top-3 left-3">
                      -{product.discount}%
                    </Badge>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-background/80 backdrop-blur-sm"
                      title="Add to wishlist"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-background/80 backdrop-blur-sm"
                      title="Quick view"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button
                    className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 rounded-t-none"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {product.category}
                      </p>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {formatPrice(finalPrice)}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Save {formatPrice(product.price - finalPrice)}
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Add Heart icon import
const Heart = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)
