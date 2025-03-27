"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { products } from "@/lib/mock-data"

type CartItem = {
  productId: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (productId: string, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartProducts: () => CartProduct[]
}

type CartProduct = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId)
    return total + (product?.price || 0) * item.quantity
  }, 0)

  const addItem = (productId: string, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId)

      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...prevItems, { productId, quantity }]
      }
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartProducts = (): CartProduct[] => {
    return items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return {
        id: item.productId,
        name: product?.name || "Unknown Product",
        price: product?.price || 0,
        originalPrice: product?.originalPrice,
        image: product?.image || "/placeholder.svg",
        quantity: item.quantity,
      }
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

