"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings as SettingsIcon, RotateCcw, Trash2, Share2, Trophy, TrendingUp, Calendar as CalendarIcon, Clock } from "lucide-react"
import { Addiction, Settings } from "../types"
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AddictionDetailProps {
  addiction: Addiction
  settings: Settings
  onBack: () => void
  onDelete: (id: string) => void
  onUpdate: (addiction: Addiction) => void
  onReset: (id: string) => void
}

const emojiOptions = [
  "🚭", "🍺", "🎰", "📱", "🍔", "💊", "🛍️", "💻", "🎮", "☕", "🍷", "🚬", "💰", "📺", "🍕", "🍰"
]

// Sistema de gamificação progressiva infinita
const getGamificationLevel = (days: number) => {
  if (days < 1) return { level: 0, title: "Iniciante", emoji: "🌱", progress: 0, nextLevel: 1 }
  if (days < 3) return { level: 1, title: "Primeiro Passo", emoji: "👣", progress: (days / 3) * 100, nextLevel: 3 }
  if (days < 7) return { level: 2, title: "Determinado", emoji: "💪", progress: ((days - 3) / 4) * 100, nextLevel: 7 }
  if (days < 14) return { level: 3, title: "Guerreiro", emoji: "⚔️", progress: ((days - 7) / 7) * 100, nextLevel: 14 }
  if (days < 21) return { level: 4, title: "Campeão", emoji: "🏆", progress: ((days - 14) / 7) * 100, nextLevel: 21 }
  if (days < 30) return { level: 5, title: "Mestre", emoji: "🎖️", progress: ((days - 21) / 9) * 100, nextLevel: 30 }
  if (days < 60) return { level: 6, title: "Lenda", emoji: "⭐", progress: ((days - 30) / 30) * 100, nextLevel: 60 }
  if (days < 90) return { level: 7, title: "Titã", emoji: "💎", progress: ((days - 60) / 30) * 100, nextLevel: 90 }
  if (days < 180) return { level: 8, title: "Imortal", emoji: "👑", progress: ((days - 90) / 90) * 100, nextLevel: 180 }
  if (days < 365) return { level: 9, title: "Divino", emoji: "✨", progress: ((days - 180) / 185) * 100, nextLevel: 365 }
  
  // Sistema infinito: após 365 dias
  const yearsPassed = Math.floor(days / 365)
  const daysInCurrentYear = days % 365
  return { 
    level: 10 + yearsPassed, 
    title: `Transcendente ${yearsPassed > 0 ? `Ano ${yearsPassed + 1}` : ''}`, 
    emoji: "🌟", 
    progress: (daysInCurrentYear / 365) * 100, 
    nextLevel: (yearsPassed + 1) * 365 
  }
}

export function AddictionDetail({ addiction, settings, onBack, onDelete, onUpdate, onReset }: AddictionDetailProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [editedAddiction, setEditedAddiction] = useState(addiction)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(format(new Date(), "HH:mm"))

  const calculateProgress = () => {
    const start = new Date(addiction.startDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - start.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000)

    const progressPercent = Math.min((diffDays / 30) * 100, 100)

    return {
      days: diffDays,
      hours: diffHours,
      minutes: diffMinutes,
      seconds: diffSeconds,
      percent: Math.round(progressPercent)
    }
  }

  const [progress, setProgress] = useState(calculateProgress())

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(calculateProgress())
    }, 1000)
    return () => clearInterval(interval)
  }, [addiction])

  const handleSaveSettings = () => {
    onUpdate(editedAddiction)
    setShowSettings(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meu Progresso - Anti Vício",
        text: `Estou há ${progress.days} dias livre de ${addiction.name}! 💪`
      })
    }
  }

  const handleAddRelapse = () => {
    const today = new Date().toISOString()
    const updatedAddiction = {
      ...addiction,
      relapses: [...addiction.relapses, today]
    }
    onUpdate(updatedAddiction)
  }

  const isRelapseDay = (date: Date) => {
    return addiction.relapses.some(relapse => isSameDay(new Date(relapse), date))
  }

  const isSuccessDay = (date: Date) => {
    const start = new Date(addiction.startDate)
    const today = new Date()
    return date >= start && date <= today && !isRelapseDay(date)
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-400 to-blue-600",
      purple: "from-purple-400 to-purple-600",
      pink: "from-pink-400 to-pink-600",
      green: "from-green-400 to-green-600",
      orange: "from-orange-400 to-orange-600",
      red: "from-red-400 to-red-600"
    }
    return colors[color] || colors.blue
  }

  const getBgColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      red: "bg-red-500"
    }
    return colors[color] || colors.blue
  }

  // Gamificação
  const gamification = getGamificationLevel(progress.days)

  // Calendário melhorado
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay()

  // Relatórios
  const totalRelapses = addiction.relapses.length
  const successRate = progress.days > 0 ? ((progress.days - totalRelapses) / progress.days * 100).toFixed(1) : 100
  const longestStreak = progress.days - totalRelapses

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
            <ArrowLeft className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
          </Button>
          <div className="flex gap-2">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
                  <SettingsIcon className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
                </Button>
              </DialogTrigger>
              <DialogContent className={`max-w-md ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
                <DialogHeader>
                  <DialogTitle className={settings.theme === "dark" ? "text-white" : ""}>Configurações do Vício</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label className={settings.theme === "dark" ? "text-gray-300" : ""}>Nome</Label>
                    <Input
                      value={editedAddiction.name}
                      onChange={(e) => setEditedAddiction({ ...editedAddiction, name: e.target.value })}
                      className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}
                    />
                  </div>
                  <div>
                    <Label className={settings.theme === "dark" ? "text-gray-300" : ""}>Emoji</Label>
                    <Select value={editedAddiction.emoji} onValueChange={(value) => setEditedAddiction({ ...editedAddiction, emoji: value })}>
                      <SelectTrigger className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                        {emojiOptions.map((emoji) => (
                          <SelectItem key={emoji} value={emoji} className={settings.theme === "dark" ? "text-white" : ""}>
                            <span className="text-2xl">{emoji}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className={settings.theme === "dark" ? "text-gray-300" : ""}>Cor</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {["blue", "purple", "pink", "green", "orange", "red"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setEditedAddiction({ ...editedAddiction, color })}
                          className={`h-10 rounded-lg transition-all ${
                            editedAddiction.color === color ? "ring-4 ring-offset-2 ring-gray-400" : ""
                          }`}
                          style={{
                            backgroundColor:
                              color === "blue" ? "#3b82f6" :
                              color === "purple" ? "#a855f7" :
                              color === "pink" ? "#ec4899" :
                              color === "green" ? "#10b981" :
                              color === "orange" ? "#f97316" :
                              "#ef4444"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveSettings} className={settings.theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : ""}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleShare} variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
              <Share2 className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <Card className={`p-6 mb-6 bg-gradient-to-r ${getColorClass(addiction.color)} border-0 shadow-2xl`}>
          <div className="text-center text-white">
            <div className="text-6xl mb-4">{addiction.emoji}</div>
            <h2 className="text-3xl font-bold mb-2">{addiction.name}</h2>
            <p className="text-white/90 mb-6">
              {addiction.type === "vicio" ? "Vício" : "Mau Hábito"}
            </p>

            {/* Progress Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress.percent / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{progress.percent}%</span>
                  <span className="text-sm text-white/90">Progresso</span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-3xl font-bold">{progress.days}</div>
                <div className="text-sm text-white/90">Dias</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{progress.hours}</div>
                <div className="text-sm text-white/90">Horas</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{progress.minutes}</div>
                <div className="text-sm text-white/90">Minutos</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{progress.seconds}</div>
                <div className="text-sm text-white/90">Segundos</div>
              </div>
            </div>

            {/* Stats */}
            {addiction.losses.money && (
              <div className="bg-white/10 rounded-xl p-4 mb-2">
                <p className="text-sm text-white/90">Dinheiro economizado</p>
                <p className="text-2xl font-bold">
                  {settings.currency === "BRL" ? "R$" : "$"} {(addiction.losses.money * (progress.days / 30)).toFixed(2)}
                </p>
              </div>
            )}
            {addiction.losses.time && (
              <div className="bg-white/10 rounded-xl p-4 mb-2">
                <p className="text-sm text-white/90">Tempo recuperado</p>
                <p className="text-2xl font-bold">{addiction.losses.time} × {progress.days} dias</p>
              </div>
            )}
          </div>
        </Card>

        {/* Tabs: Gamificação, Relatórios, Calendário */}
        <Tabs defaultValue="gamification" className="mb-6">
          <TabsList className={`grid w-full grid-cols-3 ${settings.theme === "dark" ? "bg-gray-900" : ""}`}>
            <TabsTrigger value="gamification" className={settings.theme === "dark" ? "data-[state=active]:bg-gray-800 text-gray-300" : ""}>
              <Trophy className="w-4 h-4 mr-2" />
              Gamificação
            </TabsTrigger>
            <TabsTrigger value="reports" className={settings.theme === "dark" ? "data-[state=active]:bg-gray-800 text-gray-300" : ""}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="calendar" className={settings.theme === "dark" ? "data-[state=active]:bg-gray-800 text-gray-300" : ""}>
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendário
            </TabsTrigger>
          </TabsList>

          {/* Gamificação */}
          <TabsContent value="gamification">
            <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{gamification.emoji}</div>
                <h3 className={`text-2xl font-bold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Nível {gamification.level}: {gamification.title}
                </h3>
                <p className={`${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {progress.days} dias de progresso
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Progresso para próximo nível</span>
                  <span className={`font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                    {Math.round(gamification.progress)}%
                  </span>
                </div>
                <div className={`w-full h-4 rounded-full overflow-hidden ${settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${gamification.progress}%` }}
                  />
                </div>
                <p className={`text-sm mt-2 text-center ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Faltam {gamification.nextLevel - progress.days} dias para o próximo nível
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-xl text-center ${progress.days >= 1 ? "bg-gradient-to-r from-green-400 to-emerald-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">👣</div>
                  <div className={`text-xs font-semibold ${progress.days >= 1 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    1 Dia
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${progress.days >= 7 ? "bg-gradient-to-r from-blue-400 to-purple-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">⚔️</div>
                  <div className={`text-xs font-semibold ${progress.days >= 7 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    7 Dias
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${progress.days >= 30 ? "bg-gradient-to-r from-yellow-400 to-orange-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">🎖️</div>
                  <div className={`text-xs font-semibold ${progress.days >= 30 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    30 Dias
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${progress.days >= 90 ? "bg-gradient-to-r from-pink-400 to-rose-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">💎</div>
                  <div className={`text-xs font-semibold ${progress.days >= 90 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    90 Dias
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${progress.days >= 180 ? "bg-gradient-to-r from-indigo-400 to-purple-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">👑</div>
                  <div className={`text-xs font-semibold ${progress.days >= 180 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    180 Dias
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${progress.days >= 365 ? "bg-gradient-to-r from-amber-400 to-yellow-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">✨</div>
                  <div className={`text-xs font-semibold ${progress.days >= 365 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    1 Ano
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${progress.days >= 730 ? "bg-gradient-to-r from-cyan-400 to-blue-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">🌟</div>
                  <div className={`text-xs font-semibold ${progress.days >= 730 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    2 Anos
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${progress.days >= 1095 ? "bg-gradient-to-r from-violet-400 to-purple-500" : settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className="text-3xl mb-2">🏆</div>
                  <div className={`text-xs font-semibold ${progress.days >= 1095 ? "text-white" : settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                    3 Anos
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports">
            <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
              <h3 className={`text-xl font-bold mb-6 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                Estatísticas Detalhadas
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-blue-50"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.theme === "dark" ? "bg-blue-900" : "bg-blue-500"}`}>
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Dias Limpo</p>
                      <p className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>{progress.days}</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-green-50"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.theme === "dark" ? "bg-green-900" : "bg-green-500"}`}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Taxa de Sucesso</p>
                      <p className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>{successRate}%</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-orange-50"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.theme === "dark" ? "bg-orange-900" : "bg-orange-500"}`}>
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Maior Sequência</p>
                      <p className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>{longestStreak} dias</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-red-50"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.theme === "dark" ? "bg-red-900" : "bg-red-500"}`}>
                      <RotateCcw className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Recaídas</p>
                      <p className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>{totalRelapses}</p>
                    </div>
                  </div>
                </div>
              </div>

              {addiction.losses.money && (
                <div className={`p-4 rounded-xl mb-4 ${settings.theme === "dark" ? "bg-gray-800" : "bg-gradient-to-r from-green-50 to-emerald-50"}`}>
                  <h4 className={`font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>💰 Economia Financeira</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Gasto mensal anterior:</span>
                      <span className={`font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                        {settings.currency === "BRL" ? "R$" : "$"} {addiction.losses.money.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Economizado até agora:</span>
                      <span className={`font-bold text-green-600 ${settings.theme === "dark" ? "text-green-400" : ""}`}>
                        {settings.currency === "BRL" ? "R$" : "$"} {(addiction.losses.money * (progress.days / 30)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Projeção anual:</span>
                      <span className={`font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                        {settings.currency === "BRL" ? "R$" : "$"} {(addiction.losses.money * 12).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {addiction.losses.time && (
                <div className={`p-4 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-gradient-to-r from-blue-50 to-cyan-50"}`}>
                  <h4 className={`font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>⏰ Tempo Recuperado</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Tempo diário anterior:</span>
                      <span className={`font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>{addiction.losses.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Tempo total recuperado:</span>
                      <span className={`font-bold text-blue-600 ${settings.theme === "dark" ? "text-blue-400" : ""}`}>
                        {addiction.losses.time} × {progress.days} dias
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Calendário */}
          <TabsContent value="calendar">
            <Card className={`p-6 ${settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}`}>
              <div className="mb-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className={settings.theme === "dark" ? "hover:bg-gray-800 text-white" : ""}
                >
                  ←
                </Button>
                <h3 className={`text-lg font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className={settings.theme === "dark" ? "hover:bg-gray-800 text-white" : ""}
                >
                  →
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className={`text-center text-sm font-semibold ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((day) => {
                  const isSuccess = isSuccessDay(day)
                  const isRelapse = isRelapseDay(day)
                  const isTodayDate = isToday(day)
                  const isCurrentMonth = isSameMonth(day, currentMonth)

                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                        ${!isCurrentMonth ? settings.theme === "dark" ? "text-gray-700" : "text-gray-300" : ""}
                        ${isSuccess ? "bg-green-500 text-white font-bold" : ""}
                        ${isRelapse ? "bg-red-500 text-white font-bold" : ""}
                        ${!isSuccess && !isRelapse && isCurrentMonth ? settings.theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600" : ""}
                        ${isTodayDate ? "ring-2 ring-blue-500" : ""}
                      `}
                    >
                      {format(day, "d")}
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4 mt-6 text-sm justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Dias vencidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Recaídas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded ring-2 ring-blue-500"></div>
                  <span className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>Hoje</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            onClick={handleAddRelapse}
            variant="outline"
            className={`w-full ${settings.theme === "dark" ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800" : ""}`}
          >
            Registrar Recaída
          </Button>

          <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
            <DialogTrigger asChild>
              <Button variant="outline" className={`w-full ${settings.theme === "dark" ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800" : ""}`}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar
              </Button>
            </DialogTrigger>
            <DialogContent className={settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}>
              <DialogHeader>
                <DialogTitle className={settings.theme === "dark" ? "text-white" : ""}>Reiniciar Progresso?</DialogTitle>
              </DialogHeader>
              <p className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                Isso irá resetar todo o seu progresso. Tem certeza?
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetConfirm(false)} className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    onReset(addiction.id)
                    setShowResetConfirm(false)
                  }}
                  className={getBgColor(addiction.color)}
                >
                  Sim, Reiniciar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </Button>
            </DialogTrigger>
            <DialogContent className={settings.theme === "dark" ? "bg-gray-900 border-gray-800" : ""}>
              <DialogHeader>
                <DialogTitle className={settings.theme === "dark" ? "text-white" : ""}>Deletar Vício?</DialogTitle>
              </DialogHeader>
              <p className={settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                Isso irá remover permanentemente este vício. Tem certeza?
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className={settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(addiction.id)
                    setShowDeleteConfirm(false)
                  }}
                >
                  Sim, Deletar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
