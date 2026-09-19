"use client";

import { useConsent } from "@/components/consent/consent-provider";

export function FooterCookiesLink() {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="bg-transparent p-0 text-inherit hover:text-accent"
    >
      Cookies
    </button>
  );
}