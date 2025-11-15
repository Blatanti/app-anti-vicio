'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Settings, LogOut, Moon, Sun } from 'lucide-react'
import AddictionBalloon from './AddictionBalloon'
import AddictionSetup from './AddictionSetup'
import AddictionDetail from './AddictionDetail'
import SettingsScreen from './SettingsScreen/index'
import UrgencyPanel from './UrgencyPanel'

interface Addiction {
  id: string
  name: string
  emoji: string
  color: string
  start_date: string
  relapses: number
  user_id: string
}

export default function MainScreen({ user }: { user: any }) {
  const [addictions, setAddictions] = useState<Addiction[]>([])
  const [showSetup, setShowSetup] = useState(false)
  const [selectedAddiction, setSelectedAddiction] = useState<Addiction | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [urgencyAddiction, setUrgencyAddiction] = useState<Addiction | null>(null)

  useEffect(() => {
    loadAddictions()
    
    // Carregar preferência de tema
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const loadAddictions = async () => {
    const { data, error } = await supabase
      .from('addictions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setAddictions(data)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleUrgencyClick = (addiction: Addiction) => {
    setUrgencyAddiction(addiction)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Anti Vício</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50 transition-all"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50 transition-all"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50 transition-all"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Urgência */}
      {urgencyAddiction && (
        <UrgencyPanel
          addiction={urgencyAddiction}
          onClose={() => setUrgencyAddiction(null)}
        />
      )}

      {/* Mensagem do Dia */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">💪 Mensagem do Dia</h2>
          <p className="text-white/90 text-lg">
            "Cada dia limpo é uma vitória. Continue forte!"
          </p>
        </div>
      </div>

      {/* Balões de Vícios */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {addictions.map((addiction) => (
            <AddictionBalloon
              key={addiction.id}
              addiction={addiction}
              onClick={() => setSelectedAddiction(addiction)}
              onUrgencyClick={() => handleUrgencyClick(addiction)}
            />
          ))}

          {/* Botão Adicionar */}
          <button
            onClick={() => setShowSetup(true)}
            className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-md border-2 border-dashed border-white/40 dark:border-gray-600/50 rounded-3xl p-8 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[200px]"
          >
            <Plus className="w-12 h-12 text-white" />
            <span className="text-white font-semibold text-lg">Adicionar Vício</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showSetup && (
        <AddictionSetup
          onClose={() => setShowSetup(false)}
          onSave={() => {
            setShowSetup(false)
            loadAddictions()
          }}
          userId={user.id}
        />
      )}

      {selectedAddiction && (
        <AddictionDetail
          addiction={selectedAddiction}
          onClose={() => setSelectedAddiction(null)}
          onUpdate={loadAddictions}
          onUrgencyClick={() => {
            handleUrgencyClick(selectedAddiction)
            setSelectedAddiction(null)
          }}
        />
      )}

      {showSettings && (
        <SettingsScreen
          onClose={() => setShowSettings(false)}
          user={user}
        />
      )}
    </div>
  )
}
