"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth" 
import { Button } from "@/components/ui/button"
import data from "./data.json"

import EquipePage from "./pages/equipe/page"

export default function Page() {
  const { data: session } = useSession()
  const [activeItem, setActiveItem] = useState("Général")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar 
        variant="inset" 
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {activeItem === "Général" && (
                <>
                  
                  {/* <DataTable data={data} /> */}
                </>
              )}
              {activeItem === "Équipe" && (
                <EquipePage />
              )}
              {activeItem === "Projets" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Section Projets</h2>
                  <p>Contenu des projets à ajouter ici...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}