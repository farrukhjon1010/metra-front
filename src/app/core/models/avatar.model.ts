export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface GenerateAvatarDto {
  name: string;
  gender: Gender;
  imageFront: string;
  imageLeft: string;
  imageRight: string;
}

export interface AvatarResponse {
  success: boolean;
  images: string[]; 
}

export interface Avatar {
  id: string;
  name: string;
  gender: string;
  imagesURL: string[];
  userId: string;
  user?: any; 
}

export interface CreateAvatarDto {
  userId: string;
  name: string;
  gender: string;
  imagesURL: string[];
}

export interface UpdateAvatarDto {
  name?: string;
  gender?: string;
  imageURL?: string;
}