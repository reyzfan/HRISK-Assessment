"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Loader2, PlusCircle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getRiskBgColor, getRiskLevel } from "@/lib/risk-score/calculate";

type TargetRow = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string | null;
  riskScore: number;
};

type GroupUserDraft = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
};

type SortKey = "name" | "users" | "risk" | "members";
type SortDirection = "asc" | "desc";
type GroupRow = {
  group: string;
  members: TargetRow[];
  averageRisk: number;
  memberNames: string;
};

const emptyDraft: Omit<GroupUserDraft, "id"> = {
  firstName: "",
  lastName: "",
  email: "",
  position: "",
};

export function UserGroupManager({ targets }: { targets: TargetRow[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [nextUserIndex, setNextUserIndex] = useState(1);
  const [draft, setDraft] = useState<Omit<GroupUserDraft, "id">>(emptyDraft);
  const [users, setUsers] = useState<GroupUserDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const groupedTargets = useMemo(() => {
    return targets.reduce<Record<string, TargetRow[]>>((groups, target) => {
      const key = target.department || "Ungrouped";
      groups[key] = [...(groups[key] ?? []), target];
      return groups;
    }, {});
  }, [targets]);

  const sortedGroups = useMemo<GroupRow[]>(() => {
    const rows = Object.entries(groupedTargets).map(([group, members]) => {
      const averageRisk = Math.round(
        members.reduce((sum, member) => sum + member.riskScore, 0) / members.length
      );
      const memberNames = members.map((member) => member.name).join(", ");

      return { group, members, averageRisk, memberNames };
    });

    return rows.sort((first, second) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "users") {
        return (first.members.length - second.members.length) * direction;
      }

      if (sortKey === "risk") {
        return (first.averageRisk - second.averageRisk) * direction;
      }

      const firstValue = sortKey === "members" ? first.memberNames : first.group;
      const secondValue = sortKey === "members" ? second.memberNames : second.group;
      return firstValue.localeCompare(secondValue) * direction;
    });
  }, [groupedTargets, sortDirection, sortKey]);

  const draftValid =
    draft.firstName.trim().length >= 2 &&
    draft.lastName.trim().length >= 2 &&
    draft.email.trim().includes("@") &&
    draft.position.trim().length >= 2;
  const canSave = groupName.trim().length >= 2 && users.length > 0;

  function addUser() {
    setError(null);

    if (!draftValid) {
      setError("Isi First Name, Last Name, Email, dan Position sebelum menambahkan user.");
      return;
    }

    setUsers((current) => [...current, { id: `draft-user-${nextUserIndex}`, ...draft }]);
    setNextUserIndex((current) => current + 1);
    setDraft(emptyDraft);
  }

  function updateSort(nextSortKey: SortKey) {
    if (sortKey === nextSortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection("asc");
  }

  function sortableHeader(label: string, key: SortKey) {
    const active = sortKey === key;

    return (
      <button
        type="button"
        onClick={() => updateSort(key)}
        className="inline-flex items-center gap-2 font-semibold hover:text-primary"
        aria-label={`Sort by ${label}`}
      >
        {label}
        <ChevronsUpDown className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
        {active && <span className="text-xs text-muted-foreground">{sortDirection === "asc" ? "↑" : "↓"}</span>}
      </button>
    );
  }

  function removeUser(id: string) {
    setUsers((current) => current.filter((user) => user.id !== id));
  }

  function closeModal() {
    setModalOpen(false);
    setGroupName("");
    setDraft(emptyDraft);
    setUsers([]);
    setNextUserIndex(1);
    setError(null);
  }

  async function saveChanges() {
    setError(null);
    setMessage(null);

    if (!canSave) {
      setError("Isi Group Name dan tambahkan minimal 1 user ke tabel.");
      return;
    }

    setLoading(true);

    try {
      for (const user of users) {
        const response = await fetch("/api/targets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${user.firstName.trim()} ${user.lastName.trim()}`,
            email: user.email.trim(),
            department: groupName.trim(),
            position: user.position.trim(),
          }),
        });

        const data: unknown = await response.json();
        if (!response.ok) {
          const text = typeof data === "object" && data && "error" in data
            ? String(data.error)
            : `Failed to save user ${user.email}.`;
          throw new Error(text);
        }
      }

      setMessage(`Saved ${users.length} user(s) to group ${groupName.trim()}.`);
      closeModal();
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to save group changes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button onClick={() => setModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Group
        </Button>
        {message && <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">{message}</p>}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3">{sortableHeader("Name", "name")}</th>
                  <th className="px-4 py-3">{sortableHeader("Users", "users")}</th>
                  <th className="px-4 py-3">{sortableHeader("Average Risk", "risk")}</th>
                  <th className="px-4 py-3">{sortableHeader("Members", "members")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedGroups.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No groups available. Click New Group to add your first group.
                    </td>
                  </tr>
                ) : (
                  sortedGroups.map(({ group, members, averageRisk }) => (
                    <tr key={group} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{group}</td>
                      <td className="px-4 py-3">{members.length}</td>
                      <td className="px-4 py-3">
                        <Badge className={getRiskBgColor(averageRisk)} variant="outline">
                          {averageRisk} · {getRiskLevel(averageRisk)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {members.slice(0, 3).map((member) => member.name).join(", ")}
                        {members.length > 3 ? ` +${members.length - 3} more` : ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
          <div className="w-full max-w-3xl rounded-lg bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-2xl font-bold tracking-tight">New Group</h2>
              <button className="text-muted-foreground hover:text-foreground" onClick={closeModal} type="button">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <Label htmlFor="group-name">Name:</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Group name"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" className="bg-red-500 hover:bg-red-600">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Bulk Import Users
                </Button>
                <button type="button" className="text-sm text-muted-foreground" disabled>
                  Download CSV Template
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_1.4fr_auto]">
                <Input
                  placeholder="First Name"
                  value={draft.firstName}
                  onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))}
                />
                <Input
                  placeholder="Last Name"
                  value={draft.lastName}
                  onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={draft.email}
                  onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                />
                <Input
                  placeholder="Position"
                  value={draft.position}
                  onChange={(event) => setDraft((current) => ({ ...current, position: event.target.value }))}
                />
                <Button type="button" className="bg-red-500 hover:bg-red-600" onClick={addUser}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="px-3 py-3 font-semibold">First Name</th>
                      <th className="px-3 py-3 font-semibold">Last Name</th>
                      <th className="px-3 py-3 font-semibold">Email</th>
                      <th className="px-3 py-3 font-semibold">Position</th>
                      <th className="px-3 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                          No data available in table
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-b last:border-0">
                          <td className="px-3 py-3">{user.firstName}</td>
                          <td className="px-3 py-3">{user.lastName}</td>
                          <td className="px-3 py-3">{user.email}</td>
                          <td className="px-3 py-3">{user.position}</td>
                          <td className="px-3 py-3">
                            <Button size="sm" variant="ghost" onClick={() => removeUser(user.id)}>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground">Showing {users.length} user(s) ready to save.</p>
              {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <Button type="button" variant="secondary" onClick={closeModal} disabled={loading}>
                Close
              </Button>
              <Button type="button" onClick={saveChanges} disabled={loading || !canSave}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
