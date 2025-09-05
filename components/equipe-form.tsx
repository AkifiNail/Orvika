"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface EquipeFormProps {
  onSubmit?: (name: string) => void
  isLoading?: boolean
   error?: string
}

export function EquipeForm({ onSubmit, isLoading = false, error: errorProps }: EquipeFormProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState(errorProps)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError("Le nom de l'équipe est requis")
      return
    }

    setError("")
    onSubmit?.(name.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-sm font-medium">
          Nom de l'équipe
        </Label>
        <Input
          id="name"
          placeholder="Ex: Équipe Marketing"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errorProps) setError("")
          }}
          className={errorProps ? "border-destructive" : ""}
          disabled={isLoading}
        />
        {errorProps && (
          <p className="text-sm text-destructive">{errorProps}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isLoading || !name.trim()}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Créer
        </Button>
      </div>
    </form>
  )
}
