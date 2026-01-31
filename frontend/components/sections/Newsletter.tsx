'use client'

import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail('')
      
      toast({
        title: 'Successfully subscribed!',
        description: 'You will now receive our latest updates and offers',
      })
    }, 1000)
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                <Send className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Stay Updated
              </h2>
              
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new arrivals,
                exclusive offers, and special promotions. No spam, we promise!
              </p>

              {isSubscribed ? (
                <div className="inline-flex items-center gap-3 bg-green-50 text-green-700 px-6 py-4 rounded-lg">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">
                    Thank you for subscribing! Check your email for confirmation.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="whitespace-nowrap"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              )}

              <p className="text-sm text-muted-foreground mt-6">
                By subscribing, you agree to our Privacy Policy and consent to receive
                updates from our company.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
