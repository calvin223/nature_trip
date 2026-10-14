import type { Metadata } from 'next';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import { waLink } from '@/lib/site';
import FaqBrowser from './FaqBrowser';
import { groupFaqs } from './faq-utils';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about Wildora’s guided nature trips: where and when they run, who can join, food and diet, accessibility, health and insurance, practicalities and booking.',
};

const groups = groupFaqs();
const total = groups.reduce((n, g) => n + g.items.length, 0);

/* FAQPage structured data, built from the same entries the page shows. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: groups.flatMap((g) =>
    g.items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  ),
};
// Escape "<" so no answer text can ever close the script element early.
const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />

      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl fade-up">
            <p className="eyebrow">Questions &amp; answers</p>
            <h1 className="h-display mb-5">
              Frequently asked <span className="accent-text">questions</span>
            </h1>
            <p className="lede">
              Plain answers about where our trips go, who they suit, food, health, insurance and booking:
              {' '}{total} questions in {groups.length} topics. If yours is not here, ask us on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="wd-section wd-section--tight">
        <div className="wd-wrap">
          <FaqBrowser groups={groups} />
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-pad card-3d reveal text-center">
            <p className="eyebrow">Still wondering?</p>
            <h2 className="h-section">Ask us directly</h2>
            <p className="lede mt-4 max-w-2xl mx-auto">
              Tell us what you would like to know, or which trip and dates you have in mind. Our team in India
              (IST, UTC+5:30) answers on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={waLink('Hello Wildora, I have a question about your trips: ')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
              <Link href="/contact/" className="btn btn-ghost btn-lg">Send an enquiry</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
