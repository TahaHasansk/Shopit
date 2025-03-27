"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { getCartProducts, updateQuantity, removeItem, subtotal, itemCount, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const cartProducts = getCartProducts()

  const shipping = 99
  const discount = 0
  const total = subtotal + shipping - discount

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/signin?redirect=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  if (cartProducts.length === 0) {
    return (
      <div className="container py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/all-products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartProducts.map((product) => (
              <div key={product.id} className="flex gap-4 border rounded-lg p-4">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between text-base font-medium">
                    <Link href={`/product/${product.id}`} className="hover:underline">
                      <h3>{product.name}</h3>
                    </Link>
                    <p className="ml-4">₹{(product.price * product.quantity).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="p-2"
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4">{product.quantity}</span>
                      <button className="p-2" onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button className="text-red-500 hover:text-red-600" onClick={() => removeItem(product.id)}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" asChild>
              <Link href="/all-products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" onClick={() => clearCart()}>
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
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

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <Button variant="outline">Apply</Button>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

