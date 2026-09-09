import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendQuoteEmail } = vi.hoisted(() => ({ sendQuoteEmail: vi.fn() }));
vi.mock("@/lib/email/send-quote-email", () => ({ sendQuoteEmail }));
vi.mock("@/lib/turnstile", () => ({
  verifyTurnstile: vi.fn().mockResolvedValue(true),
}));

import { POST } from "./route";

function reqWith(fields: Record<string, string>): Request {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return new Request("http://test/api/quote", { method: "POST", body: fd });
}

const good: Record<string, string> = {
  name: "Ada Byron",
  email: "ada@example.com",
  phone: "555 123 4567",
  coverageInterest: "Cargo and auto liability for six trucks",
  consent: "true",
};

beforeEach(() => {
  sendQuoteEmail.mockReset();
  sendQuoteEmail.mockResolvedValue(undefined);
});

describe("POST /api/quote", () => {
  it("accepts a valid submission and sends the email", async () => {
    const res = await POST(reqWith(good));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendQuoteEmail).toHaveBeenCalledTimes(1);
  });

  it("silently drops a honeypot hit without sending", async () => {
    const res = await POST(reqWith({ ...good, company_website: "http://spam" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });

  it("rejects an invalid email with 400 and a field error", async () => {
    const res = await POST(reqWith({ ...good, email: "nope" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.fieldErrors.email).toBeTruthy();
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });

  it("returns 500 when the sender throws", async () => {
    sendQuoteEmail.mockRejectedValueOnce(new Error("resend down"));
    const res = await POST(reqWith(good));
    expect(res.status).toBe(500);
  });
});
