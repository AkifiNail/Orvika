"use client"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { authClient, useSession } from "@/lib/auth-client"
import { motion } from "framer-motion"

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
        <div className="flex flex-col lg:flex-row min-h-screen items-center justify-center gap-8 lg:gap-20 p-4">
            <motion.div 
                className="text-center space-y-4 sm:space-y-6 w-full max-w-md px-4 sm:px-0"
                initial={{ opacity: 0, transform: "translateY(50px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.h1 
                    className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, transform: "translateY(30px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    Une invitation vous attend
                </motion.h1>
                
                <motion.p 
                    className="text-base sm:text-lg text-gray-600"
                    initial={{ opacity: 0, transform: "translateY(20px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                    Vous avez été invité à rejoindre une équipe
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, transform: "translateY(20px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                    {inviteId ? (
                        <div className="space-y-4">
                            {!session && !isPending && (
                                <p className="text-yellow-600">
                                    Connexion requise - Vous allez être redirigé vers la page de connexion
                                </p>
                            )}
                            {session && (
                                <p className="text-gray-600">
                                    En cliquant sur "Rejoindre", vous acceptez de faire partie de cette équipe.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-red-600">
                            <p>Aucun code d'invitation trouvé</p>
                            <p className="text-sm mt-1">Vérifiez que le lien d'invitation est correct</p>
                            <p className="text-sm mt-2">Redirection vers le dashboard dans quelques secondes...</p>
                        </div>
                    )}
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, transform: "translateY(20px) scale(0.95)" }}
                    animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                    whileHover={{ transform: "scale(1.02)" }}
                    whileTap={{ transform: "scale(0.98)" }}
                >
                    <Button 
                        onClick={handleJoinTeam}
                        className="w-full hover:cursor-pointer"
                        size="lg"
                        disabled={!inviteId || isLoading || !session}
                    >
                        {isLoading ? "Acceptation en cours..." : 
                         !session ? "Connexion requise" :
                         inviteId ? "Rejoindre l'équipe" : "Lien d'invitation invalide"}
                    </Button>
                </motion.div>
            </motion.div>
            
            <img src="/images/invitation.jpg" alt="Logo" className="w-42 h-42 sm:w-100 sm:h-100 lg:w-150 lg:h-150 object-cover rounded-lg" />
        </div>
    )
}