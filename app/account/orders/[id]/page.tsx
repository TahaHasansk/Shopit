"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle, MapPin, Calendar, Clock } from "lucide-react"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?redirect=/account/orders")
      return
    }

    // Find the order in the user's orders
    const foundOrder = user.orders.find((o: any) => o.id === orderId)

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      // If order not found, redirect to orders page
      router.push("/account/orders")
    }

    setLoading(false)
  }, [user, orderId, router])

  if (loading || !order) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrackingSteps = () => {
    const steps = [
      { status: "pending", label: "Order Placed", description: "Your order has been received" },
      { status: "processing", label: "Processing", description: "Your order is being prepared" },
      { status: "shipped", label: "Shipped", description: "Your order is on the way" },
      { status: "delivered", label: "Delivered", description: "Your order has been delivered" },
    ]

    // Find the current step index
    const currentStepIndex = steps.findIndex((step) => step.status === order.status)

    // If order is cancelled, show special status
    if (order.status === "cancelled") {
      return (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-800 font-medium">This order has been cancelled</span>
        </div>
      )
    }

    return (
      <div className="relative mb-8">
        {/* Progress bar */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex
            const isPast = index < currentStepIndex

            return (
              <div key={step.status} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isPast ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                <div className="text-center mt-2">
                  <p className={`font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{step.label}</p>
                  <p className="text-xs text-muted-foreground max-w-[100px] mx-auto">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Calculate estimated delivery date (for demo purposes)
  const orderDate = new Date(order.date)
  const estimatedDelivery = new Date(orderDate)
  estimatedDelivery.setDate(orderDate.getDate() + 5)

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
              </div>
              <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </Badge>
            </CardHeader>
            <CardContent>
              {getTrackingSteps()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Order Date
                  </div>
                  <p>{new Date(order.date).toLocaleDateString()}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Estimated Delivery
                  </div>
                  <p>{estimatedDelivery.toLocaleDateString()}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Shipping Address
                  </div>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Payment Method
                  </div>
                  <p>{order.paymentMethod}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="font-medium mb-4">Order Items</h3>

              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-sm font-medium">
                        <Link href={`/product/${item.productId}`} className="hover:underline">
                          <h3>{item.name}</h3>
                        </Link>
                        <p className="ml-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {order.status === "delivered" && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with the products you purchased</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item: any) => (
                    <Button key={item.productId} variant="outline" asChild>
                      <Link href={`/product/${item.productId}?review=true`}>Review {item.name}</Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{(order.total - 99).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹99</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.status === "pending" && (
                  <Button variant="outline" className="w-full">
                    Cancel Order
                  </Button>
                )}

                {(order.status === "shipped" || order.status === "processing") && (
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/account/orders/track/${order.id}`}>Track Order</Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/account/orders">View All Orders</Link>
                </Button>

                <Button className="w-full" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

