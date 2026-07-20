import { getUserGroups } from "@/lib/actions/groups";
import { getVisitor, setVisitorName } from "@/lib/actions/visitor";
import { CreateGroupForm, JoinGroupForm } from "@/components/groups/group-forms";
import { GroupCard } from "@/components/groups/group-card";
import { NameGate } from "@/components/identity/name-gate";

export default async function GroupsPage() {
  const visitor = await getVisitor();

  if (!visitor) {
    const handleSetName = async (name: string) => {
      "use server";
      return await setVisitorName(name);
    };

    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto">
          <NameGate
            title="Pick a name first"
            description="Groups need something to put on the leaderboard. No account required."
            onSetName={handleSetName}
          />
        </div>
      </div>
    );
  }

  const groups = await getUserGroups(visitor.id);

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Groups</h1>
          <p className="text-muted-foreground">
            Create groups and compete with friends on private leaderboards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CreateGroupForm userId={visitor.id} />
          <JoinGroupForm userId={visitor.id} />
        </div>

        {groups.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  currentUserId={visitor.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven&apos;t joined any groups yet.</p>
            <p>Create one or join using an invite code!</p>
          </div>
        )}
      </div>
    </div>
  );
}
