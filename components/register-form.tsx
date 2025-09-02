"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation du mot de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      setIsLoading(false)
      return
    }

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
        // Vous pouvez ajouter d'autres champs selon votre configuration
      })
      
      if (result.error) {
        setError(result.error.message as string)
      } else {
        router.push("/dashboard") // Ou rediriger vers une page de confirmation
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setError("")

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
    } catch (err) {
      setError("Erreur lors de l'inscription avec Google")
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Créer un compte</CardTitle>
          <CardDescription>
            Inscrivez-vous avec Google ou créez votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailRegister}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {isLoading ? "Inscription..." : "S'inscrire avec Google"}
                </Button>
              </div>
              
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Ou créer un compte avec
                </span>
              </div>
              
              {error && (
                <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-3">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Jean"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Dupont"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Au moins 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Inscription..." : "Créer mon compte"}
                </Button>
              </div>
              
              <div className="text-center text-sm">
                Vous avez déjà un compte ?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Se connecter
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        En créant un compte, vous acceptez nos{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
          Conditions d&apos;utilisation
        </a>{" "}
        et notre{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Politique de confidentialité
        </a>.
      </div>
    </div>
  )
}