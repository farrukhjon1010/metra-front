export interface Scene {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const SCENES: Scene[] = [
  {
    id: 'home-portrait',
    name: 'Домашний портрет',
    description: 'Мягкий свет, уют, естественность',
    image: 'assets/images/home-portrait.png'
  },
  {
    id: 'studio-image',
    name: 'Студийный образ',
    description: 'Чистый фон, аккуратный свет',
    image: 'assets/images/studio-image.png'
  },
  {
    id: 'city-evening',
    name: 'Городской вечер',
    description: 'Уличный свет, глубина, атмосфера',
    image: 'assets/images/city-evening.png'
  },
  {
    id: 'winter-look',
    name: 'Зимний образ',
    description: 'Холодный свет, текстуры, объём',
    image: 'assets/images/winter-look.png'
  },
  {
    id: 'profile-avatar',
    name: 'Профиль / Аватар',
    description: 'Идеально для соцсетей',
    image: 'assets/images/profile-avatar.png'
  },
  {
    id: 'pair-duo',
    name: 'Пара / Duo',
    description: 'Два человека в одном кадре',
    image: 'assets/images/pair-duo.png'
  },
];
