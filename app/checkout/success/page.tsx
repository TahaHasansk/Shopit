"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle2, Truck, Package, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { itemCount } = useCart()
  const orderNumber = searchParams.get("order") || ""

  const [estimatedDelivery, setEstimatedDelivery] = useState("")

  useEffect(() => {
    // Calculate estimated delivery date (3-5 business days from now)
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + 3 + Math.floor(Math.random() * 3))

    // Format the date
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    setEstimatedDelivery(deliveryDate.toLocaleDateString("en-US", options))

    // Redirect to home if there's no order number
    if (!orderNumber) {
      router.push("/")
    }
  }, [orderNumber, router])

  // Redirect to home if there are items in cart (user might have navigated here directly)
  useEffect(() => {
    if (itemCount > 0) {
      router.push("/cart")
    }
  }, [itemCount, router])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>

          <p className="text-muted-foreground mb-4">
            Thank you for your purchase. Your order has been placed and is being processed. You will receive an email
            confirmation shortly.
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <p className="font-medium text-lg">Order Number:</p>
              <p className="text-xl font-bold">{orderNumber}</p>
            </div>
            <Button variant="outline" size="sm" asChild className="mt-2 sm:mt-0">
              <Link href={`/account/orders`}>View Order Details</Link>
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-background rounded-full p-2 mt-1">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-muted-foreground">
                  Your order is being processed and prepared for shipping.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-background rounded-full p-2 mt-1">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">{estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-background rounded-full p-2 mt-1">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Track Your Order</p>
                <p className="text-sm text-muted-foreground">
                  You can track your order status in your account dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="faq-1">
            <AccordionTrigger>What happens next?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Your order is now being processed. Here's what to expect:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>You'll receive an order confirmation email shortly.</li>
                <li>Once your order is shipped, you'll receive a shipping confirmation with tracking details.</li>
                <li>You can track your order status in your account dashboard.</li>
                <li>For any questions, contact our customer support team.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2">
            <AccordionTrigger>Need to modify your order?</AccordionTrigger>
            <AccordionContent>
              <p>
                If you need to make changes to your order, please contact our customer support team as soon as possible.
                We'll do our best to accommodate your request, but please note that once an order enters the shipping
                process, modifications may not be possible.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/account/orders">View My Orders</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

