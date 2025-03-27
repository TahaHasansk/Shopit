import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.isDeal).slice(0, 4)
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4)

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent z-10" />
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Hero Banner"
          width={1200}
          height={600}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-8 z-20 text-white">
          <h1 className="text-4xl font-bold mb-4 max-w-md">Summer Sale Up To 50% Off</h1>
          <p className="text-lg mb-6 max-w-md">Discover amazing deals on our best-selling products</p>
          <div>
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/deals">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/all-products?category=Electronics" className="group">
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Electronics"
                width={400}
                height={300}
                className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-2xl font-bold text-white">Electronics</h3>
              </div>
            </div>
          </Link>
          <Link href="/all-products?category=Clothing" className="group">
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Clothing"
                width={400}
                height={300}
                className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-2xl font-bold text-white">Clothing</h3>
              </div>
            </div>
          </Link>
          <Link href="/all-products?category=Home" className="group">
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Home"
                width={400}
                height={300}
                className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-2xl font-bold text-white">Home</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Deals Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Today's Deals</h2>
          <Button asChild variant="outline">
            <Link href="/deals">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Button asChild variant="outline">
            <Link href="/new-arrivals">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}

