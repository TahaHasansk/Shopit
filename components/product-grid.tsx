import { ProductCard } from "@/components/product-card"

interface Product {
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

interface ProductGridProps {
  products: Product[]
  title: string
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

