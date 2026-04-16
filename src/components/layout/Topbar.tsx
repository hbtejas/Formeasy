import { CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

type BuilderTopbarProps = {
  title: string;
  saveState: "idle" | "saving" | "saved";
  isPublished: boolean;
  onPublishToggle: () => void;
  onShare: () => void;
};

export const BuilderTopbar = ({
  title,
  saveState,
  isPublished,
  onPublishToggle,
  onShare
}: BuilderTopbarProps) => (
  <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
    <div className="flex items-center gap-4">
      <Link to="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
        Back
      </Link>
      <p className="font-medium">{title}</p>
      <p className="flex items-center gap-1 text-xs text-slate-500">
        {saveState === "saving" ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
        {saveState === "saving" ? "Saving..." : "Saved"}
      </p>
    </div>

    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        Preview
      </Button>
      <Button variant={isPublished ? "success" : "outline"} size="sm" onClick={onPublishToggle}>
        {isPublished ? "Published" : "Publish"}
      </Button>
      <Button size="sm" onClick={onShare}>
        Share
      </Button>
    </div>
  </header>
);
