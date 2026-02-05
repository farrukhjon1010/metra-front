export interface TokenBalance {
  id: string
  balance: number
  user: User
}

export interface User {
  id: string
  telegramId: string
  username: string
  firstName: string
  lastName: string
  isBlocked: boolean
  createdAt: string
}
