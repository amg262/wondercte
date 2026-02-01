import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserGroups } from "@/lib/actions/groups";
import { CreateGroupForm, JoinGroupForm } from "@/components/groups/group-forms";
import { GroupCard } from "@/components/groups/group-card";

export default async function GroupsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const groups = await getUserGroups(session.user.id);

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
          <CreateGroupForm userId={session.user.id} />
          <JoinGroupForm userId={session.user.id} />
        </div>

        {groups.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  currentUserId={session.user.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven't joined any groups yet.</p>
            <p>Create one or join using an invite code!</p>
          </div>
        )}
      </div>
    </div>
  );
}
