"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PlantResultCard from "./PlantResultCard";
import type { PlantPrediction } from "@/lib/types";

interface PlantSelectionModalProps {
    predictions: PlantPrediction[];
    open: boolean;
    onSelect: (prediction: PlantPrediction) => void;
    onNoneMatch: () => void;
    onClose: () => void;
}

export default function PlantSelectionModal({
    predictions,
    open,
    onSelect,
    onNoneMatch,
    onClose,
}: PlantSelectionModalProps) {
    const handleSelectPlant = (prediction: PlantPrediction) => {
        onSelect(prediction);
        onClose();
    };

    const handleNoneMatch = () => {
        onNoneMatch();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col p-6">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        🏆 Kết quả nhận diện cây
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        💡 Tôi tìm được {predictions.length} cây giống với ảnh bạn gửi, bạn thấy cây nào phù hợp nhất?
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Results Grid */}
                <div className="flex-1 overflow-y-auto py-4 -mx-2 px-2">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 auto-rows-[310px]">
                        {predictions.map((prediction, index) => (
                            <div key={prediction.class_name} className="h-[310px]">
                                <PlantResultCard
                                    prediction={prediction}
                                    rank={index + 1}
                                    onSelect={handleSelectPlant}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer with None Match Button */}
                <div className="flex-shrink-0 pt-3 border-t">
                    <Button
                        onClick={handleNoneMatch}
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed hover:border-solid"
                    >
                        ❌ Không phải cây nào ở trên
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
