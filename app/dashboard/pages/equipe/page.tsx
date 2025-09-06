"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EquipeForm } from "@/components/equipe-form";
import { Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Team } from "@/type";
import { toast } from "sonner";
import Lottie from "lottie-react";
import animationData from "../../../../public/lottie/workflow.json";
import EquipeData from "@/components/equipe-data";
import { Skeleton } from "@/components/ui/skeleton"; // Assurez-vous d'importer Skeleton

// Cache simple en mémoire
let teamsCache: Team[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function EquipePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initialisé à true pour montrer le chargement au début
  const [teams, setTeams] = useState<Team[]>(teamsCache || []);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [inputDeleteTeam, setInputDeleteTeam] = useState("");
  const [error, setError] = useState("");

  // Fonction helper pour récupérer les équipes avec les memberships
  const fetchTeamsWithMemberships = useCallback(async (force = false) => {
    // Utiliser le cache si disponible et pas expiré
    const now = Date.now();
    if (!force && teamsCache && now - lastFetchTime < CACHE_DURATION) {
      setTeams(teamsCache);
      setIsLoading(false); // Arrêter le chargement si on utilise le cache
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await authClient.organization.list();

      if (error) {
        console.error("Erreur API:", error);
        toast.error("Erreur lors du chargement des équipes");
        setIsLoading(false);
        return;
      }

      if (data && Array.isArray(data)) {
        const teamsWithMembership = await Promise.all(
          data.map(async (org) => {
            try {
              const membersResult =
                await authClient.organization.getFullOrganization({
                  query: { organizationId: org.id },
                });

              const session = await authClient.getSession();
              const userMembership = membersResult.data?.members?.find(
                (member: { userId: string; role: string }) =>
                  member.userId === session.data?.user?.id
              );

              return {
                ...org,
                membership: userMembership
                  ? { role: userMembership.role }
                  : undefined,
              };
            } catch (err) {
              console.error(
                `Erreur lors de la récupération des membres pour ${org.name}:`,
                err
              );
              return org;
            }
          })
        );

        // Mettre à jour le cache
        teamsCache = teamsWithMembership;
        lastFetchTime = Date.now();
        setTeams(teamsWithMembership);
      } else if (data) {
        // Mettre à jour le cache
        teamsCache = data;
        lastFetchTime = Date.now();
        setTeams(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes:", error);
      toast.error("Erreur lors du chargement des équipes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteTeamModal = (teamId: string) => {
    setIsDeleteOpen(true);
    setSelectedTeamId(teamId);
  };

  const handleDeleteTeam = async (teamId: string) => {
    setIsLoading(true);
    try {
      await authClient.organization.delete({ organizationId: teamId });
      toast.success("Équipe supprimée avec succès");
      // Invalider le cache
      teamsCache = null;
      await fetchTeamsWithMemberships(true);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'équipe");
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
    }
  };

  const handleCreateTeam = async (name: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.organization.create({
        name: name.trim(),
        slug: name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, ""),
      });

      if (error) {
        if (error.status === 400) {
          toast.error("Une équipe avec ce nom existe déjà 🚨");
          setError("Une équipe avec ce nom existe déjà ");
        } else {
          toast.error("Erreur lors de la création de l'équipe");
        }
      } else {
        toast.success("Équipe créée avec succès");
        setIsOpen(false);
        // Invalider le cache
        teamsCache = null;
        await fetchTeamsWithMemberships(true);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création de l'équipe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamInviteModal = (teamId: string) => {
    setIsInviteOpen(true);
    setSelectedTeamId(teamId);
    setInviteEmail(""); // Reset email
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.trim() || !selectedTeamId) {
      toast.error("Email et équipe requis");
      return;
    }

    setIsInviteLoading(true);

    try {
      const { data, error } = await authClient.organization.inviteMember({
        email: inviteEmail.trim(),
        role: "member",
        organizationId: selectedTeamId,
        resend: true,
      });

      if (error) {
        console.error("Erreur lors de l'invitation:", error);
        toast.error("Erreur lors de l'envoi de l'invitation");
      } else {
        toast.success("Invitation envoyée avec succès");
        setIsInviteOpen(false);
        setInviteEmail("");
        setSelectedTeamId("");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsInviteLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsWithMemberships();
  }, [fetchTeamsWithMemberships]);

  // Afficher un indicateur de chargement pendant le chargement initial
  if (isLoading && teams.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-around mb-6">
          <div className="flex flex-col gap-10 w-full">
            <div>
              <Skeleton className="h-10 w-64 mb-6" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div>
            <Skeleton className="w-80 h-80 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {teams.length > 0 ? (
        <EquipeData 
          equipe={teams} 
          onDeleteTeam={handleDeleteTeamModal}
          onInviteMember={handleTeamInviteModal}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex items-center justify-around mb-6">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="text-5xl font-bold mb-6">Équipes</h1>
              <p className="text-muted-foreground">
                Gérez une équipe pour collaborer avec vos collègues.
              </p>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 hover:cursor-pointer" variant="default">
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
                    error={error}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-140 h-140"
            />
          </div>
        </div>
      )}

      {/* Dialog pour inviter un membre */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inviter un membre</DialogTitle>
            <DialogDescription>
              Entrez l'adresse email de la personne que vous souhaitez inviter dans cette équipe.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInviteMember}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isInviteLoading}>
                {isInviteLoading ? "Envoi..." : "Inviter"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog pour supprimer une équipe */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'équipe</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette équipe? Cette action est irréversible.
              Tapez "{teams.find((team)  => team.id === selectedTeamId)?.name}" pour confirmer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                 placeholder={teams.find((team) => team.id === selectedTeamId)?.name || "Nom de l'équipe"}
                value={inputDeleteTeam}
                onChange={(e) => setInputDeleteTeam(e.target.value)}
              />
            </div>
          </div> 
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setInputDeleteTeam("");
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={inputDeleteTeam !== teams.find((team) => team.id === selectedTeamId)?.name || isLoading}
              onClick={() => handleDeleteTeam(selectedTeamId)}
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}