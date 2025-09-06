type EquipeDataProps = {
  equipe: any[];
  onDeleteTeam: (teamId: string) => void;
  onInviteMember: (teamId: string) => void;
  isLoading: boolean;
};

export default function EquipeData({ equipe, onDeleteTeam, onInviteMember, isLoading }: EquipeDataProps) {
  return (
    <>
      {equipe.map((membre) => (
        <div key={membre.id} className="flex items-center justify-between p-2 border rounded">
          <p>{membre.name}</p>
          <div className="flex gap-2">
            <button onClick={() => onInviteMember(membre.id)}>Inviter</button>
            <button onClick={() => onDeleteTeam(membre.id)}>Supprimer</button>
          </div>
        </div>
      ))}
    </>
  );
}