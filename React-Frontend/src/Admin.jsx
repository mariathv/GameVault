"use client"

import Sidebar from "./components/SideBar"

import { Outlet } from "react-router-dom"
import "./styles/GameStoreAdmin.css"
import "./styles/Global.css"

function AdminApp() {
  return (
    <div className="flex h-screen bg-(--color-background-secondary)">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-(--color-background-secondary)">
        <div className="container mx-auto px-6 py-8">
          <Outlet /> {/* ← This will render the nested route */}
        </div>
      </main>
    </div>
  )
}

export default AdminApp
