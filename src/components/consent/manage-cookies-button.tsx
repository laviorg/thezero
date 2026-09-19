"use client";

import { Button } from "@/components/ui/button";
import { useConsent } from "@/components/consent/consent-provider";

export function ManageCookiesButton() {
  const { openPreferences } = useConsent();

  return (
    <Button type="button" variant="outline" size="sm" onClick={openPreferences}>
      Gerenciar cookies
    </Button>
  );
}
