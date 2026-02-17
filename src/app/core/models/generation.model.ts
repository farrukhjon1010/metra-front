export enum GenerationType {
  PHOTO_BY_STAGE = 'photo_by_state',
  PHOTO_BY_REFERENCE = 'photo_by_reference',
  PHOTO_ANIMATION = 'photo_animation',
  LIP_SYNC = 'lip_sync',
  WOMEN_STYLE = 'women_style',
  MEN_STYLE = 'men_style',
  NANO_BANANA = 'nano_banana',
  NANO_BANANA_PRO = 'nano_banana_pro',
}

export interface GenerateImageDto {
  type: GenerationType;
  prompt: string;
  image: string;
}

export interface GenerationResponse {
  status: string;
  processedImage: string;
  externalTaskId: string;
}

export interface CreateGenerationDto {
  type: GenerationType;
  prompt: string;
  imageURL: string;
  externalTaskId?: string;
}

export interface GenerationPromptResponse {
  type: string;
  prompt: string;
}
