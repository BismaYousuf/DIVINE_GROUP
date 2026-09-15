/**
 * Single source of truth for site metadata, navigation and placeholder content.
 * Everything marked CLIENT TO CONFIRM is provisional and must be replaced with
 * real values before launch.
 */

export const siteConfig = {
  name: "Divine Group",
  legalName: "Divine Group",
  descriptor: "Freight & commercial insurance, engineered around your operation.",
  // Falls back to the real production domain so canonical/OG/sitemap URLs are
  // never wrong even if NEXT_PUBLIC_SITE_URL isn't set in a given environment.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://thedivinegroup.net",
  ogImage: "/media/og.jpg",

  phone: "(610) 646-5037",
  phoneHref: "tel:+16106465037",
  telegramPhone: "+1 321 214 7469",
  telegramPhoneHref: "tel:+13212147469",
  email: "submissions@thedivinegroup.net",

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
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61593982666177" },
    { label: "Instagram", href: "https://www.instagram.com/thedivinegroup1/" },
    { label: "Telegram", href: "https://web.telegram.org/a/#777000" },
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

/** Service categories for the Services page. CLIENT TO CONFIRM. */
export const serviceCategories = [
  {
    title: "Trucking Insurance",
    blurb:
      "Auto liability, motor truck cargo, physical damage and specialty programs for owner-operators and fleets.",
    href: "/services/trucking-insurance",
  },
  {
    title: "Freight Broker Insurance",
    blurb:
      "Contingent cargo, general liability, broker bonds, and errors & omissions for freight brokers.",
    href: "/services#freight-broker",
  },
  {
    title: "Borderless Coverage",
    blurb:
      "Insurance that follows your freight across the United States, Mexico and Canada.",
    href: "/services#borderless",
  },
  {
    title: "Commercial Insurance",
    blurb:
      "General liability, commercial property, business auto, workers' comp and umbrella for the wider business.",
    href: "/services#commercial",
  },
  {
    title: "Risk Management",
    blurb:
      "Safety and compliance programs, CSA score guidance, and loss forecasting.",
    href: "/services#risk",
  },
  {
    title: "Usage-Based Solutions",
    blurb:
      "Telematics and mileage-based programs for pay-as-you-drive coverage.",
    href: "/services#usage",
  },
] as const;

export const truckingCoverageLinks = [
  "Auto Liability",
  "Motor Truck Cargo",
  "Physical Damage",
  "General Liability",
  "Excess & Umbrella",
  "Non-Trucking Liability & Bobtail",
  "Occupational Accident (OCC/ACC)",
] as const;

export const truckingPrograms = [
  "New venture",
  "High-risk",
  "Owner-operator",
  "Box trucks",
  "Bulk haulers",
  "Couriers",
  "Dump operations",
  "Haz-mat carriers",
  "Hot-shots",
  "LTL",
  "Tow truck operations",
  "Warehouse operations",
] as const;

/** US states + DC for the quote form select. */
export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;
