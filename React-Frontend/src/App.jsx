"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import AddGame from "./components/AddGame"
import ViewGames from "./components/ViewGames"
import Purchases from "./components/Purchases"
import Settings from "./components/Settings"
import "./styles/GameStoreAdmin.css"

function App() {
  const [activeTab, setActiveTab] = useState("add-game")

  const renderContent = () => {
    switch (activeTab) {
      case "add-game":
        return <AddGame />
      case "view-games":
        return <ViewGames />
      case "purchases":
        return <Purchases />
      case "settings":
        return <Settings />
      default:
        return <AddGame />
    }
  }

  return (
    <div className="flex h-screen bg-[#111111]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#111111]">
        <div className="container mx-auto px-6 py-8">
          <h3 className="text-[#EDEDED] text-3xl font-medium">
            {activeTab.replace("-", " ").charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App

