"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user } = useAuth()

  if (!user) {
    router.push("/auth/signin?redirect=/account")
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0">
          <Tabs defaultValue="profile" className="w-full" orientation="vertical">
            <TabsList className="flex flex-col h-auto w-full bg-muted p-0 rounded-md">
              <TabsTrigger
                value="profile"
                className="justify-start px-4 py-3 data-[state=active]:bg-background rounded-none data-[state=active]:border-l-2 data-[state=active]:border-primary"
                asChild
              >
                <Link href="/account/profile">Profile</Link>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="justify-start px-4 py-3 data-[state=active]:bg-background rounded-none data-[state=active]:border-l-2 data-[state=active]:border-primary"
                asChild
              >
                <Link href="/account/orders">Orders</Link>
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="justify-start px-4 py-3 data-[state=active]:bg-background rounded-none data-[state=active]:border-l-2 data-[state=active]:border-primary"
                asChild
              >
                <Link href="/account/addresses">Addresses</Link>
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="justify-start px-4 py-3 data-[state=active]:bg-background rounded-none data-[state=active]:border-l-2 data-[state=active]:border-primary"
                asChild
              >
                <Link href="/wishlist">Wishlist</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

