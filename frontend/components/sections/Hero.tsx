'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const slides = [
  {
    id: 1,
    title: 'Summer Collection 2024',
    description: 'Discover the latest trends in fashion with up to 50% off',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    cta: 'Shop Now',
    ctaLink: '/shop/summer-collection',
    bgColor: 'from-blue-50 to-cyan-50',
  },
  {
    id: 2,
    title: 'Tech Gadgets Sale',
    description: 'Upgrade your tech with our exclusive deals on electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
    cta: 'Explore Tech',
    ctaLink: '/categories/electronics',
    bgColor: 'from-purple-50 to-pink-50',
  },
  {
    id: 3,
    title: 'Home Essentials',
    description: 'Transform your living space with premium home decor',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop',
    cta: 'View Collection',
    ctaLink: '/categories/home-decor',
    bgColor: 'from-amber-50 to-orange-50',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            {/* Background Gradient */}
            <div className={cn('absolute inset-0', slide.bgColor)} />
            
            {/* Content */}
            <div className="container relative h-full flex items-center">
              <div className="max-w-2xl space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {slide.description}
                </p>
                <div className="flex gap-4">
                  <Button size="lg" asChild>
                    <Link href={slide.ctaLink}>
                      {slide.cta}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/shop">
                      Browse All
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative Image */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-l from-white via-white/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1200px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full shadow-lg transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full shadow-lg transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0">
        <div className="container flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                index === currentSlide
                  ? 'bg-primary w-8'
                  : 'bg-primary/30 hover:bg-primary/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
