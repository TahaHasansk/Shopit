"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, X, Star, ShoppingCart, Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { products } from "@/lib/mock-data"

export default function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()

  const productIds = searchParams.get("ids")?.split(",") || []
  const [compareProducts, setCompareProducts] = useState<any[]>([])
  const [availableProducts, setAvailableProducts] = useState<any[]>([])

  useEffect(() => {
    // Get products to compare
    const productsToCompare = productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)

    setCompareProducts(productsToCompare)

    // Get available products for the dropdown
    const category = productsToCompare[0]?.category
    setAvailableProducts(products.filter((p) => p.category === category && !productIds.includes(p.id)))
  }, [productIds])

  const handleAddProduct = (productId: string) => {
    if (compareProducts.length >= 3) {
      toast({
        title: "Maximum products reached",
        description: "You can compare up to 3 products at a time",
        variant: "destructive",
      })
      return
    }

    const newIds = [...productIds, productId]
    router.push(`/compare?ids=${newIds.join(",")}`)
  }

  const handleRemoveProduct = (productId: string) => {
    const newIds = productIds.filter((id) => id !== productId)

    if (newIds.length === 0) {
      router.push("/all-products")
      return
    }

    router.push(`/compare?ids=${newIds.join(",")}`)
  }

  const handleAddToCart = (productId: string, productName: string) => {
    addItem(productId)
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart`,
    })
  }

  const handleWishlistToggle = (productId: string, productName: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to your wishlist",
        variant: "destructive",
      })
      return
    }

    const inWishlist = isInWishlist(productId)

    if (inWishlist) {
      removeFromWishlist(productId)
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(productId)
      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist`,
      })
    }
  }

  if (compareProducts.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Comparison</h1>
        <p className="mb-6">No products selected for comparison.</p>
        <Button asChild>
          <Link href="/all-products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Product Comparison</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Select onValueChange={handleAddProduct}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Add product to compare" />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" asChild>
            <Link href="/all-products">Browse All</Link>
          </Button>
        </div>

        <div>
          <Button variant="outline" asChild>
            <Link href="/all-products">Clear All</Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-4 bg-muted text-left w-1/4">Feature</th>
              {compareProducts.map((product) => (
                <th key={product.id} className="border p-4 bg-muted text-center">
                  <div className="relative">
                    <button
                      className="absolute top-0 right-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <div className="pt-6">
                      <Link href={`/product/${product.id}`}>
                        <Image
                          src={product.image || "/placeholder.svg?height=150&width=150"}
                          alt={product.name}
                          width={150}
                          height={150}
                          className="mx-auto mb-4 object-contain h-32"
                        />
                        <h3 className="font-medium text-lg mb-2 hover:underline">{product.name}</h3>
                      </Link>

                      <div className="flex justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
                      </div>

                      <div className="flex justify-center items-center gap-2 mb-4">
                        <span className="font-bold">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product.id, product.name)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          className={isInWishlist(product.id) ? "text-red-500" : ""}
                          onClick={() => handleWishlistToggle(product.id, product.name)}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-4 font-medium">Condition</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border p-4 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      product.condition === "New" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.condition}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Category</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border p-4 text-center">
                  {product.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">In Stock</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border p-4 text-center">
                  {product.stock > 0 ? (
                    <div className="flex items-center justify-center text-green-600">
                      <Check className="h-5 w-5 mr-1" />
                      <span>{product.stock} available</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-red-600">
                      <X className="h-5 w-5 mr-1" />
                      <span>Out of stock</span>
                    </div>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Warranty</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border p-4 text-center">
                  {product.condition === "New" ? "1 Year" : "30 Days"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Return Policy</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border p-4 text-center">
                  7 Days
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Shipping</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border p-4 text-center">
                  Free Shipping
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Rating</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border p-4 text-center">
                  <div className="flex justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

