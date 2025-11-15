export interface Addiction {
  id: string
  name: string
  type: "vicio" | "habito"
  category: string
  losses: {
    money?: number
    time?: string
    event?: string
  }
  startDate: string
  startTime: string
  emoji: string
  color: string
  relapses: string[] // Array de datas de recaídas
}

export interface Settings {
  currency: string
  language: string
  theme: "light" | "dark"
  accentColor: string
  progressNotifications: boolean
  dailyQuoteNotifications: boolean
  progressFormat: "circle" | "line"
}
