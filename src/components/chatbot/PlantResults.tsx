"use client";

import { useState } from "react";
import PlantResultCard from "./PlantResultCard";
import { Button } from "@/components/ui/button";
import type { PlantPrediction } from "@/lib/types";

interface PlantResultsProps {
    predictions: PlantPrediction[];
    onSelectPlant?: (prediction: PlantPrediction) => void;
    onNoneMatch?: () => void;
}

export default function PlantResults({
    predictions,
    onSelectPlant,
    onNoneMatch,
}: PlantResultsProps) {
    const [selectedPlant, setSelectedPlant] = useState<PlantPrediction | null>(null);

    if (!predictions || predictions.length === 0) {
        return null;
    }

    const handleSelectPlant = (prediction: PlantPrediction) => {
        setSelectedPlant(prediction);
        if (onSelectPlant) {
            onSelectPlant(prediction);
        }
    };

    // Show only selected plant
    if (selectedPlant) {
        return (
            <div className="space-y-4 my-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        ✓ Cây đã chọn
                    </h3>
                </div>

                <PlantResultCard
                    prediction={selectedPlant}
                    rank={1}
                    onSelect={undefined} // Hide select button for selected plant
                />
            </div>
        );
    }

    // Show all predictions
    return (
        <div className="space-y-3 my-4">
            {/* Header */}
            <div className="text-sm text-muted-foreground">
                💡 Tôi tìm được {predictions.length} cây giống với ảnh bạn gửi, bạn thấy cây nào phù hợp nhất?
            </div>

            {/* Results Grid - Fixed height items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                {predictions.map((prediction, index) => (
                    <div key={prediction.class_name} className="min-h-[420px] max-h-[420px]">
                        <PlantResultCard
                            prediction={prediction}
                            rank={index + 1}
                            onSelect={handleSelectPlant}
                        />
                    </div>
                ))}
            </div>

            {/* "None of these" Option */}
            {onNoneMatch && (
                <div className="pt-2">
                    <Button
                        onClick={onNoneMatch}
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed hover:border-solid text-sm"
                    >
                        ❌ Không phải cây nào ở trên
                    </Button>
                </div>
            )}

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground text-center italic">
                💡 Click vào cây để xem chi tiết và chọn!
            </p>
        </div>
    );
}
