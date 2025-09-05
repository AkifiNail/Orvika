"use client"

import { use, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EquipeForm } from "@/components/equipe-form"
import { Plus, Trash } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useEffect } from "react"
import { Team } from "@/type"

export default function EquipePage() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [teams, setTeams] = useState<Team[]>([])
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [selectedTeamId, setSelectedTeamId] = useState("")
    const [inviteEmail, setInviteEmail] = useState("")
    const [isInviteLoading, setIsInviteLoading] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    // Fonction helper pour récupérer les équipes avec les memberships
    const fetchTeamsWithMemberships = useCallback(async () => {
        const { data, error } = await authClient.organization.list()
        console.log("Données reçues de organization.list():", data)
        
        if (data && Array.isArray(data)) {
            const teamsWithMembership = await Promise.all(
                data.map(async (org) => {
                    try {
                        const membersResult = await authClient.organization.getFullOrganization({
                            query: { organizationId: org.id }
                        })
                        
                        console.log(`Membership pour ${org.name}:`, membersResult)
                        
                        const session = await authClient.getSession()
                        const userMembership = membersResult.data?.members?.find(
                            member => member.userId === session.data?.user?.id
                        )
                        
                        return {
                            ...org,
                            membership: userMembership ? { role: userMembership.role } : undefined
                        }
                    } catch (err) {
                        console.error(`Erreur lors de la récupération des membres pour ${org.name}:`, err)
                        return org
                    }
                })
            )
            
            setTeams(teamsWithMembership)
        } else if (data) {
            setTeams(data)
        }
        
        if (error) {
            console.error("Erreur API:", error)
        }
    }, [])


    const handleDeleteTeamModal = (teamId: string) => {
        setIsDeleteOpen(true)
        setSelectedTeamId(teamId)
    }

    const handleDeleteTeam = async (teamId: string) => {
        setIsLoading(true)
        await authClient.organization.delete({ organizationId: teamId })
        setIsDeleteOpen(false)
        await fetchTeamsWithMemberships()
    }

    const handleCreateTeam = async (name: string) => {
        setIsLoading(true)
        
        try {
            // Utiliser directement le client better-auth
            const { data, error } = await authClient.organization.create({
                name: name.trim(),
                slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            })
            
            if (error) {
                console.error("Erreur lors de la création:", error)
                // Ici tu pourrais afficher l'erreur à l'utilisateur
            } else {
                console.log("Équipe créée avec succès:", data)
                setIsOpen(false) // Fermer le dialog
                // Rafraîchir la liste des équipes avec memberships
                await fetchTeamsWithMemberships()
                // Ici tu pourrais ajouter une notification de succès
            }
        } catch (error) {
            console.error("Erreur:", error)
        } finally {
            setIsLoading(false)
        }
    }
    const handleTeamInviteModal = (teamId: string) => {
        setIsInviteOpen(true)
        setSelectedTeamId(teamId)
        setInviteEmail("") // Reset email
    }

    useEffect(() => {
        console.log("Équipes:", teams.map((team) => team.membership?.role))
    }, [teams])

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!inviteEmail.trim() || !selectedTeamId) {
            console.error("Email et équipe requis")
            return
        }

        setIsInviteLoading(true)
        
        try {
            const { data, error } = await authClient.organization.inviteMember({
                email: inviteEmail.trim(),
                role: "member",
                organizationId: selectedTeamId,
                resend: true,
            });
            
            if (error) {
                console.error("Erreur lors de l'invitation:", error)
            } else {
                console.log("Invitation envoyée avec succès:", data)
                setIsInviteOpen(false)
                setInviteEmail("")
                setSelectedTeamId("")
            }
        } catch (error) {
            console.error("Erreur:", error)
        } finally {
            setIsInviteLoading(false)
        }
    }
   
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                await fetchTeamsWithMemberships()
            } catch (error) {
                console.error("Erreur lors de la récupération des équipes:", error)
            }
        }
        fetchTeams()
    }, [fetchTeamsWithMemberships])

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Équipes</h1>
                    <p className="text-muted-foreground">Gérez vos équipes et collaborateurs</p>
                </div>
                
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Créer une équipe
                        </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Nouvelle équipe</DialogTitle>
                            <DialogDescription>
                                Créez une nouvelle équipe pour organiser vos collaborateurs.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="mt-4">
                            <EquipeForm 
                                onSubmit={handleCreateTeam}
                                isLoading={isLoading}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Liste des équipes existantes */}
            <div className="space-y-4">
                {teams.length === 0 ? (
                    <p className="text-muted-foreground">Aucune équipe pour le moment. Créez votre première équipe !</p>
                ) : (
                    teams.map((team) => (
                        <div key={team.id} className="p-4 border rounded-lg">
                            <h2 className="text-lg font-semibold">{team.name}</h2>
                            <p className="text-muted-foreground">Slug: {team.slug}</p>
                            {team.logo && <p>Logo: {team.logo}</p>}
                            <p className="text-sm text-muted-foreground">
                                Créée le: {team.createdAt.toLocaleDateString()}
                            </p>
                            <Button 
                                onClick={() => handleTeamInviteModal(team.id)}
                                variant="outline"
                                size="sm"
                                className="mt-2"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Inviter un membre
                            </Button>
                            {team.membership?.role === "owner" && 
                             <Button 
                                onClick={() => handleDeleteTeamModal(team.id)}
                                variant="outline"
                                size="sm"
                                className="mt-2"
                            >
                                <Trash className="w-4 h-4 mr-2" />
                               Supprimer l'équipe
                            </Button>
                            }
                            
                        </div>
                    ))
                )}
            </div>
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Inviter un membre</DialogTitle>
                        <DialogDescription>
                            Envoyez une invitation pour rejoindre cette équipe.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleInviteMember} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="invite-email">Adresse email</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                placeholder="exemple@email.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsInviteOpen(false)}
                                disabled={isInviteLoading}
                            >
                                Annuler
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isInviteLoading || !inviteEmail.trim()}
                            >
                                {isInviteLoading ? "Envoi..." : "Envoyer l'invitation"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Supprimer l'équipe</DialogTitle>
                    </DialogHeader> 
                    <Button variant="destructive" onClick={() => handleDeleteTeam(selectedTeamId)}>
                        Supprimer l'équipe
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}	