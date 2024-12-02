// _components/CreateProductContext.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "react-day-picker"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ProductContextForm } from "./ProductContextForm/ProductContextForm"

export function CreateProductContext() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Product Strategy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product Strategy</DialogTitle>
        </DialogHeader>
        <ProductContextForm
          onSubmit={async (data) => {
            await createProductContext(data)
            setOpen(false)
            router.refresh() // Refresh server components
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
