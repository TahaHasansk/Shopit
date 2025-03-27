"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { products } from "@/lib/mock-data"

export default function WishlistPage() {
  const router = useRouter()
  const { user, removeFromWishlist } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()

  if (!user) {
    router.push("/auth/signin?redirect=/wishlist")
    return null
  }

  const wishlistProducts = products.filter((product) => user.wishlist.includes(product.id))

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId)
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist`,
    })
  }

  const handleAddToCart = (productId: string, productName: string) => {
    addItem(productId)
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart`,
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Items added to your wishlist will be saved here.</p>
          <Button asChild size="lg">
            <Link href="/all-products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden group">
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  <Image
                    src={product.image || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover"
                  />
                </Link>
                <button
                  className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 shadow-sm"
                  onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium line-clamp-2 hover:underline">{product.name}</h3>
                </Link>

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={() => handleAddToCart(product.id, product.name)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

