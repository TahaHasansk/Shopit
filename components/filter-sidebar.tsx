import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

export function FilterSidebar() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        <Button variant="link" className="h-auto p-0 text-sm">
          Reset Filters
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="mb-4 font-medium">Price Range</h3>
          <div className="space-y-4">
            <Slider defaultValue={[50]} max={100000} step={1000} />
            <div className="flex items-center justify-between">
              <span className="text-sm">₹0</span>
              <span className="text-sm">₹100,000</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-medium">Condition</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="condition-new" />
              <Label htmlFor="condition-new">New</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="condition-used" />
              <Label htmlFor="condition-used">Used</Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-medium">Rating</h3>
          <RadioGroup defaultValue="4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r4" />
              <Label htmlFor="r4">4★ & above</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">3★ & above</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">2★ & above</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="mb-4 font-medium">Category</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="category-electronics" />
              <Label htmlFor="category-electronics">Electronics</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-clothing" />
              <Label htmlFor="category-clothing">Clothing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-home" />
              <Label htmlFor="category-home">Home</Label>
            </div>
          </div>
        </div>

        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  )
}

