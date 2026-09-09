import "@testing-library/jest-dom/vitest";

// Minimal server env so modules that read `lib/env` don't throw during tests.
process.env.RESEND_API_KEY ||= "re_test_key";
process.env.EMAIL_FROM ||= "Divine Group <onboarding@resend.dev>";
process.env.QUOTE_INBOX ||= "test@example.com";
process.env.CONTACT_INBOX ||= "test@example.com";
process.env.NEXT_PUBLIC_SITE_URL ||= "http://localhost:3000";
process.env.UPLOAD_STRATEGY ||= "attach";
