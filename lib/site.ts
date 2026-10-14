// Site-wide configuration for Wildora Expeditions.
//
// This is the single source for contact details and launch timing. Components
// must read contact data from here rather than hard-coding it, and must render
// a link only when the value is non-null: a null here means "not supplied by
// the owners yet", never "use a plausible default".

export interface SiteConfig {
  /** Brand name as it appears in titles and copy. */
  name: string;
  /** Owner-supplied WhatsApp number (VERIFIED with the owners 2026-10-03). */
  whatsapp: {
    /** Digits only, country code first, no "+" (the format wa.me expects). */
    e164: string;
    /** Human-readable form for display. */
    display: string;
  };
  /**
   * Public email address, or null when none exists. The old
   * info@wildoraexpeditions.com was a placeholder for a domain nobody owns,
   * so it has been removed. Set this only once a working inbox exists.
   */
  email: string | null;
  /** Social profile URLs; null until the owners supply the real pages. */
  social: {
    facebook: string | null;
    instagram: string | null;
  };
  /**
   * URL of a form service (e.g. Formspree) that receives enquiries as JSON, or
   * null until one is set up. When null the enquiry form only writes a WhatsApp
   * message, as before.
   */
  formEndpoint: string | null;
  /**
   * Trader details for /legal/, /terms/ and /privacy/. null means "not supplied
   * yet": the pages show a visible "to be confirmed" marker, never a guess.
   */
  legal: {
    legalName: string | null;
    address: string | null;
    registrationNumber: string | null;
    vatNumber: string | null;
    /** Indian tourism-department registration / approval number. */
    tourismRegistration: string | null;
    /** Who protects customers' prepayments if Wildora fails (insurer, bank guarantee, fund). */
    insolvencyProtection: string | null;
    /** Address for privacy requests (access, erasure). */
    privacyContact: string | null;
    /** Set true only after a lawyer has reviewed /terms/ and /privacy/. */
    reviewed: boolean;
  };
  /**
   * Search-engine ownership codes (the "HTML tag" method: the content value only), or null. Google:
   * Search Console > Add property > HTML tag. Bing: Webmaster Tools > Add site > Meta tag. Meta tags
   * need no script or cookies, so the no-tracking promise on /cookies/ stays true.
   */
  searchVerification: { google: string | null; bing: string | null };
  /**
   * Public launch date (YYYY-MM-DD), or null. When set and still in the
   * future, departure dates are computed from it instead of from the build
   * date, so no departure is listed before the site goes live.
   */
  launchDate: string | null;
  /**
   * Minimum days between "now" (or the launch date) and the first listed
   * departure, so there is time for permits, lodges and guests' own travel.
   * 42 days = 6 weeks. Proposed default: see POLICY_REVIEW.md.
   */
  bookingLeadDays: number;
  /** Time zone used for "today" when no BUILD_DATE is given. */
  timeZone: string;
}

/** The published site's root URL (with the GitHub Pages base path), for canonical links, the sitemap
    and structured data. Temporarily the calvin223 fork's GitHub Pages (2026-10-14); change it when
    the site moves to its own domain. */
export const SITE_URL = 'https://calvin223.github.io/nature_trip/';

export const SITE: SiteConfig = {
  name: 'Wildora Expeditions',
  whatsapp: { e164: '919443161606', display: '+91 94431 61606' },
  email: null,
  social: { facebook: null, instagram: null },
  formEndpoint: null,
  legal: {
    legalName: null,
    address: null,
    registrationNumber: null,
    vatNumber: null,
    tourismRegistration: null,
    insolvencyProtection: null,
    privacyContact: null,
    reviewed: false,
  },
  searchVerification: { google: null, bing: null },
  launchDate: null,
  bookingLeadDays: 42,
  timeZone: 'Asia/Kolkata',
};

// Fail loudly at import time if the config is malformed, rather than shipping
// a broken link or a silently wrong schedule.
if (!/^[1-9]\d{7,14}$/.test(SITE.whatsapp.e164)) {
  throw new Error(`SITE.whatsapp.e164 must be 8-15 digits with no "+", got "${SITE.whatsapp.e164}"`);
}
if (!Number.isInteger(SITE.bookingLeadDays) || SITE.bookingLeadDays < 0) {
  throw new Error(`SITE.bookingLeadDays must be a non-negative integer, got ${SITE.bookingLeadDays}`);
}
if (SITE.launchDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(SITE.launchDate)) {
  throw new Error(`SITE.launchDate must be YYYY-MM-DD or null, got "${SITE.launchDate}"`);
}

if (SITE.formEndpoint !== null && !/^https:\/\//.test(SITE.formEndpoint)) {
  throw new Error(`SITE.formEndpoint must be an https:// URL or null, got "${SITE.formEndpoint}"`);
}

/** True when an enquiry form service is configured. */
export const hasForm: boolean = SITE.formEndpoint !== null;

/** True when a real, owner-supplied email address is configured. */
export const hasEmail: boolean = SITE.email !== null;

/**
 * WhatsApp click-to-chat link. With a message, the chat opens pre-filled:
 * `https://wa.me/919443161606?text=...` (text is URI-encoded).
 */
export function waLink(message: string = ''): string {
  const base = `https://wa.me/${SITE.whatsapp.e164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * mailto: link. Throws when no email is configured: callers must check
 * `hasEmail` first and offer WhatsApp instead, never a made-up address.
 */
export function mailtoLink(subject: string, body: string = ''): string {
  if (SITE.email === null) {
    throw new Error('mailtoLink() called but SITE.email is null; check hasEmail and use waLink() instead');
  }
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${SITE.email}?${params.join('&')}`;
}

export type SocialNetwork = keyof SiteConfig['social'];

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  url: string;
}

const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
};

/** Only the social profiles that are actually configured (possibly none). */
export function socialLinks(): SocialLink[] {
  return (Object.keys(SITE.social) as SocialNetwork[])
    .filter((network) => SITE.social[network] !== null)
    .map((network) => ({
      network,
      label: SOCIAL_LABELS[network],
      url: SITE.social[network] as string,
    }));
}
