"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Clock } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Addiction, Settings } from "../types"

interface AddictionSetupProps {
  onComplete: (addiction: Addiction) => void
  onBack: () => void
  settings: Settings
}

const addictionCategories = [
  { value: "alcool", label: "Álcool" },
  { value: "tabaco", label: "Tabaco" },
  { value: "jogos", label: "Jogos de Azar" },
  { value: "redes-sociais", label: "Redes Sociais" },
  { value: "comida", label: "Comida" },
  { value: "drogas", label: "Drogas" },
  { value: "compras", label: "Compras Compulsivas" },
  { value: "pornografia", label: "Pornografia" },
  { value: "outro", label: "Outro" }
]

const emojiOptions = [
  "🚭", "🍺", "🎰", "📱", "🍔", "💊", "🛍️", "💻", "🎮", "☕", "🍷", "🚬", "💰", "📺", "🍕", "🍰"
]

export function AddictionSetup({ onComplete, onBack, settings }: AddictionSetupProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    type: "vicio" as "vicio" | "habito",
    category: "",
    lossType: [] as string[],
    money: "",
    time: "",
    event: "",
    startDate: new Date(),
    startTime: format(new Date(), "HH:mm"),
    emoji: "🚭",
    color: "blue"
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      onBack()
    }
  }

  const handleComplete = () => {
    const addiction: Addiction = {
      id: Date.now().toString(),
      name: formData.name || formData.category,
      type: formData.type,
      category: formData.category,
      losses: {
        money: formData.money ? parseFloat(formData.money) : undefined,
        time: formData.time || undefined,
        event: formData.event || undefined
      },
      startDate: formData.startDate.toISOString(),
      startTime: formData.startTime,
      emoji: formData.emoji,
      color: formData.color,
      relapses: []
    }
    onComplete(addiction)
  }

  const toggleLossType = (type: string) => {
    if (formData.lossType.includes(type)) {
      setFormData({ ...formData, lossType: formData.lossType.filter(t => t !== type) })
    } else {
      setFormData({ ...formData, lossType: [...formData.lossType, type] })
    }
  }

  const canProceed = () => {
    if (step === 1) return formData.category !== ""
    if (step === 2) return formData.lossType.length > 0
    if (step === 3) return true
    return true
  }

  // Calendário
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay()

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Configurar Vício
            </h2>
            <span className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Passo {step} de {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className={`rounded-3xl shadow-xl p-6 sm:p-8 mb-6 ${settings.theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
          {/* Step 1: Seleção de Vício */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Qual é o seu vício ou mau hábito?
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                      Tipo
                    </Label>
                    <Select value={formData.type} onValueChange={(value: "vicio" | "habito") => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className={`w-full ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                        <SelectItem value="vicio" className={settings.theme === "dark" ? "text-white" : ""}>Vício</SelectItem>
                        <SelectItem value="habito" className={settings.theme === "dark" ? "text-white" : ""}>Mau Hábito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                      Categoria
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className={`w-full ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className={settings.theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
                        {addictionCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className={settings.theme === "dark" ? "text-white" : ""}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="emoji" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                      Emoji
                    </Label>
                    <Select value={formData.emoji} onValueChange={(value) => setFormData({ ...formData, emoji: value })}>
                      <SelectTrigger className={`w-full ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
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
                    <Label htmlFor="name" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                      Nome personalizado (opcional)
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ex: Meu desafio pessoal"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Identificação de Perdas */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  O que você perdeu por causa disso?
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button
                      type="button"
                      variant={formData.lossType.includes("money") ? "default" : "outline"}
                      onClick={() => toggleLossType("money")}
                      className={`flex-1 min-w-[120px] ${settings.theme === "dark" && !formData.lossType.includes("money") ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                    >
                      💰 Dinheiro
                    </Button>
                    <Button
                      type="button"
                      variant={formData.lossType.includes("time") ? "default" : "outline"}
                      onClick={() => toggleLossType("time")}
                      className={`flex-1 min-w-[120px] ${settings.theme === "dark" && !formData.lossType.includes("time") ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                    >
                      ⏰ Tempo
                    </Button>
                    <Button
                      type="button"
                      variant={formData.lossType.includes("event") ? "default" : "outline"}
                      onClick={() => toggleLossType("event")}
                      className={`flex-1 min-w-[120px] ${settings.theme === "dark" && !formData.lossType.includes("event") ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}`}
                    >
                      💔 Acontecimento
                    </Button>
                  </div>

                  {formData.lossType.includes("money") && (
                    <div>
                      <Label htmlFor="money" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                        Quanto dinheiro você gastava? (por mês)
                      </Label>
                      <Input
                        id="money"
                        type="number"
                        placeholder="Ex: 500"
                        value={formData.money}
                        onChange={(e) => setFormData({ ...formData, money: e.target.value })}
                        className={`w-full ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}`}
                      />
                    </div>
                  )}

                  {formData.lossType.includes("time") && (
                    <div>
                      <Label htmlFor="time" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                        Quanto tempo você perdia? (por dia)
                      </Label>
                      <Input
                        id="time"
                        placeholder="Ex: 3 horas"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className={`w-full ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}`}
                      />
                    </div>
                  )}

                  {formData.lossType.includes("event") && (
                    <div>
                      <Label htmlFor="event" className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                        Descreva o que você perdeu
                      </Label>
                      <Textarea
                        id="event"
                        placeholder="Ex: Perdi momentos importantes com minha família..."
                        value={formData.event}
                        onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                        className={`w-full min-h-[120px] ${settings.theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Data e Hora */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Quando você começou a mudança?
                </h3>
                
                <div className="space-y-6">
                  {/* Calendário Melhorado */}
                  <div>
                    <Label className={`text-base mb-3 block flex items-center gap-2 ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                      <CalendarIcon className="w-4 h-4" />
                      Data de início
                    </Label>
                    <div className={`p-4 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                      <div className="mb-4 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          className={settings.theme === "dark" ? "hover:bg-gray-700 text-white" : ""}
                        >
                          ←
                        </Button>
                        <h4 className={`text-base font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          className={settings.theme === "dark" ? "hover:bg-gray-700 text-white" : ""}
                        >
                          →
                        </Button>
                      </div>

                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                          <div key={day} className={`text-center text-xs font-semibold ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                          <div key={`empty-${i}`} />
                        ))}
                        {daysInMonth.map((day) => {
                          const isSelected = isSameDay(day, formData.startDate)
                          const isTodayDate = isToday(day)
                          const isCurrentMonth = isSameMonth(day, currentMonth)

                          return (
                            <button
                              key={day.toISOString()}
                              type="button"
                              onClick={() => setFormData({ ...formData, startDate: day })}
                              className={`
                                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                ${!isCurrentMonth ? settings.theme === "dark" ? "text-gray-700" : "text-gray-300" : ""}
                                ${isSelected ? "bg-blue-500 text-white font-bold scale-110" : ""}
                                ${!isSelected && isCurrentMonth ? settings.theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100" : ""}
                                ${isTodayDate && !isSelected ? "ring-2 ring-blue-500" : ""}
                              `}
                            >
                              {format(day, "d")}
                            </button>
                          )
                        })}
                      </div>

                      <div className={`mt-4 text-center text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Selecionado: {format(formData.startDate, "dd/MM/yyyy")}
                      </div>
                    </div>
                  </div>

                  {/* Horário Melhorado */}
                  <div>
                    <Label htmlFor="time" className={`text-base mb-3 block flex items-center gap-2 ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                      <Clock className="w-4 h-4" />
                      Horário
                    </Label>
                    <div className={`p-4 rounded-xl ${settings.theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                      <Input
                        id="time"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className={`w-full text-center text-2xl font-bold ${settings.theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`}
                      />
                      <p className={`text-center text-sm mt-3 ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Horário selecionado: {formData.startTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Personalização */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Personalize seu acompanhamento
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className={`text-base mb-2 block ${settings.theme === "dark" ? "text-gray-300" : ""}`}>
                      Escolha uma cor
                    </Label>
                    <div className="grid grid-cols-6 gap-2">
                      {["blue", "purple", "pink", "green", "orange", "red"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`h-12 rounded-xl transition-all ${
                            formData.color === color ? "ring-4 ring-offset-2 ring-gray-400 scale-110" : ""
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

                  {/* Preview */}
                  <div className={`p-6 rounded-2xl bg-gradient-to-r ${
                    formData.color === "blue" ? "from-blue-400 to-blue-600" :
                    formData.color === "purple" ? "from-purple-400 to-purple-600" :
                    formData.color === "pink" ? "from-pink-400 to-pink-600" :
                    formData.color === "green" ? "from-green-400 to-green-600" :
                    formData.color === "orange" ? "from-orange-400 to-orange-600" :
                    "from-red-400 to-red-600"
                  }`}>
                    <div className="text-center text-white">
                      <div className="text-5xl mb-3">{formData.emoji}</div>
                      <h4 className="text-xl font-bold">{formData.name || formData.category || "Seu Vício"}</h4>
                      <p className="text-sm text-white/90 mt-2">Preview do seu balão</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className={`flex-1 ${settings.theme === "dark" ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800" : ""}`}
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1"
            size="lg"
          >
            {step === totalSteps ? "Concluir" : "Próximo"}
            {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
