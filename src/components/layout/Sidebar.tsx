import { FileText, LayoutTemplate, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const links = [
  { to: "/dashboard", label: "My Forms", icon: FileText },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/team", label: "Team", icon: Users }
];

export const Sidebar = () => (
  <aside className="hidden w-60 border-r border-slate-200 bg-white p-4 lg:block">
    <div className="mb-8 flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
        FP
      </div>
      <p className="font-semibold">Forms Pro</p>
    </div>

    <nav className="space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-brand-50 hover:text-brand-700",
                isActive && "bg-brand-50 text-brand-700"
              )
            }
          >
            <Icon className="size-4" />
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  </aside>
);
