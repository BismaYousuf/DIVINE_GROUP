import { describe, it, expect, vi, beforeEach } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("@/lib/resend", () => ({
  getResend: () => ({ emails: { send } }),
}));

import { sendQuoteEmail, escapeHtml } from "./send-quote-email";

const data = {
  name: "Ada Byron",
  email: "ada@example.com",
  phone: "555 123 4567",
  coverageInterest: "Auto liability and cargo",
  consent: true as const,
};

beforeEach(() => send.mockReset());

describe("escapeHtml", () => {
  it("neutralises angle brackets and quotes", () => {
    expect(escapeHtml('<script>"x"</script>')).toBe(
      "&lt;script&gt;&quot;x&quot;&lt;/script&gt;",
    );
  });
});

describe("sendQuoteEmail", () => {
  it("sends one email to QUOTE_INBOX with replyTo set to the submitter", async () => {
    send.mockResolvedValue({ data: { id: "e_1" }, error: null });

    await sendQuoteEmail(data);

    expect(send).toHaveBeenCalledTimes(1);
    const payload = send.mock.calls[0][0];
    expect(payload.to).toBe(process.env.QUOTE_INBOX);
    expect(payload.replyTo).toBe("ada@example.com");
    expect(payload.html).toContain("ada@example.com");
    expect(payload.html).toContain("Auto liability and cargo");
  });

  it("throws when Resend returns an error", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "bad from" },
    });

    await expect(sendQuoteEmail(data)).rejects.toThrow(/Resend: validation_error/);
  });
});
