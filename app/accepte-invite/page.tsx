"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { authClient, useSession } from "@/lib/auth-client"

export default function AccepteInvitPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session, isPending } = useSession()
    const [inviteId, setInviteId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [shouldAutoAccept, setShouldAutoAccept] = useState(false)
    
    const handleJoinTeam = useCallback(async ()  => {
        if (inviteId) {
            setIsLoading(true)
            try {
                const { data, error } = await authClient.organization.acceptInvitation({
                    invitationId: inviteId,
                })
                
                if (error) {
                    console.error("Erreur lors de l'acceptation:", error)
                    alert("Erreur lors de l'acceptation de l'invitation")
                } else {
                    console.log("Invitation acceptée avec succès:", data)
                    // Rediriger vers le dashboard après succès
                    router.push('/dashboard')
                }
            } catch (error) {
                console.error("Erreur:", error)
                alert("Erreur lors de l'acceptation de l'invitation")
            } finally {
                setIsLoading(false)
            }
        } else {
            console.log("Aucun ID d'invitation trouvé")
        }
    }, [inviteId, router])

    useEffect(() => {
        const id = searchParams.get('id')
        setInviteId(id)
        
        // Si pas d'ID après 3 secondes, rediriger vers le dashboard
        if (!id) {
            const timeout = setTimeout(() => {
                router.push('/register')
            }, 3000)
            
            return () => clearTimeout(timeout)
        }
    }, [searchParams, router])

    // Gérer l'authentification et l'auto-acceptation
    useEffect(() => {
        if (!isPending && inviteId) {
            if (!session) {
                // Pas connecté, rediriger vers login avec l'invite ID
                router.push(`/login?inviteId=${inviteId}`)
            } else if (shouldAutoAccept) {
                // Connecté et doit auto-accepter
                handleJoinTeam()
                setShouldAutoAccept(false)
            }
        }
        setIsLoading(isPending)
    }, [session, isPending, inviteId, shouldAutoAccept, handleJoinTeam, router])

    // Détecter si on revient de la connexion pour auto-accepter
    useEffect(() => {
        const autoAccept = searchParams.get('autoAccept')
        if (autoAccept === 'true' && session && inviteId) {
            setShouldAutoAccept(true)
        }
    }, [searchParams, session, inviteId])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Invitation à rejoindre une équipe</CardTitle>
                    <CardDescription>
                        Vous avez été invité à rejoindre une équipe
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {inviteId ? (
                        <div className="space-y-3">
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm font-medium text-blue-800">Code d'invitation</p>
                                <p className="text-xs text-blue-600 font-mono mt-1">{inviteId}</p>
                            </div>
                            {!session && !isPending && (
                                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-sm font-medium text-yellow-800">Connexion requise</p>
                                    <p className="text-xs text-yellow-600 mt-1">Vous allez être redirigé vers la page de connexion</p>
                                </div>
                            )}
                            {session && (
                                <div className="text-center text-sm text-gray-600">
                                    En cliquant sur "Rejoindre", vous acceptez de faire partie de cette équipe.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-red-800">Aucun code d'invitation trouvé</p>
                            <p className="text-xs text-red-600 mt-1">Vérifiez que le lien d'invitation est correct</p>
                            <p className="text-xs text-red-500 mt-2">Redirection vers le dashboard dans quelques secondes...</p>
                        </div>
                    )}
                    <Button 
                        onClick={handleJoinTeam}
                        className="w-full"
                        size="lg"
                        disabled={!inviteId || isLoading || !session}
                    >
                        {isLoading ? "Acceptation en cours..." : 
                         !session ? "Connexion requise" :
                         inviteId ? "Rejoindre l'équipe" : "Lien d'invitation invalide"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}