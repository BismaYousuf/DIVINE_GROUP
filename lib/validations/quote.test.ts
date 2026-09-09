import { describe, it, expect } from "vitest";
import { inlineQuoteSchema } from "./quote";

const valid = {
  name: "Ada Byron",
  email: "ada@example.com",
  phone: "555 123 4567",
  coverageInterest: "Auto liability and cargo for six trucks",
  consent: true,
};

describe("inlineQuoteSchema", () => {
  it("accepts a complete submission", () => {
    expect(inlineQuoteSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing name", () => {
    const { name: _name, ...rest } = valid;
    expect(inlineQuoteSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(inlineQuoteSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
      false,
    );
  });

  it("rejects consent = false", () => {
    expect(
      inlineQuoteSchema.safeParse({ ...valid, consent: false }).success,
    ).toBe(false);
  });

  it("still parses when the honeypot field is present but empty", () => {
    expect(
      inlineQuoteSchema.safeParse({ ...valid, company_website: "" }).success,
    ).toBe(true);
  });

  it("trims and lowercases the email", () => {
    const parsed = inlineQuoteSchema.parse({
      ...valid,
      email: "  ADA@Example.COM ",
    });
    expect(parsed.email).toBe("ada@example.com");
  });
});
