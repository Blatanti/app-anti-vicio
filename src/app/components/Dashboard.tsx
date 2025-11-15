"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MoreVertical, Plus, Share2, MessageCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Addiction, Settings } from "../types"

interface DashboardProps {
  addictions: Addiction[]
  settings: Settings
  onAddictionClick: (addiction: Addiction) => void
  onOpenSettings: () => void
  onAddNew: () => void
  onOpenChat: () => void
}

const motivationalQuotes = [
  "Cada dia livre é uma vitória! Continue forte! 💪",
  "Você é mais forte do que imagina! 🌟",
  "O progresso pode ser lento, mas nunca desista! 🚀",
  "Sua determinação é inspiradora! Continue assim! ✨",
  "Cada momento conta. Você está no caminho certo! 🎯",
  "Acredite em você. Você consegue! 💫",
  "Sua jornada é única e valiosa! 🌈",
  "Força e coragem! Você não está sozinho! 🤝",
  "Celebre cada pequena vitória! 🎉",
  "Você está construindo um futuro melhor! 🌅"
]

export function Dashboard({ addictions, settings, onAddictionClick, onOpenSettings, onAddNew, onOpenChat }: DashboardProps) {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)
  }, [])

  const calculateProgress = (addiction: Addiction) => {
    const start = new Date(addiction.startDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - start.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000)

    // Progresso baseado em 30 dias (100%)
    const progressPercent = Math.min((diffDays / 30) * 100, 100)

    return {
      days: diffDays,
      hours: diffHours,
      minutes: diffMinutes,
      seconds: diffSeconds,
      percent: Math.round(progressPercent)
    }
  }

  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Anti Vício",
        text: quote
      })
    }
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      pink: "from-pink-500 to-pink-600",
      green: "from-green-500 to-green-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600"
    }
    return colors[color] || colors.blue
  }

  const getAccentGradient = (color: string) => {
    const gradients: Record<string, string> = {
      blue: "from-blue-500 via-cyan-500 to-blue-600",
      purple: "from-purple-500 via-pink-500 to-purple-600",
      pink: "from-pink-500 via-rose-500 to-pink-600",
      green: "from-green-500 via-emerald-500 to-green-600",
      orange: "from-orange-500 via-amber-500 to-orange-600",
      red: "from-red-500 via-rose-500 to-red-600"
    }
    return gradients[color] || gradients.blue
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Anti Vício
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={settings.theme === "dark" ? "hover:bg-gray-800" : ""}>
                <MoreVertical className={settings.theme === "dark" ? "text-white" : "text-gray-800"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 ${settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}`}>
              <DropdownMenuItem onClick={handleShare} className={settings.theme === "dark" ? "text-white hover:bg-gray-700" : ""}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar Frase do Dia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenSettings} className={settings.theme === "dark" ? "text-white hover:bg-gray-700" : ""}>
                ⚙️ Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenChat} className={settings.theme === "dark" ? "text-white hover:bg-gray-700" : ""}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat de Apoio IA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Daily Quote */}
        <Card className={`p-6 mb-6 bg-gradient-to-r ${getAccentGradient(settings.accentColor)} border-0 shadow-xl`}>
          <div className="text-center">
            <p className="text-sm font-semibold text-white/90 mb-2">
              💬 Mensagem do Dia
            </p>
            <p className="text-lg font-medium text-white">
              {quote}
            </p>
          </div>
        </Card>

        {/* Addictions List */}
        {addictions.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className={`w-24 h-24 ${settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Plus className={`w-12 h-12 ${settings.theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                Nenhum vício cadastrado
              </h3>
              <p className={`${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Comece sua jornada adicionando seu primeiro desafio
              </p>
            </div>
            <Button onClick={onAddNew} size="lg" className={`rounded-full bg-gradient-to-r ${getAccentGradient(settings.accentColor)} text-white border-0 hover:opacity-90`}>
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Vício
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addictions.map((addiction) => {
              const progress = calculateProgress(addiction)
              return (
                <Card
                  key={addiction.id}
                  onClick={() => onAddictionClick(addiction)}
                  className={`p-6 cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-r ${getColorClass(addiction.color)} border-0`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{addiction.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {addiction.name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/90">
                          <span className="text-2xl font-bold">{progress.days}</span>
                          <span className="text-sm">dias</span>
                          <span className="text-xl font-semibold">{progress.hours}h</span>
                          <span className="text-xl font-semibold">{progress.minutes}m</span>
                          <span className="text-xl font-semibold">{progress.seconds}s</span>
                        </div>
                        
                        {settings.progressFormat === "line" ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-white/90">
                              <span>Progresso</span>
                              <span className="font-bold">{progress.percent}%</span>
                            </div>
                            <Progress value={progress.percent} className="h-3 bg-white/20" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="rgba(255,255,255,0.2)"
                                  strokeWidth="6"
                                  fill="none"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="white"
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 28}`}
                                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress.percent / 100)}`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{progress.percent}%</span>
                              </div>
                            </div>
                            <span className="text-sm text-white/90">Meta: 30 dias</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}

            {/* Add New Button */}
            <Button
              onClick={onAddNew}
              variant="outline"
              className={`w-full py-6 border-2 border-dashed hover:border-solid ${settings.theme === "dark" ? "border-gray-700 hover:border-gray-600 bg-gray-900 text-white hover:bg-gray-800" : ""}`}
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Novo Vício
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
