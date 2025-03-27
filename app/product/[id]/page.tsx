"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Heart, ShoppingCart, Share2, ArrowLeft, Star, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { products } from "@/lib/mock-data"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()

  const productId = params.id as string
  const product = products.find((p) => p.id === productId)

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("black")
  const [selectedSize, setSelectedSize] = useState("m")

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/all-products">Browse All Products</Link>
        </Button>
      </div>
    )
  }

  const inWishlist = isInWishlist(productId)

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
      removeFromWishlist(productId)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(productId)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  const handleAddToCart = () => {
    addItem(productId, quantity)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleBuyNow = () => {
    addItem(productId, quantity)
    router.push("/checkout")
  }

  // Find similar products (same category)
  const similarProducts = products.filter((p) => p.id !== productId && p.category === product.category).slice(0, 4)

  // Find similar second-hand products if this is a new product
  const secondHandAlternatives =
    product.condition === "New"
      ? products.filter((p) => p.condition === "Used" && p.category === product.category).slice(0, 4)
      : []

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-md border cursor-pointer hover:border-primary">
                <Image
                  src={product.image || `/placeholder.svg?height=150&width=150&text=Image ${i}`}
                  alt={`${product.name} - Image ${i}`}
                  width={150}
                  height={150}
                  className="w-full object-cover aspect-square"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.discount && <Badge className="bg-red-500 text-white">{product.discount}% OFF</Badge>}
              <Badge className={product.condition === "New" ? "bg-yellow-500" : "bg-gray-500"}>
                {product.condition}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className={`${product.stock > 0 ? "text-green-600" : "text-red-600"} flex items-center`}>
                {product.stock > 0 ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    <span>In Stock</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Out of Stock</span>
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} {product.stock === 1 ? "item" : "items"} left
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="color-black" />
                  <Label htmlFor="color-black">Black</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="color-white" />
                  <Label htmlFor="color-white">White</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blue" id="color-blue" />
                  <Label htmlFor="color-blue">Blue</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="s" id="size-s" />
                  <Label htmlFor="size-s">S</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="m" id="size-m" />
                  <Label htmlFor="size-m">M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="l" id="size-l" />
                  <Label htmlFor="size-l">L</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xl" id="size-xl" />
                  <Label htmlFor="size-xl">XL</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(10, product.stock) }).map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              className="flex-1"
              size="lg"
              variant="secondary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={inWishlist ? "text-red-500" : ""}
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
            </Button>
            <Button size="icon" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4 pt-4">
              <p>
                Introducing the {product.name}, a perfect blend of style and functionality. This{" "}
                {product.category.toLowerCase()}
                is designed to provide an exceptional experience with its premium build quality and attention to detail.
              </p>
              <p>
                Whether you're looking for reliability, performance, or aesthetics, this product delivers on all fronts.
                The sleek design complements any setting, while the robust construction ensures longevity.
              </p>
              <p>Experience the difference with {product.name} and elevate your lifestyle today.</p>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Brand</span>
                    <p className="text-sm">Shopit</p>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Model</span>
                    <p className="text-sm">SH-{product.id}</p>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Category</span>
                    <p className="text-sm">{product.category}</p>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Condition</span>
                    <p className="text-sm">{product.condition}</p>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Warranty</span>
                    <p className="text-sm">{product.condition === "New" ? "1 Year" : "30 Days"}</p>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Return Policy</span>
                    <p className="text-sm">7 Days</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{product.rating.toFixed(1)}</div>
                    <div className="flex justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <div className="text-sm w-2">{star}</div>
                        <Star className="h-4 w-4 text-yellow-400" />
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-yellow-400 h-full"
                            style={{
                              width: `${Math.random() * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Write a Review
                </Button>

                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`h-4 w-4 ${j < 5 - i ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">
                        {i === 0
                          ? "Excellent product! Exactly as described and arrived quickly. Very satisfied with my purchase."
                          : i === 1
                            ? "Good quality for the price. The delivery was a bit delayed but the product is worth the wait."
                            : "Decent product but not as good as I expected. It works fine though."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      )}

      {/* Second-hand Alternatives */}
      {secondHandAlternatives.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Second-hand Alternatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondHandAlternatives.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

