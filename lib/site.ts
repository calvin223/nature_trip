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
  /** Default text pre-filled in a WhatsApp chat opened from the site. */
  defaultWhatsAppMessage: string;
}

export const SITE: SiteConfig = {
  name: 'Wildora Expeditions',
  whatsapp: { e164: '919443161606', display: '+91 94431 61606' },
  email: null,
  social: { facebook: null, instagram: null },
  launchDate: null,
  bookingLeadDays: 42,
  timeZone: 'Asia/Kolkata',
  defaultWhatsAppMessage:
    "Hello Wildora, I'd like to know more about your guided nature trips.",
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

/** Pre-filled WhatsApp text for an enquiry about one trip (and optionally a date). */
export function tripEnquiryMessage(tripTitle: string, departureLabel?: string): string {
  const when = departureLabel ? ` departing ${departureLabel}` : '';
  return `Hello Wildora, I'm interested in the ${tripTitle}${when}. Could you tell me more?`;
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
