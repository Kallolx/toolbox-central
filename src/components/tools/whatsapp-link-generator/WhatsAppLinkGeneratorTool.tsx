import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/CopyButton";

export function WhatsAppLinkGeneratorTool() {
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");

  const onGenerate = () => {
    const num = phone.replace(/\D/g, "");
    if (!num) return toast.error("Enter a phone number.");
    const url = `https://wa.me/${num}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
    setLink(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Phone number (with country code)</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="14155552671" className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Message (optional)</label>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder="Hi there!" className="w-full rounded-md border border-border-muted bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      </div>
      <button onClick={onGenerate} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover">Generate Link</button>
      {link && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <p className="break-all font-mono text-sm text-text-primary">{link}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <CopyButton value={link} className="flex-1 justify-center" />
            <a href={link} target="_blank" rel="noreferrer" className="flex-1 rounded-md border border-border-muted bg-surface-2 py-2 text-center text-sm font-medium hover:bg-surface">Open</a>
          </div>
        </div>
      )}
    </div>
  );
}
