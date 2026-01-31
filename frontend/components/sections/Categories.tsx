import Link from 'next/link'
import Image from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Latest gadgets & devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
    itemCount: 245,
    color: 'bg-blue-50 hover:bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    id: 2,
    name: 'Fashion',
    description: 'Clothing & accessories',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    itemCount: 189,
    color: 'bg-pink-50 hover:bg-pink-100',
    textColor: 'text-pink-700',
  },
  {
    id: 3,
    name: 'Home & Garden',
    description: 'Furniture & decor',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
    itemCount: 156,
    color: 'bg-green-50 hover:bg-green-100',
    textColor: 'text-green-700',
  },
  {
    id: 4,
    name: 'Beauty',
    description: 'Skincare & cosmetics',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    itemCount: 98,
    color: 'bg-purple-50 hover:bg-purple-100',
    textColor: 'text-purple-700',
  },
  {
    id: 5,
    name: 'Sports',
    description: 'Equipment & apparel',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    itemCount: 123,
    color: 'bg-orange-50 hover:bg-orange-100',
    textColor: 'text-orange-700',
  },
  {
    id: 6,
    name: 'Books',
    description: 'Fiction & non-fiction',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
    itemCount: 67,
    color: 'bg-amber-50 hover:bg-amber-100',
    textColor: 'text-amber-700',
  },
]

export default function Categories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Browse through our wide range of categories to find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              className="group"
            >
              <div className={`${category.color} rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${category.color.replace('50', '100')} flex items-center justify-center`}>
                        <span className={`text-xl font-bold ${category.textColor}`}>
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <span className="text-sm font-medium">
                        {category.itemCount} items
                      </span>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                </div>
                
                {/* Category Image */}
                <div className="mt-6 relative h-48 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="w-full h-full bg-gray-200" />
                  <div className="absolute bottom-4 left-4">
                    <Button
                      variant="secondary"
                      className="bg-background/90 backdrop-blur-sm"
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/categories">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
