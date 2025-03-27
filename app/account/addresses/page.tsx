"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Home, Plus, Edit, Trash2 } from "lucide-react"

export default function AddressesPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [addresses, setAddresses] = useState(user?.addresses || [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<any>(null)

  // Form state
  const [name, setName] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("India")
  const [isDefault, setIsDefault] = useState(false)

  const resetForm = () => {
    setName("")
    setStreet("")
    setCity("")
    setState("")
    setPostalCode("")
    setCountry("India")
    setIsDefault(false)
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name || !street || !city || !state || !postalCode || !country) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newAddress = {
      id: `addr${addresses.length + 1}`,
      name,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    }

    // If this is set as default, update other addresses
    let updatedAddresses = [...addresses]
    if (isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }))
    }

    // Add new address
    setAddresses([...updatedAddresses, newAddress])

    toast({
      title: "Address added",
      description: "Your address has been added successfully",
    })

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditAddress = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name || !street || !city || !state || !postalCode || !country) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedAddress = {
      ...currentAddress,
      name,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    }

    // If this is set as default, update other addresses
    const updatedAddresses = addresses.map((addr) =>
      addr.id === currentAddress.id ? updatedAddress : isDefault ? { ...addr, isDefault: false } : addr,
    )

    setAddresses(updatedAddresses)

    toast({
      title: "Address updated",
      description: "Your address has been updated successfully",
    })

    resetForm()
    setIsEditDialogOpen(false)
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))

    toast({
      title: "Address deleted",
      description: "Your address has been deleted successfully",
    })
  }

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )

    toast({
      title: "Default address updated",
      description: "Your default address has been updated",
    })
  }

  const openEditDialog = (address: any) => {
    setCurrentAddress(address)
    setName(address.name)
    setStreet(address.street)
    setCity(address.city)
    setState(address.state)
    setPostalCode(address.postalCode)
    setCountry(address.country)
    setIsDefault(address.isDefault)
    setIsEditDialogOpen(true)
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Addresses</CardTitle>
            <CardDescription>Manage your shipping addresses</CardDescription>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>Add a new shipping address to your account</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddAddress} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Address Name</Label>
                  <Input
                    id="name"
                    placeholder="Home, Office, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Textarea id="street" value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isDefault">Set as default address</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Address</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Address</DialogTitle>
                <DialogDescription>Update your shipping address</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditAddress} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Address Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Home, Office, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-street">Street Address</Label>
                  <Textarea id="edit-street" value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input id="edit-city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-state">State</Label>
                    <Input id="edit-state" value={state} onChange={(e) => setState(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-postalCode">Postal Code</Label>
                    <Input id="edit-postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-country">Country</Label>
                    <Input id="edit-country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="edit-isDefault">Set as default address</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Address</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No addresses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 relative ${address.isDefault ? "border-primary" : ""}`}
                >
                  {address.isDefault && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Default
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-full">
                      <Home className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{address.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{address.street}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country}</p>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(address)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>

                        {!address.isDefault && (
                          <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

