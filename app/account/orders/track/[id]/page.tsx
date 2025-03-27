"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle, Clock } from "lucide-react"

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, getOrderById } = useAuth()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?redirect=/account/orders")
      return
    }

    // Find the order
    const foundOrder = getOrderById(orderId)

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      // If order not found, redirect to orders page
      router.push("/account/orders")
    }

    setLoading(false)
  }, [user, orderId, router, getOrderById])

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
    switch (status.toLowerCase()) {
      case "order placed":
        return <Package className="h-5 w-5 text-blue-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-blue-500" />
    }
  }

  // Calculate estimated delivery date (for demo purposes)
  const orderDate = new Date(order.date)
  const estimatedDelivery = new Date(orderDate)
  estimatedDelivery.setDate(orderDate.getDate() + 5)

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Order Details
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle>Track Your Order</CardTitle>
                <CardDescription>
                  Order #{order.id} • Placed on {new Date(order.date).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge
                className={`mt-2 sm:mt-0 ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "shipped"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                <span className="capitalize">{order.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Tracking Number:</span>
                <span>{order.trackingNumber || "Not available"}</span>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Estimated Delivery:</span>
                <span>{estimatedDelivery.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-8 mt-8">
              {order.trackingEvents && order.trackingEvents.length > 0 ? (
                <>
                  <div className="relative">
                    {/* Vertical line connecting events */}
                    <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-muted" />

                    {/* Tracking events */}
                    {order.trackingEvents.map((event: any, index: number) => (
                      <div key={index} className="relative flex gap-4 pb-8">
                        <div
                          className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                            index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {getStatusIcon(event.status)}
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{event.status}</h3>
                            <Badge variant="outline" className="ml-2">
                              {event.location}
                            </Badge>
                          </div>
                          <time className="text-sm text-muted-foreground">{event.date}</time>
                          <p className="mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tracking information available</p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p>{order.paymentMethod}</p>
                <p className="text-sm text-muted-foreground">Total: ₹{order.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button asChild>
                <Link href={`/account/orders/${order.id}`}>View Order Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </div>
  )
}

