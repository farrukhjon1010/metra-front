export interface User {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface Avatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  imageURL: string;
  createdAt: string;
  user: User;
}

export interface CreateAvatarDto {
  userId?: string;
  name: string;
  gender: 'male' | 'female';
  images: string[];
}

export interface UpdateAvatarDto {
  name?: string;
  gender?: 'male' | 'female';
  imageURL?: string;
}
