"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { deniedConsent, grantedConsent } from "@/components/GoogleAnalytics";
import { Button } from "./ui/button";

function gtag(...args: any[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(...args);
}

export default function CookieBanner() {
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  function denyCookies() {
    gtag("consent", "update", deniedConsent);
    window.localStorage.setItem("consentMode", JSON.stringify(deniedConsent));
    setShowConsentDialog(false);
  }

  function allowCookies() {
    gtag("consent", "update", grantedConsent);
    window.localStorage.setItem("consentMode", JSON.stringify(grantedConsent));
    setShowConsentDialog(false);
  }

  useEffect(() => {
    const consent = window.localStorage.getItem("consentMode");
    if (!consent) {
      setShowConsentDialog(true);
      return;
    }
    const consentMode = JSON.parse(consent) as
      | typeof grantedConsent
      | typeof deniedConsent;
    if (consentMode.ad_storage === "denied") {
      setShowConsentDialog(true);
      return;
    }
  }, []);

  if (!showConsentDialog) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-[72px] flex max-w-max flex-col items-center justify-between gap-4 rounded-lg bg-black p-3 shadow sm:flex-row md:mb-4 md:max-w-screen-sm md:px-4">
      <div className="text-center text-white">
        <Link target="_blank" href="https://static.long.so/privacy-policy.pdf">
          <p>
            We use <span className="font-bold">cookies</span> on our site.
          </p>
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-md border-gray-900 px-5 py-2 text-gray-300"
          onClick={denyCookies}
        >
          Decline
        </button>
        <button
          className="rounded-lg bg-white px-5 py-2 text-black"
          onClick={allowCookies}
        >
          Allow Cookies
        </button>
      </div>
    </div>
  );
}
