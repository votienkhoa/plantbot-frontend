"use client";

import { useState, useEffect } from "react";
import PlantGallery from "./PlantGallery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PlantPrediction } from "@/lib/types";
import { plantAPI } from "@/lib/api";

interface PlantResultCardProps {
    prediction: PlantPrediction;
    rank: number;
    onSelect?: (prediction: PlantPrediction) => void;
}

export default function PlantResultCard({
    prediction,
    rank,
    onSelect,
}: PlantResultCardProps) {
    const [images, setImages] = useState<string[]>([]);

    // Load images when component mounts
    useEffect(() => {
        const loadImages = async () => {
            console.log(`Loading images for ${prediction.vietnamese_name} (rank ${rank})...`);
            try {
                const imgs = await plantAPI.getPlantImages(prediction.class_name);
                console.log(`Loaded ${imgs.length} images for ${prediction.vietnamese_name}`, imgs);
                setImages(imgs);
            } catch (error) {
                console.error(`Failed to load images for ${prediction.vietnamese_name}:`, error);
                setImages([]);
            }
        };
        loadImages();
    }, [prediction.class_name, prediction.vietnamese_name, rank]);

    // Medal emoji for top 3
    const getMedal = () => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `${rank}.`;
    };

    // Confidence color
    const getConfidenceColor = () => {
        if (prediction.confidence > 0.7) return "text-green-600 dark:text-green-400";
        if (prediction.confidence > 0.4) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    return (
        <Card className="p-2 space-y-1 hover:shadow-lg transition-shadow duration-200 w-full h-full flex flex-col">
            {/* Header - Ultra compact */}
            <div className="flex items-start justify-between gap-1 flex-shrink-0">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5 mb-0">
                        <span className="text-xs flex-shrink-0">{getMedal()}</span>
                        <h3 className="font-semibold text-[11px] line-clamp-1">
                            {prediction.vietnamese_name}
                        </h3>
                    </div>
                    <p className="text-[9px] text-muted-foreground italic line-clamp-1">
                        {prediction.scientific_name}
                    </p>
                </div>
                <div className={`font-bold text-[11px] flex-shrink-0 ${getConfidenceColor()}`}>
                    {(prediction.confidence * 100).toFixed(1)}%
                </div>
            </div>

            {/* Image Gallery - Ultra wide aspect */}
            <div className="relative w-full aspect-[2/1] rounded-md overflow-hidden flex-shrink-0">
                <PlantGallery images={images} plantName={prediction.vietnamese_name} />
            </div>

            {/* Description - Compact */}
            <div className="w-full flex-shrink-0 min-h-[45px]">
                <div className="text-[9px] font-medium text-primary mb-0">📝 Mô tả</div>
                <div className="max-h-10 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    <p className="text-muted-foreground text-[9px] leading-tight w-full break-words pr-0.5">
                        {prediction.summary?.description || "Chưa có thông tin mô tả"}
                    </p>
                </div>
            </div>

            {/* Select Button - Compact */}
            {onSelect && (
                <Button
                    onClick={() => onSelect(prediction)}
                    variant="default"
                    size="sm"
                    className="w-full text-[9px] h-6 py-0 mt-auto"
                >
                    ✓ Chọn
                </Button>
            )}
        </Card>
    );
}
