import { describe, it, expect } from "vitest";
import { contactSchema } from "./contact";

const valid = {
  name: "Grace Hopper",
  email: "grace@example.com",
  phone: "555 987 6543",
  message: "We run 12 power units and need to review our cargo limits.",
  consent: true,
};

describe("contactSchema", () => {
  it("accepts a complete submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a message that is too short", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "grace@" }).success).toBe(
      false,
    );
  });

  it("rejects consent = false", () => {
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(
      false,
    );
  });

  it("treats subject as optional", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(
      contactSchema.safeParse({ ...valid, subject: "Cargo limits" }).success,
    ).toBe(true);
  });
});
