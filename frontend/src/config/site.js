// Site configuration — business details, branding, compliance
// No secret keys or API keys live here. API keys stay server-side only.

export const SITE_CONFIG = {
  name: "OS Resource Monitoring",
  shortName: "OSMonitor",
  description: "Real-time Linux system resource monitoring and alerting platform.",
  url: import.meta.env.VITE_SITE_URL || "https://os-resource-monitoring.example.com",
  supportEmail: "support@os-resource-monitoring.example.com",
  privacyEmail: "privacy@os-resource-monitoring.example.com",
  business: {
    name: "OS Resource Monitoring Ltd",
    address: "123 Monitoring Lane, Server City, SC 12345",
    email: "support@os-resource-monitoring.example.com",
    phone: "+1-555-0100",
    registrationNumber: "OSM-2026-0001",
    taxId: "OSM-TAX-2026-0001",
  },
  features: {
    emailVerification: true,
    passwordReset: true,
    dataDeletion: true,
    ageConsent: true,
    cookieConsent: true,
  },
  limits: {
    maxFileSizeMB: 10,
    rateLimitWindowSeconds: 60,
    rateLimitMaxRequests: 30,
  },
  // Minimum age for account creation (COPPA/GDPR-kids compliance)
  minimumAge: 13,
  // Supported locales
  defaultLocale: "en",
};

// Third-party SDK audit register — keep this current and minimal.
export const THIRD_PARTY_SDK_AUDIT = [
  {
    name: "Supabase JS client",
    purpose: "Database, authentication, realtime subscriptions",
    dataTypes: ["auth user profile", "system metrics", "alerts"],
    region: "US-East-1 (configurable)",
    necessity: "required",
    privacyPolicy: "https://supabase.com/privacy",
    lastAudited: "2026-11-24",
  },
  {
    name: "React Router",
    purpose: "Client-side navigation",
    dataTypes: [],
    region: "client-side only",
    necessity: "required",
    privacyPolicy: "https://reactrouter.com",
    lastAudited: "2026-11-24",
  },
  {
    name: "Recharts",
    purpose: "Data visualization charts",
    dataTypes: [],
    region: "client-side only",
    necessity: "required",
    privacyPolicy: "https://recharts.org",
    lastAudited: "2026-11-24",
  },
  {
    name: "Lucide React",
    purpose: "Icons",
    dataTypes: [],
    region: "client-side only",
    necessity: "optional",
    privacyPolicy: "https://lucide.dev",
    lastAudited: "2026-11-24",
  },
];

export default SITE_CONFIG;
