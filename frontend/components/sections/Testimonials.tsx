import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
    rating: 5,
    content: 'The quality of products and customer service is exceptional. My orders always arrive on time and in perfect condition.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 4,
    content: 'Great selection of electronics at competitive prices. The 30-day return policy gives me peace of mind.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    content: 'Beautiful home decor items that perfectly match my design aesthetic. The quality exceeds my expectations.',
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Fitness Coach',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    rating: 5,
    content: 'As a fitness professional, I appreciate the quality of sports equipment. Fast shipping and excellent support.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">50K+</div>
            <p className="text-muted-foreground mt-2">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">100+</div>
            <p className="text-muted-foreground mt-2">Brand Partners</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">24/7</div>
            <p className="text-muted-foreground mt-2">Customer Support</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">99%</div>
            <p className="text-muted-foreground mt-2">Positive Reviews</p>
          </div>
        </div>
      </div>
    </section>
  )
}
