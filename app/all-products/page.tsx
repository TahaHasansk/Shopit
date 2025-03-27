import { FilterSidebar } from "@/components/filter-sidebar"
import { products } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AllProductsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">All Products</h1>
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
                  {product.discount && (
                    <div className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white">
                      {product.discount}% OFF
                    </div>
                  )}
                  <div
                    className={`absolute right-2 top-2 z-10 rounded-md ${product.condition === "New" ? "bg-yellow-500" : "bg-gray-500"} px-2 py-1 text-xs font-medium text-white`}
                  >
                    {product.condition}
                  </div>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <button className="absolute right-2 bottom-2 rounded-full p-2 text-muted-foreground hover:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span className="sr-only">Add to wishlist</span>
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          {i < Math.floor(product.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{product.reviewCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{product.stock} in stock</div>
                  <button className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

