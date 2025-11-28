// API Types for Plant RAG Backend
export interface PlantPrediction {
  class_name: string;
  vietnamese_name: string;
  scientific_name: string;
  family?: string;  // Optional - not returned by Flow 2 identify
  confidence: number;
  summary?: {
    description?: string;
    uses?: string;
    usage?: string;
  };
}

export interface Flow1Response {
  predictions: PlantPrediction[];
}

export interface Flow2Response {
  identified_plant: PlantPrediction;
  answer: string;
  needs_rag: boolean;
  rag_context?: Array<{
    plant_name: string;
    similarity: number;
  }>;
}

export interface Flow3Response {
  question: string;
  answer: string;
  sources: Array<{
    plant_name: string;
    relevance: number;
  }>;
  used_rag: boolean;
  routing_reason?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  image?: File | string;
  plantResults?: PlantPrediction[];
  sources?: Array<{ plant_name: string; relevance?: number }>;
  selectedPlant?: string; // NEW: Track which plant user selected
}

export interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}
