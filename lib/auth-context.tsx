"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
  addresses: Address[]
  orders: Order[]
  wishlist: string[]
}

type Address = {
  id: string
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

type Order = {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  total: number
  paymentMethod: string
  shippingAddress: Address
  trackingNumber?: string
  trackingEvents?: TrackingEvent[]
}

type TrackingEvent = {
  date: string
  status: string
  location: string
  description: string
}

type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  createOrder: (orderData: Partial<Order>) => string
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  getOrderById: (orderId: string) => Order | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop",
    addresses: [
      {
        id: "addr1",
        name: "Home",
        street: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
        isDefault: true,
      },
    ],
    orders: [
      {
        id: "order1",
        date: "2023-12-15",
        status: "delivered",
        items: [
          {
            productId: "1",
            name: "Samsung Crystal 4K Ultra HD Smart TV",
            price: 44990,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1601944179066-29b8f7e29c3d?q=80&w=2070&auto=format&fit=crop",
          },
        ],
        total: 44990,
        paymentMethod: "Credit Card",
        shippingAddress: {
          id: "addr1",
          name: "Home",
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
          isDefault: true,
        },
        trackingNumber: "IND123456789",
        trackingEvents: [
          {
            date: "2023-12-12 09:30",
            status: "Order Placed",
            location: "Mumbai",
            description: "Your order has been placed successfully",
          },
          {
            date: "2023-12-12 14:45",
            status: "Processing",
            location: "Mumbai",
            description: "Your order is being processed",
          },
          {
            date: "2023-12-13 10:15",
            status: "Shipped",
            location: "Mumbai",
            description: "Your order has been shipped",
          },
          {
            date: "2023-12-15 11:30",
            status: "Delivered",
            location: "Mumbai",
            description: "Your order has been delivered",
          },
        ],
      },
      {
        id: "order2",
        date: "2024-01-05",
        status: "shipped",
        items: [
          {
            productId: "7",
            name: "Sony WH-1000XM4 Wireless Headphones",
            price: 19990,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
          },
          {
            productId: "10",
            name: "Nike Air Force 1 '07",
            price: 7495,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
          },
        ],
        total: 27485,
        paymentMethod: "UPI",
        shippingAddress: {
          id: "addr1",
          name: "Home",
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
          isDefault: true,
        },
        trackingNumber: "IND987654321",
        trackingEvents: [
          {
            date: "2024-01-05 11:20",
            status: "Order Placed",
            location: "Mumbai",
            description: "Your order has been placed successfully",
          },
          {
            date: "2024-01-05 16:30",
            status: "Processing",
            location: "Mumbai",
            description: "Your order is being processed",
          },
          {
            date: "2024-01-06 09:45",
            status: "Shipped",
            location: "Mumbai",
            description: "Your order has been shipped",
          },
        ],
      },
    ],
    wishlist: ["2", "6"],
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }, [user])

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      // Remove password before storing in state
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword as User)
      return true
    }

    return false
  }

  const signUp = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      return false
    }

    // Create new user
    const newUser = {
      id: `user${mockUsers.length + 1}`,
      name,
      email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
      addresses: [],
      orders: [],
      wishlist: [],
    }

    // In a real app, we would save this to a database
    // For now, we'll just set it in state
    setUser(newUser)
    return true
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const addToWishlist = (productId: string) => {
    if (!user) return

    if (!user.wishlist.includes(productId)) {
      setUser({
        ...user,
        wishlist: [...user.wishlist, productId],
      })
    }
  }

  const removeFromWishlist = (productId: string) => {
    if (!user) return

    setUser({
      ...user,
      wishlist: user.wishlist.filter((id) => id !== productId),
    })
  }

  const isInWishlist = (productId: string) => {
    return user?.wishlist.includes(productId) || false
  }

  const createOrder = (orderData: Partial<Order>) => {
    if (!user) throw new Error("User not authenticated")

    // Generate order ID
    const orderId = `order${user.orders.length + 1}`

    // Create tracking events
    const trackingEvents = [
      {
        date: new Date().toLocaleString(),
        status: "Order Placed",
        location: orderData.shippingAddress?.city || "Unknown",
        description: "Your order has been placed successfully",
      },
    ]

    // Generate tracking number
    const trackingNumber = `IND${Math.floor(100000000 + Math.random() * 900000000)}`

    // Create new order
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      status: "pending",
      items: orderData.items || [],
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || "Credit Card",
      shippingAddress: orderData.shippingAddress as Address,
      trackingNumber,
      trackingEvents,
    }

    // Add order to user
    setUser({
      ...user,
      orders: [...user.orders, newOrder],
    })

    return orderId
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    if (!user) return

    const updatedOrders = user.orders.map((order) => {
      if (order.id === orderId) {
        // Add new tracking event
        const newEvent = {
          date: new Date().toLocaleString(),
          status: status.charAt(0).toUpperCase() + status.slice(1),
          location: order.shippingAddress.city,
          description: `Your order has been ${status}`,
        }

        return {
          ...order,
          status,
          trackingEvents: [...(order.trackingEvents || []), newEvent],
        }
      }
      return order
    })

    setUser({
      ...user,
      orders: updatedOrders,
    })
  }

  const getOrderById = (orderId: string) => {
    if (!user) return undefined

    return user.orders.find((order) => order.id === orderId)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

