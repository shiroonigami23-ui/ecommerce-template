import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Timer, Percent, Gift } from 'lucide-react'

export default function PromoBanner() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flash Sale Banner */}
          <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Timer className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Flash Sale</h3>
              </div>
              <p className="mb-6 opacity-90">
                Limited time offer! Get up to 60% off on selected items.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <span className="text-2xl font-bold">02</span>
                  </div>
                  <span className="text-xs mt-1 opacity-80">Days</span>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <span className="text-2xl font-bold">12</span>
                  </div>
                  <span className="text-xs mt-1 opacity-80">Hours</span>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <span className="text-2xl font-bold">45</span>
                  </div>
                  <span className="text-xs mt-1 opacity-80">Mins</span>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <span className="text-2xl font-bold">30</span>
                  </div>
                  <span className="text-xs mt-1 opacity-80">Secs</span>
                </div>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-red-600 hover:bg-white/90"
                asChild
              >
                <Link href="/flash-sale">
                  Shop Now
                </Link>
              </Button>
            </div>
          </div>

          {/* Seasonal Sale Banner */}
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Percent className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Seasonal Sale</h3>
              </div>
              <p className="mb-6 opacity-90">
                Winter collection up to 50% off. Don't miss out on these deals!
              </p>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Sale Progress</span>
                  <span className="text-sm font-semibold">75%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-white/90"
                asChild
              >
                <Link href="/seasonal-sale">
                  Browse Collection
                </Link>
              </Button>
            </div>
          </div>

          {/* Gift Card Banner */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Gift Cards</h3>
              </div>
              <p className="mb-6 opacity-90">
                Perfect gift for any occasion. E-gift cards delivered instantly.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm">$25 Gift Card</span>
                  <span className="font-semibold">$25.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">$50 Gift Card</span>
                  <span className="font-semibold">$50.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">$100 Gift Card</span>
                  <span className="font-semibold">$100.00</span>
                </div>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-white/90"
                asChild
              >
                <Link href="/gift-cards">
                  Buy Gift Card
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
