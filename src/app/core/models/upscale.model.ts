export interface UpscaleModel {
  imageUrl: string;
}

export interface UpscaleModelResponse {
  success: boolean
  originalImage: string
  improvedImage: string
  status: string
  processedAt: string
}
