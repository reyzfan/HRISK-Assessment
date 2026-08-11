"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type TargetForm = {
  name: string;
  email: string;
  department: string;
  position: string;
};

const emptyForm: TargetForm = {
  name: "",
  email: "",
  department: "",
  position: "",
};

export function TargetManager({ targets }: { targets: TargetRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState<TargetForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const canSaveTarget =
    form.name.trim().length >= 2 &&
    form.email.trim().includes("@") &&
    form.department.trim().length >= 2;

  function startEdit(target: TargetRow) {
    setEditingId(target.id);
    setForm({
      name: target.name,
      email: target.email,
      department: target.department,
      position: target.position ?? "",
    });
    setMessage(null);
    setError(null);
  }

  function clearForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
    setError(null);
  }

  async function submitTarget() {
    setError(null);
    setMessage(null);

    if (!canSaveTarget) {
      setError("Isi nama, email valid, dan department sebelum menyimpan target.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = editingId ? `/api/targets/${editingId}` : "/api/targets";
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { action: "update", ...form } : form;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: unknown = await response.json();
      if (!response.ok) {
        const text = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Failed to save target.";
        throw new Error(text);
      }

      setMessage(editingId ? "Target updated." : "Target added.");
      clearForm();
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to save target.");
    } finally {
      setLoading(false);
    }
  }

  async function resetRisk(targetId: string) {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/targets/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-risk" }),
      });

      if (!response.ok) throw new Error("Failed to reset risk score.");
      setMessage("Risk score reset to 50.");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to reset risk score.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Target" : "Add Target"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} />
          </div>

          {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {message && <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">{message}</p>}

          <div className="flex gap-2">
            <Button onClick={submitTarget} disabled={loading || !canSaveTarget}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingId ? <Save className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {loading ? "Saving..." : editingId ? "Save" : "Add"}
            </Button>
            {editingId && <Button variant="secondary" onClick={clearForm}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Targets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {targets.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Belum ada target. Tambahkan karyawan test terlebih dahulu untuk membuat campaign.
            </div>
          ) : (
            targets.map((target) => (
              <div key={target.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
                <div>
                  <p className="font-medium">{target.name}</p>
                  <p className="text-sm text-muted-foreground">{target.email}</p>
                  <p className="text-xs text-muted-foreground">{target.department} · {target.position ?? "Employee"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getRiskBgColor(target.riskScore)} variant="outline">
                    {target.riskScore} · {getRiskLevel(target.riskScore)}
                  </Badge>
                  <Button size="sm" variant="secondary" onClick={() => startEdit(target)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => resetRisk(target.id)} disabled={loading}>
                    <RotateCcw className="mr-1 h-3 w-3" /> Reset Risk
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
