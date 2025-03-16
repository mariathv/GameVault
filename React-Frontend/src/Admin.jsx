"use client"

import Sidebar from "./components/Sidebar"
import { Outlet } from "react-router-dom"
import "./styles/GameStoreAdmin.css"
import "./styles/Global.css"

function AdminApp() {
  return (
    <div className="flex h-screen bg-[#080C10]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#080C10]">
        <div className="container mx-auto px-6 py-8">
          <Outlet /> {/* ← This will render the nested route */}
        </div>
      </main>
    </div>
  )
}

export default AdminApp
