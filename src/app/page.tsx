"use client"

import { useState, useEffect } from "react"
import { WelcomeScreen } from "./components/WelcomeScreen"
import { AddictionSetup } from "./components/AddictionSetup"
import { Dashboard } from "./components/Dashboard"
import { AddictionDetail } from "./components/AddictionDetail"
import { SettingsScreen } from "./components/SettingsScreen"
import { AIChatScreen } from "./components/AIChatScreen"
import { PremiumScreen } from "./components/PremiumScreen"
import { Addiction } from "./types"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "setup" | "dashboard" | "detail" | "settings" | "chat" | "premium">("welcome")
  const [addictions, setAddictions] = useState<Addiction[]>([])
  const [selectedAddiction, setSelectedAddiction] = useState<Addiction | null>(null)
  const [settings, setSettings] = useState({
    currency: "BRL",
    language: "pt-BR",
    theme: "light",
    accentColor: "blue",
    progressNotifications: true,
    dailyQuoteNotifications: true,
    progressFormat: "circle" as "circle" | "line"
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedAddictions = localStorage.getItem("addictions")
    const savedSettings = localStorage.getItem("settings")
    
    if (savedAddictions) {
      setAddictions(JSON.parse(savedAddictions))
      setCurrentScreen("dashboard")
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Salvar addictions no localStorage
  useEffect(() => {
    if (addictions.length > 0) {
      localStorage.setItem("addictions", JSON.stringify(addictions))
    }
  }, [addictions])

  // Salvar settings no localStorage
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  const handleStart = () => {
    setCurrentScreen("setup")
  }

  const handleAddictionComplete = (addiction: Addiction) => {
    setAddictions([...addictions, addiction])
    setCurrentScreen("dashboard")
  }

  const handleAddictionClick = (addiction: Addiction) => {
    setSelectedAddiction(addiction)
    setCurrentScreen("detail")
  }

  const handleBackToDashboard = () => {
    setSelectedAddiction(null)
    setCurrentScreen("dashboard")
  }

  const handleDeleteAddiction = (id: string) => {
    setAddictions(addictions.filter(a => a.id !== id))
    setCurrentScreen("dashboard")
  }

  const handleUpdateAddiction = (updatedAddiction: Addiction) => {
    setAddictions(addictions.map(a => a.id === updatedAddiction.id ? updatedAddiction : a))
    setSelectedAddiction(updatedAddiction)
  }

  const handleResetAddiction = (id: string) => {
    const addiction = addictions.find(a => a.id === id)
    if (addiction) {
      const resetAddiction = {
        ...addiction,
        startDate: new Date().toISOString(),
        relapses: []
      }
      setAddictions(addictions.map(a => a.id === id ? resetAddiction : a))
      setSelectedAddiction(resetAddiction)
    }
  }

  const handleOpenSettings = () => {
    setCurrentScreen("settings")
  }

  const handleCloseSettings = () => {
    setCurrentScreen("dashboard")
  }

  const handleAddNew = () => {
    setCurrentScreen("setup")
  }

  const handleOpenChat = () => {
    setCurrentScreen("chat")
  }

  const handleCloseChat = () => {
    setCurrentScreen("dashboard")
  }

  const handleOpenPremium = () => {
    setCurrentScreen("premium")
  }

  const handleClosePremium = () => {
    setCurrentScreen("dashboard")
  }

  return (
    <div className={`min-h-screen ${settings.theme === "dark" ? "bg-gray-950" : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"}`}>
      {currentScreen === "welcome" && (
        <WelcomeScreen onStart={handleStart} accentColor={settings.accentColor} />
      )}
      
      {currentScreen === "setup" && (
        <AddictionSetup 
          onComplete={handleAddictionComplete}
          onBack={() => addictions.length > 0 ? setCurrentScreen("dashboard") : setCurrentScreen("welcome")}
          settings={settings}
        />
      )}
      
      {currentScreen === "dashboard" && (
        <Dashboard 
          addictions={addictions}
          settings={settings}
          onAddictionClick={handleAddictionClick}
          onOpenSettings={handleOpenSettings}
          onAddNew={handleAddNew}
          onOpenChat={handleOpenChat}
        />
      )}
      
      {currentScreen === "detail" && selectedAddiction && (
        <AddictionDetail 
          addiction={selectedAddiction}
          settings={settings}
          onBack={handleBackToDashboard}
          onDelete={handleDeleteAddiction}
          onUpdate={handleUpdateAddiction}
          onReset={handleResetAddiction}
        />
      )}
      
      {currentScreen === "settings" && (
        <SettingsScreen 
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={handleCloseSettings}
          onOpenPremium={handleOpenPremium}
        />
      )}

      {currentScreen === "chat" && (
        <AIChatScreen
          settings={settings}
          addictions={addictions}
          onClose={handleCloseChat}
        />
      )}

      {currentScreen === "premium" && (
        <PremiumScreen
          settings={settings}
          onClose={handleClosePremium}
        />
      )}
    </div>
  )
}
