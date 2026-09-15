import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendQuoteEmail, sendFullQuoteEmail } = vi.hoisted(() => ({
  sendQuoteEmail: vi.fn(),
  sendFullQuoteEmail: vi.fn(),
}));
vi.mock("@/lib/email/send-quote-email", () => ({
  sendQuoteEmail,
  sendFullQuoteEmail,
}));
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

// ---- full mode -----------------------------------------------------------------

function fullReq(
  fields: Record<string, string>,
  files: { name: string; file: File }[] = [],
): Request {
  const fd = new FormData();
  fd.set("mode", "full");
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  for (const { name, file } of files) fd.set(name, file);
  // Pass FormData straight through — avoids a slow multipart serialize/parse
  // round-trip in the test environment when File entries are present.
  return { formData: async () => fd } as unknown as Request;
}

const fullGood: Record<string, string> = {
  dotNumber: "1234567",
  companyName: "Byron Freight LLC",
  garagingAddress: "100 Depot Rd, Springfield, IL 62701",
  ownerName: "Ada Byron",
  email: "ada@byronfreight.com",
  phone: "555 123 4567",
  coveragesNeeded: "Auto liability and cargo for eight trucks",
  vins: JSON.stringify(["1FUJGLDR0CLBP8834", "", "", "", ""]),
  consent: "true",
};

describe("POST /api/quote (full mode)", () => {
  beforeEach(() => {
    sendFullQuoteEmail.mockReset();
    sendFullQuoteEmail.mockResolvedValue(undefined);
  });

  it("accepts a valid full submission", async () => {
    const res = await POST(fullReq(fullGood));
    expect(res.status).toBe(200);
    expect(sendFullQuoteEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects a non-numeric DOT number", async () => {
    const res = await POST(fullReq({ ...fullGood, dotNumber: "12ab" }));
    expect(res.status).toBe(400);
    expect(sendFullQuoteEmail).not.toHaveBeenCalled();
  });

  it("rejects an oversize attachment", async () => {
    const big = new File([new Uint8Array(9 * 1024 * 1024)], "loss-runs.pdf", {
      type: "application/pdf",
    });
    const res = await POST(fullReq(fullGood, [{ name: "file_lossRuns", file: big }]));
    expect(res.status).toBe(400);
    expect(sendFullQuoteEmail).not.toHaveBeenCalled();
  });

  it("rejects a disallowed file type", async () => {
    const bad = new File([new Uint8Array(16)], "payload.exe", {
      type: "application/x-msdownload",
    });
    const res = await POST(fullReq(fullGood, [{ name: "file_ownerCdl", file: bad }]));
    expect(res.status).toBe(400);
  });

  it("silently drops a honeypot hit", async () => {
    const res = await POST(fullReq({ ...fullGood, company_website: "spam" }));
    expect(res.status).toBe(200);
    expect(sendFullQuoteEmail).not.toHaveBeenCalled();
  });
});
