"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Wallet, Building, CheckCircle2, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Dummy createOrder function for demonstration purposes
const createOrder = async (orderData: any) => {
  // Simulate order creation with a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate a dummy order ID
  const orderId = `ORD-${Date.now()}`

  console.log("Order created:", orderData)
  console.log("Order ID:", orderId)

  return orderId
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { getCartProducts, subtotal, clearCart } = useCart()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentStep, setPaymentStep] = useState(0)
  const [orderNumber, setOrderNumber] = useState("")

  // Form state
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("India")
  const [notes, setNotes] = useState("")

  // Card details
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")

  // UPI details
  const [upiId, setUpiId] = useState("")

  const cartProducts = getCartProducts()

  const shipping = 99
  const discount = 0
  const total = subtotal + shipping - discount

  if (!user) {
    router.push("/auth/signin?redirect=/checkout")
    return null
  }

  if (cartProducts.length === 0) {
    router.push("/cart")
    return null
  }

  const generateOrderNumber = () => {
    const prefix = "ORD"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}-${timestamp}-${random}`
  }

  const handlePlaceOrder = async () => {
    // Validate form
    if (!name || !email || !phone || !address || !city || !state || !postalCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate payment details if card is selected
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all payment details",
          variant: "destructive",
        })
        return
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        toast({
          title: "Missing UPI ID",
          description: "Please enter your UPI ID",
          variant: "destructive",
        })
        return
      }
    }

    // Create shipping address
    const shippingAddress = {
      id: `addr${Date.now()}`,
      name,
      street: address,
      city,
      state,
      postalCode,
      country,
      isDefault: false,
    }

    // Create order data
    const orderData = {
      items: cartProducts.map((product) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
      })),
      total: total,
      paymentMethod: paymentMethod === "card" ? "Credit Card" : paymentMethod === "upi" ? "UPI" : "Cash on Delivery",
      shippingAddress,
    }

    // Show payment processing dialog
    setShowPaymentDialog(true)
    setIsProcessing(true)

    // Simulate payment processing steps
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setPaymentStep(1) // Verifying payment

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setPaymentStep(2) // Processing order

    // Create the order
    try {
      const newOrderId = await createOrder(orderData)
      setOrderNumber(newOrderId)

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setPaymentStep(3) // Completing transaction

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear cart and redirect to success page with order number
      clearCart()

      router.push(`/checkout/success?order=${newOrderId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
      setShowPaymentDialog(false)
      setIsProcessing(false)
    }
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes about your order, e.g. special delivery instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value="card" id="payment-card" />
                <Label htmlFor="payment-card" className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Credit/Debit Card
                </Label>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value="upi" id="payment-upi" />
                <Label htmlFor="payment-upi" className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  UPI
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="payment-cod" />
                <Label htmlFor="payment-cod" className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Cash on Delivery
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Your payment information is secure and encrypted
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input id="upi-id" placeholder="name@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  You will receive a payment request on your UPI app
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="mt-6 space-y-4">
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    Please note that Cash on Delivery is available only for orders under ₹10,000. Our delivery partner
                    will collect the payment at the time of delivery.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-6 sticky top-20">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {cartProducts.map((product) => (
                <div key={product.id} className="flex gap-4">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-sm font-medium">
                      <h3 className="line-clamp-2">{product.name}</h3>
                      <p className="ml-4">₹{(product.price * product.quantity).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              By placing your order, you agree to our{" "}
              <Link href="#" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md" hideClose>
          <DialogHeader>
            <DialogTitle>Processing Your Order</DialogTitle>
            <DialogDescription>Please do not close this window while we process your payment.</DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {paymentStep >= 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
                <p className="font-medium">Initializing payment</p>
              </div>

              <div className="flex items-center gap-3">
                {paymentStep >= 1 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : paymentStep === 0 ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="h-5 w-5" />
                )}
                <p className="font-medium">Verifying payment details</p>
              </div>

              <div className="flex items-center gap-3">
                {paymentStep >= 2 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : paymentStep === 1 ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="h-5 w-5" />
                )}
                <p className="font-medium">Processing order</p>
              </div>

              <div className="flex items-center gap-3">
                {paymentStep >= 3 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : paymentStep === 2 ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="h-5 w-5" />
                )}
                <p className="font-medium">Completing transaction</p>
              </div>
            </div>

            {paymentStep === 3 && (
              <div className="mt-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="font-bold text-lg">Payment Successful!</p>
                <p className="text-muted-foreground mb-4">Your order has been placed successfully.</p>
                <p className="font-medium">Order Number: {orderNumber}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

