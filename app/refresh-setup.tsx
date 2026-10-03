"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function RefreshSetup() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button className="refresh" disabled={pending} onClick={() => startTransition(() => router.refresh())}>
      {pending ? "Checking connection…" : "Refresh connection status →"}
    </button>
  );
}
