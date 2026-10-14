import type { Metadata } from 'next';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import { trips } from '@/lib/data';
import { SITE, waLink } from '@/lib/site';
import ContactForm, { type TripOption } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Enquiries',
  description:
    'Plan a guided nature trip with Wildora Expeditions. Send an enquiry on WhatsApp with your trip, dates, group size and any dietary or medical needs.',
};

// Only id and title reach the client bundle, not the whole trips data set.
const tripOptions: TripOption[] = trips.map((t) => ({ id: t.id, title: t.title }));

export default function ContactPage() {
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl fade-up">
            <p className="eyebrow">Contact</p>
            <h1 className="h-display mb-5">
              Plan your trip <span className="accent-text">with us</span>
            </h1>
            <p className="lede">
              Tell us what you would like to see, when you can travel and who is coming. The form writes a WhatsApp
              message for you to check and send, or you can message us directly.
            </p>
          </div>
        </div>
      </section>

      <section className="wd-section wd-section--tight">
        <div className="wd-wrap">
          <div className="float-grid grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8 items-start">
            <div data-no-float className="glass glass-strong glass-pad reveal">
              <h2 className="h-card !text-2xl">Send an enquiry</h2>
              <div className="mt-4">
                <ContactForm trips={tripOptions} />
              </div>
            </div>

            <aside className="space-y-5" aria-label="Other ways to reach us">
              <div className="glass glass-pad card-3d reveal">
                <p className="eyebrow">Prefer to chat?</p>
                <h2 className="h-card">WhatsApp</h2>
                <p className="mt-2 font-display text-2xl font-semibold text-white tracking-wide">
                  {SITE.whatsapp.display}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-wd-muted">
                  Messages are answered by our team in India (IST, UTC+5:30).
                </p>
                <a
                  href={waLink(SITE.defaultWhatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa mt-5"
                >
                  <WhatsAppIcon /> Start a chat
                </a>
              </div>

              {SITE.email && (
                <div className="glass glass-pad card-3d reveal">
                  <h2 className="h-card">Email</h2>
                  <a href={`mailto:${SITE.email}`} className="mt-2 inline-block text-wd-lime underline underline-offset-4">
                    {SITE.email}
                  </a>
                </div>
              )}

              <div className="glass glass-pad card-3d reveal">
                <h2 className="h-card">What happens next</h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-wd-muted">
                  {[
                    'You check the message in WhatsApp and send it.',
                    'We reply with availability, a suggested plan and how to confirm your place.',
                    'Before you book, you tell us about any medical condition or allergy, and arrange travel medical insurance.',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex-none grid place-items-center w-6 h-6 rounded-full border border-[var(--wd-line-strong)] text-xs font-semibold text-wd-lime">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="glass glass-pad card-3d reveal">
                <h2 className="h-card">Before you write</h2>
                <p className="mt-2 text-sm leading-relaxed text-wd-muted">
                  Many questions about seasons, fitness, food, insurance and what to bring are already answered.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link href="/trips/" className="link-arrow">Trips &amp; departure dates</Link></li>
                  <li><Link href="/practical/" className="link-arrow">Plan &amp; prepare</Link></li>
                  <li><Link href="/faq/" className="link-arrow">Frequently asked questions</Link></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
