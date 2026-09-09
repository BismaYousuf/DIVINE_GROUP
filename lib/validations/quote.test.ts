import { describe, it, expect } from "vitest";
import { inlineQuoteSchema, quoteSchema } from "./quote";

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

const fullValid = {
  dotNumber: "1234567",
  companyName: "Byron Freight LLC",
  garagingAddress: "100 Depot Rd, Springfield, IL 62701",
  ownerName: "Ada Byron",
  email: "ada@byronfreight.com",
  phone: "555 123 4567",
  coveragesNeeded: "Auto liability, cargo and physical damage for 8 power units",
  vins: ["1FUJGLDR0CLBP8834", "3AKJHHDR7JSJX4321", "", "", ""],
  consent: true,
};

describe("quoteSchema (full)", () => {
  it("accepts a complete submission", () => {
    expect(quoteSchema.safeParse(fullValid).success).toBe(true);
  });

  it("rejects a non-numeric DOT number", () => {
    expect(
      quoteSchema.safeParse({ ...fullValid, dotNumber: "12ab" }).success,
    ).toBe(false);
  });

  it("rejects more than 60 VINs", () => {
    const vins = Array.from({ length: 61 }, () => "1FUJGLDR0CLBP8834");
    expect(quoteSchema.safeParse({ ...fullValid, vins }).success).toBe(false);
  });

  it("rejects a VIN containing I, O or Q", () => {
    expect(
      quoteSchema.safeParse({
        ...fullValid,
        vins: ["1IUJGLDR0CLBP8834"],
      }).success,
    ).toBe(false);
  });

  it("rejects consent = false", () => {
    expect(
      quoteSchema.safeParse({ ...fullValid, consent: false }).success,
    ).toBe(false);
  });
});
