/**
 * Single source of truth for site metadata, navigation and placeholder content.
 * Everything marked CLIENT TO CONFIRM is provisional and must be replaced with
 * real values before launch.
 */

export const siteConfig = {
  name: "Divine Group",
  legalName: "Divine Group Inc.", // CLIENT TO CONFIRM (spelling: Divine vs Devine)
  descriptor: "Freight & commercial insurance, engineered around your operation.",
  url: "https://divinegroup.example", // CLIENT TO CONFIRM
  ogImage: "/media/og.jpg",

  phone: "(000) 000-0000", // CLIENT TO CONFIRM
  phoneHref: "tel:+10000000000", // CLIENT TO CONFIRM
  email: "hello@divinegroup.example", // CLIENT TO CONFIRM

  address: {
    // CLIENT TO CONFIRM — real office address
    line1: "—",
    line2: "",
    city: "—",
    state: "—",
    zip: "—",
  },

  nav: [
    { label: "Our Difference", href: "/our-difference" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact-us" },
  ],

  cta: { label: "Get a Quote", href: "/get-a-quote" },

  socials: [
    // CLIENT TO CONFIRM — real profile URLs
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "X", href: "#" },
  ],

  /** Coverage lines for the Home coverage band and the Services page. CLIENT TO CONFIRM. */
  coverageLines: [
    {
      code: "C-01",
      name: "Auto Liability",
      blurb:
        "Primary protection for bodily injury and property damage caused on the road.",
    },
    {
      code: "C-02",
      name: "Motor Truck Cargo",
      blurb: "Covers the freight you haul against loss and damage in transit.",
    },
    {
      code: "C-03",
      name: "Physical Damage",
      blurb: "Repairs or replaces your tractors and trailers after a covered loss.",
    },
    {
      code: "C-04",
      name: "General Liability",
      blurb:
        "Third-party claims that happen off the truck — premises, operations, product.",
    },
    {
      code: "C-05",
      name: "Non-Trucking Liability",
      blurb: "Coverage while the unit is driven off dispatch.",
    },
    {
      code: "C-06",
      name: "Workers' Compensation",
      blurb: "Medical care and wage replacement for injured employees.",
    },
    {
      code: "C-07",
      name: "Excess & Umbrella",
      blurb: "Higher limits stacked above your primary liability policies.",
    },
    {
      code: "C-08",
      name: "Occupational Accident",
      blurb: "Accident coverage for owner-operators outside of workers' comp.",
    },
    {
      code: "C-09",
      name: "Refrigerated Cargo",
      blurb: "Reefer breakdown and spoilage protection for temperature-controlled loads.",
    },
  ],

  disclaimer:
    "Insurance coverages vary by location, policy, and individual business. Talk to a licensed agent about coverages in your state. Material on this site is not a warranty of state or federal law.",
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
export type CoverageLine = (typeof siteConfig.coverageLines)[number];

/** US states + DC for the quote form select. */
export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;
