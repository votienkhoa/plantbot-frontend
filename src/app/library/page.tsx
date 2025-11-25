"use client"
import {useMemo, useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card} from "@/components/ui/card"
import {ChevronLeft, Leaf, Search} from "lucide-react"
import Link from "next/link"
import PlantDetailModal from "@/components/library/PlantDetailModal"

interface Plant {
    id: string
    commonName: string
    scientificName: string
    description: string
    image: string
}

const PLANTS_DATA: Plant[] = [
    {
        id: "1",
        commonName: "Monstera Deliciosa",
        scientificName: "Rhaphidophora tetrasperma",
        description:
            "A stunning tropical plant with distinctive split leaves. Perfect for indoor spaces with bright, indirect light.",
        image: "/Abroma_augustum_0004.jpg",
    },
    {
        id: "2",
        commonName: "Snake Plant",
        scientificName: "Sansevieria trifasciata",
        description:
            "An extremely hardy succulent with striking vertical leaves. Thrives in low light and requires minimal watering.",
        image: "/Acalypha_indica_0001.jpg",
    },
    {
        id: "3",
        commonName: "Pothos",
        scientificName: "Epipremnum aureum",
        description:
            "A versatile trailing plant with heart-shaped leaves. Excellent for hanging baskets and can tolerate various light conditions.",
        image: "/Adina_pilulifera_0008.jpg",
    },
    {
        id: "4",
        commonName: "Fiddle Leaf Fig",
        scientificName: "Ficus lyrata",
        description:
            "A dramatic statement plant with large, violin-shaped leaves. Requires bright light and consistent care for best results.",
        image: "/Aeginetia_indica_0004.jpg",
    },
    {
        id: "5",
        commonName: "Aloe Vera",
        scientificName: "Aloe barbadensis",
        description:
            "A medicinal succulent with gel-filled leaves. Perfect for sunny windowsills and requires minimal water.",
        image: "/Bombax_ceiba_0010.jpg",
    },
    {
        id: "6",
        commonName: "Rubber Plant",
        scientificName: "Ficus elastica",
        description:
            "A bold plant with large, glossy leaves. Grows quickly and makes an excellent focal point in any room.",
        image: "/Buddleja_officinalis_0001.jpg",
    },
    {
        id: "7",
        commonName: "Spider Plant",
        scientificName: "Chlorophytum comosum",
        description:
            "A classic houseplant with arching, striped leaves. Produces adorable baby plantlets and is extremely forgiving.",
        image: "/Canarium_bengalense_0001.jpeg",
    },
    {
        id: "8",
        commonName: "Peace Lily",
        scientificName: "Spathiphyllum wallisii",
        description:
            "An elegant plant with dark green leaves and white flowers. Thrives in low light and signals when it needs water.",
        image: "/Crinum_latifolium_0007.jpg",
    },
]

export default function PlantLibrary() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)

    const filteredPlants = useMemo(() => {
        return PLANTS_DATA.filter((plant) => {
            return plant.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plant.description.toLowerCase().includes(searchQuery.toLowerCase())
        })
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-secondary/5 to-transparent animate-rainbow opacity-50 pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-primary/20 backdrop-blur-xl bg-background/80 sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/chat">
                            <Button variant="ghost" className="text-foreground hover:bg-accent/10 rounded-xl transition-all">
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Back to Chat
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary">
                                <Leaf className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                                Plant Library
                            </span>
                        </div>
                        <div className="w-32" />
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-12">
                    {/* Search Bar Only */}
                    <div className="mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search plants by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-6 rounded-2xl border-2 border-primary/15 bg-white/90 dark:bg-background/90 backdrop-blur-sm focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary text-foreground placeholder:text-muted-foreground shadow-lg hover:shadow-xl transition-all text-base"
                            />
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-foreground/60">
                            Showing {filteredPlants.length} of {PLANTS_DATA.length} plants
                        </p>
                    </div>

                    {/* Plant Grid */}
                    {filteredPlants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPlants.map((plant) => (
                                <Card
                                    key={plant.id}
                                    onClick={() => setSelectedPlant(plant)}
                                    className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 cursor-pointer transition-all hover:shadow-2xl hover:scale-105 group rounded-2xl"
                                >
                                    {/* Plant Image */}
                                    <div className="relative h-55 overflow-hidden ">
                                        <img
                                            src={plant.image || "/placeholder.svg"}
                                            alt={plant.commonName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 space-y-3">
                                        {/* Names */}
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                                {plant.commonName}
                                            </h3>
                                            <p className="text-sm text-foreground/60 italic">{plant.scientificName}</p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">{plant.description}</p>

                                        {/* View Details Button */}
                                        <Button className="w-full bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent text-primary-foreground font-semibold rounded-xl h-10 transition-all mt-2">
                                            View Details
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Leaf className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-foreground mb-2">No plants found</h3>
                            <p className="text-foreground/60 mb-6">Try adjusting your search</p>
                            <Button
                                onClick={() => {
                                    setSearchQuery("")
                                }}
                                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-xl"
                            >
                                Reset Search
                            </Button>
                        </div>
                    )}
                </main>
            </div>

            {/* Plant Detail Modal */}
            <PlantDetailModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
        </div>
    )
}
