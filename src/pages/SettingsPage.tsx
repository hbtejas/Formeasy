import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";

export const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const [inviteEmail, setInviteEmail] = useState("");

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <section className="mb-6 rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-semibold">Profile</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-slate-500">Name</p>
            <Input value={user?.name ?? ""} readOnly />
          </div>
          <div>
            <p className="mb-1 text-sm text-slate-500">Email</p>
            <Input value={user?.email ?? ""} readOnly />
          </div>
          <div className="md:col-span-2">
            <p className="mb-1 text-sm text-slate-500">Change Password</p>
            <div className="grid gap-3 md:grid-cols-3">
              <Input placeholder="Current password" type="password" />
              <Input placeholder="New password" type="password" />
              <Input placeholder="Confirm password" type="password" />
            </div>
            <Button className="mt-3">Update Password</Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-semibold">Team</h2>
        <div className="mb-4 flex gap-2">
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite member by email"
          />
          <Button onClick={() => setInviteEmail("")}>Invite</Button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
            <span>{user?.email}</span>
            <span className="text-slate-500">Owner</span>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};
