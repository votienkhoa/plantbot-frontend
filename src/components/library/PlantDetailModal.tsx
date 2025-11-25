"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Plant {
  id: string
  commonName: string
  scientificName: string
  description: string
  image: string
}

interface PlantDetailModalProps {
  plant: Plant | null
  onClose: () => void
}

export default function PlantDetailModal({ plant, onClose }: PlantDetailModalProps) {
  if (!plant) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20 rounded-3xl shadow-2xl">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-background/80 backdrop-blur-sm hover:bg-background transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Plant Image */}
          <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img
              src={plant.image || "/placeholder.svg"}
              alt={plant.commonName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">{plant.commonName}</h2>
              <p className="text-lg text-foreground/60 italic">{plant.scientificName}</p>
            </div>

            {/* Description */}
            <p className="text-foreground/80 leading-relaxed text-lg">{plant.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-2xl h-12">
                Ask PlantBot
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 font-semibold rounded-2xl h-12 bg-transparent"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

