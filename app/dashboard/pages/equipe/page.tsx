"use client";

import { use, useState, useCallback } from "react";
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
import { Plus, Trash } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { Team } from "@/type";
import { toast } from "sonner";
import Lottie from "lottie-react";
import animationData from "../../../../public/lottie/workflow.json";

export default function EquipePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [inputDeleteTeam, setInputDeleteTeam] = useState("");
  const [error, setError] = useState("");

  // Fonction helper pour récupérer les équipes avec les memberships
  const fetchTeamsWithMemberships = useCallback(async () => {
    const { data, error } = await authClient.organization.list();

    if (data && Array.isArray(data)) {
      const teamsWithMembership = await Promise.all(
        data.map(async (org) => {
          try {
            const membersResult =
              await authClient.organization.getFullOrganization({
                query: { organizationId: org.id },
              });

            console.log(`Membership pour ${org.name}:`, membersResult);

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

      setTeams(teamsWithMembership);
    } else if (data) {
      setTeams(data);
    }

    if (error) {
      console.error("Erreur API:", error);
    }
  }, []);

  const handleDeleteTeamModal = (teamId: string) => {
    setIsDeleteOpen(true);
    setSelectedTeamId(teamId);
  };

  const handleDeleteTeam = async (teamId: string) => {
    setIsLoading(true);
    await authClient.organization.delete({ organizationId: teamId });
    setIsDeleteOpen(false);
    await fetchTeamsWithMemberships();
  };

  const handleCreateTeam = async (name: string) => {
    setIsLoading(true);

    try {
      // Utiliser directement le client better-auth
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
        }
      } else {
        toast.success("Équipe créée avec succès");
        setIsOpen(false); // Fermer le dialog
        // Rafraîchir la liste des équipes avec memberships
        await fetchTeamsWithMemberships();
        // Ici tu pourrais ajouter une notification de succès
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTeamInviteModal = (teamId: string) => {
    setIsInviteOpen(true);
    setSelectedTeamId(teamId);
    setInviteEmail(""); // Reset email
  };

  useEffect(() => {
    console.log(
      "Équipes:",
      teams.map((team) => team.membership?.role)
    );
  }, [teams]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.trim() || !selectedTeamId) {
      console.error("Email et équipe requis");
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
      } else {
        console.log("Invitation envoyée avec succès:", data);
        setIsInviteOpen(false);
        setInviteEmail("");
        setSelectedTeamId("");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsInviteLoading(false);
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        await fetchTeamsWithMemberships();
      } catch (error) {
        console.error("Erreur lors de la récupération des équipes:", error);
      }
    };
    fetchTeams();
  }, [fetchTeamsWithMemberships]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div>
            <h1 className="text-2xl font-bold">Équipes</h1>
            <p className="text-muted-foreground">
              Gérez vos équipes et collaborateurs
            </p>
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
    </div>
  );
}
