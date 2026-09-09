# Reliance Partners Clone — Layout & Content Reference

This folder is a **blueprint**, not an implementation. It documents the structure, content,
layout, and interactions of the reference site **https://reliancepartners.com/** so that a
developer/designer can rebuild a slimmed‑down clone for the client (Divine Group Inc).

**Do not start coding from this yet.** These are reference documents for the build phase.

## Scope of the clone

We are **not** cloning the whole site. The client wants:

| Nav item        | Source page on reliancepartners.com            | Reference file            |
|-----------------|-----------------------------------------------|---------------------------|
| Home            | `/`                                           | `home.md`                 |
| Our Difference  | `/about/`                                     | `our-difference.md`       |
| Services        | `/resources/` slot, content from `/trucking-insurance/` (renamed from "Resources") | `services.md` + `services-trucking-insurance.md` |
| Get a Quote     | `/quote/` (replaced with **one custom form**) | `get-a-quote.md`          |
| Contact Us      | `/contact/`                                   | `contact-us.md`           |

Four navigation items only: **Our Difference · Services · Get a Quote · Contact Us**.
Client login, Claims, Company News, Careers, and the large Solutions mega‑menu are **out of scope**.

## File contents standard

Every page file contains, in this order:

1. Page overview
2. Complete section-by-section breakdown
3. Content / text (verbatim from reference where reused)
4. Layout structure
5. Component breakdown
6. Visual hierarchy
7. CTA / button details
8. Image / media requirements
9. User interactions
10. Page layout diagram (ASCII + Mermaid)
11. Implementation notes

## Requirements verification (REQUIREMENTS.md vs. Website_Development_Proposal.docx)

Both source documents were checked against each other. They agree on the site shape
(Home + 4 nav items, single custom quote form, form emails to client inbox, Next.js on
Vercel, Resend for email, no admin panel). **Differences found — REQUIREMENTS.md is the
authoritative superset:**

| Item | Proposal .docx | REQUIREMENTS.md | Use |
|------|----------------|-----------------|-----|
| Quote form: Vehicle VIN numbers | not mentioned | **Yes — at least 5 vehicle VIN input fields** | Include (REQUIREMENTS.md) |
| Quote form: Excel vehicle list upload | not mentioned | **Yes — upload full vehicle list if >5 vehicles** | Include (REQUIREMENTS.md) |
| Attachment: "Vehicle Excel list" | not listed | listed | Include |
| Field name | "Drivers CDLs / Drivers MVRs" | "Driver CDLs / Driver MVRs" | Cosmetic only |
| Contact page | "Contact Us (with Contact Form)" | "Contact Us" | Keep a contact form (per .docx) |
| Attachment size cap | "Max 3 MB each" | not restated | **1.5 MB/file** — client later confirmed every document is under 1.5 MB (supersedes the .docx figure) |
| Domain | client's responsibility, e.g. `thedevinegroupstore.com` | not mentioned | Per .docx — client buys domain |

No contradictions. Everything in the proposal is preserved; REQUIREMENTS.md only **adds**
the VIN fields and the Excel-list upload to the Get a Quote form.

## Global elements (all pages)

- **Header:** sticky top nav. Logo left; 4 links + "Get a Quote" button right. Mobile: hamburger → slide/drop menu.
- **Footer:** simplified. Logo, short company blurb, the 4 nav links, phone, email, address,
  social icons (Facebook / X / LinkedIn / Instagram), copyright line, short insurance disclaimer.
  Drop Reliance's large legal/link farm; keep Privacy Policy + Terms of Use links.
- **Brand:** replace all "Reliance Partners" names, logos, phone (877.668.1704), and office
  addresses with the client's. Verbatim marketing copy below is a **starting draft** to be
  reworded for the client's business.
