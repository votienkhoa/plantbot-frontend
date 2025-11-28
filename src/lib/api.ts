// API Service for Plant RAG Backend
import type { Flow1Response, Flow2Response, Flow3Response, Message } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://thuonguyenvan-plant-recognition-with-q-a-system-backend.hf.space";

class PlantAPIService {
    /**
     * Flow 1: Classify plant from image
     */
    async classifyImage(imageFile: File): Promise<Flow1Response> {
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch(`${API_URL}/api/flow1/classify`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Flow 2 - Step 1: Identify plant from image
     */
    async identifyPlant(imageFile: File): Promise<{
        predictions: Array<{
            class_name: string;
            vietnamese_name: string;
            scientific_name: string;
            confidence: number;
        }>;
    }> {
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch(`${API_URL}/api/flow2/identify`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Flow 2 - Step 2: Ask question about selected plant
     */
    async askWithSelectedPlant(
        question: string,
        selectedPlant: string
    ): Promise<Flow2Response> {
        const url = new URL(`${API_URL}/api/flow2/ask`);
        url.searchParams.append("question", question);
        url.searchParams.append("selected_plant", selectedPlant);

        const response = await fetch(url.toString(), {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Flow 2 - Legacy: Ask question with image (one-step)
     * @deprecated Use identifyPlant() then askWithSelectedPlant() instead
     */
    async askWithImage(
        imageFile: File,
        question: string
    ): Promise<Flow2Response> {
        const formData = new FormData();
        formData.append("file", imageFile);

        const url = new URL(`${API_URL}/api/flow2/ask`);
        url.searchParams.append("question", question);

        const response = await fetch(url.toString(), {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Flow 3: Pure RAG question with query reformulation
     */
    async askQuestion(
        question: string,
        conversationHistory: Message[] = [],
        selectedPlant?: string  // NEW: Send selected plant context
    ): Promise<Flow3Response> {
        // Build history in API format
        const history = conversationHistory.slice(-6).map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content,
        }));

        const response = await fetch(`${API_URL}/api/flow3/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question,
                conversation_history: history,
                top_k: 8,
                selected_plant: selectedPlant,  // NEW: Include selected plant
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    /**
   * Get plant images from backend
   */
    async getPlantImages(className: string): Promise<string[]> {
        try {
            console.log(`[API] Fetching images for class: "${className}"`);
            const response = await fetch(`${API_URL}/api/plants/${className}/images`);

            if (!response.ok) {
                console.error("Failed to load images for", className, "Status:", response.status);
                return [];
            }

            const data = await response.json();
            console.log(`[API] Response for "${className}":`, data);
            return data.image_urls || [];
        } catch (error) {
            console.error("Error loading images:", error);
            return [];
        }
    }

    /**
     * Health check
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/health`, {
                method: "GET",
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Export singleton instance
export const plantAPI = new PlantAPIService();
