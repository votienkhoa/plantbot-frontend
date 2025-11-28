"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlantGalleryProps {
    images: string[];
    plantName: string;
}

export default function PlantGallery({ images, plantName }: PlantGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="relative w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No images available</p>
            </div>
        );
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-full group">
            {/* Image Container */}
            <div className="relative w-full h-full bg-muted rounded-md overflow-hidden">
                <Image
                    src={images[currentIndex]}
                    alt={`${plantName} - Image ${currentIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, 300px"
                />
            </div>

            {/* Navigation Buttons - Only show if multiple images */}
            {images.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full shadow-md h-8 w-8"
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Right Arrow */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full shadow-md h-8 w-8"
                        onClick={goToNext}
                        disabled={currentIndex === images.length - 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                        {currentIndex + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
}
