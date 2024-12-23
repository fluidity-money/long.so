import posthog from "posthog-js";

declare global {
  interface Window {
    env: {
      NEXT_PUBLIC_POSTHOG_KEY?: string;
      NEXT_PUBLIC_POSTHOG_HOST?: string;
    };
  }
}

// Only initialize PostHog in the browser
if (typeof window !== "undefined") {
  const posthogKey =
    window.env?.NEXT_PUBLIC_POSTHOG_KEY ??
    process.env.NEXT_PUBLIC_POSTHOG_KEY ??
    "";

  const posthogHost =
    window.env?.NEXT_PUBLIC_POSTHOG_HOST ??
    process.env.NEXT_PUBLIC_POSTHOG_HOST ??
    "https://app.posthog.com";

  posthog.init(posthogKey, {
    api_host: posthogHost,
    // Disable autocapture since we want to manually track specific events
    autocapture: false,
    // Capture pageviews
    capture_pageview: true,
    // Disable session recording for privacy
    disable_session_recording: true,
  });
}

export default posthog;
