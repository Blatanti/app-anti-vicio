'use client'

import { Calendar, TrendingUp, Trophy } from 'lucide-react'

interface Addiction {
  id: string
  name: string
  emoji: string
  color: string
  start_date: string
  relapses: number
}

interface AddictionBalloonProps {
  addiction: Addiction
  onClick: () => void
  onUrgencyClick: () => void
}

export default function AddictionBalloon({ addiction, onClick, onUrgencyClick }: AddictionBalloonProps) {
  const calculateDaysClean = () => {
    const start = new Date(addiction.start_date)
    const today = new Date()
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  const calculateLevel = () => {
    const days = calculateDaysClean()
    return Math.floor(days / 7) + 1
  }

  const calculateProgress = () => {
    const days = calculateDaysClean()
    const currentLevelDays = days % 7
    return (currentLevelDays / 7) * 100
  }

  const daysClean = calculateDaysClean()
  const level = calculateLevel()
  const progress = calculateProgress()

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Balão Principal - Clicável */}
      <div
        onClick={onClick}
        className="p-6 cursor-pointer"
      >
        {/* Header com Emoji */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-5xl">{addiction.emoji}</div>
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              Nível {level}
            </span>
          </div>
        </div>

        {/* Nome do Vício */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {addiction.name}
        </h3>

        {/* Barra de Progresso */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Progresso para Nível {level + 1}
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Dias Limpo
              </span>
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {daysClean}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Recaídas
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {addiction.relapses || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Botão de Urgência - Separado */}
      <div className="px-6 pb-6">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onUrgencyClick()
          }}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          🚨 URGÊNCIA
        </button>
      </div>
    </div>
  )
}
