import { UserGroupManager } from "@/components/targets/user-group-manager";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function TargetsPage() {
  const targets = await prisma.target.findMany({
    orderBy: [{ department: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User and Group</h1>
        <p className="text-muted-foreground">
          Create groups, add users, and keep employee risk scoring organized.
        </p>
      </div>
      <UserGroupManager targets={targets} />
    </div>
  );
}
