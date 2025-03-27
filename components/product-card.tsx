"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  discount?: number
  condition: "New" | "Used"
  stock: number
}

export function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  discount,
  condition,
  stock,
}: ProductCardProps) {
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()

  const inWishlist = isInWishlist(id)

  const handleWishlistToggle = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to your wishlist",
        variant: "destructive",
      })
      return
    }

    if (inWishlist) {
      removeFromWishlist(id)
      toast({
        title: "Removed from wishlist",
        description: `${name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(id)
      toast({
        title: "Added to wishlist",
        description: `${name} has been added to your wishlist`,
      })
    }
  }

  const handleAddToCart = () => {
    addItem(id)
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    })
  }

  return (
    <div className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
        {discount && <Badge className="absolute left-2 top-2 z-10 bg-red-500 text-white">{discount}% OFF</Badge>}
        <Badge
          className={`absolute right-2 top-2 z-10 ${condition === "New" ? "bg-yellow-500" : "bg-gray-500"} text-white`}
        >
          {condition}
        </Badge>
        <Link href={`/product/${id}`}>
          <Image
            src={image || "/placeholder.svg?height=400&width=400"}
            alt={name}
            width={400}
            height={400}
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        <button
          className={`absolute right-2 bottom-2 rounded-full p-2 ${inWishlist ? "text-red-500" : "text-muted-foreground"} hover:bg-background/90`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
          <span className="sr-only">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <Link href={`/product/${id}`}>
          <h3 className="font-medium line-clamp-2 hover:underline">{name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < Math.floor(rating) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{reviewCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">₹{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{stock} in stock</div>
        <Button className="w-full mt-2" onClick={handleAddToCart} disabled={stock === 0}>
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}

