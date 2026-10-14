import type { ReactNode } from 'react';
import type { LegalDoc } from '@/content/legal';
import { Tbc } from '@/components/LegalPage';
import { Link } from '@/i18n/navigation';
import { SITE, waLink } from '@/lib/site';

/* Trader identification, as an Impressum (Germany: § 5 DDG) and Art. 5 of the EU e-commerce
   directive (2000/31/EC) require. DRAFT: to be checked by a lawyer. */
const L = SITE.legal;

const rows: [string, ReactNode][] = [
  ['Trading name', SITE.name],
  ['Legal name', <Tbc key="n" value={L.legalName} hint="registered company name" />],
  ['Legal form', <Tbc key="f" value={null} hint="e.g. private limited company, partnership or sole proprietorship" />],
  ['Registered address', <Tbc key="a" value={L.address} hint="postal address" />],
  ['Authorised representative(s)', <Tbc key="p" value={null} hint="name(s) of the people who can act for the business, e.g. directors or owners" />],
  [
    'Email',
    SITE.email ? <a key="e" href={`mailto:${SITE.email}`}>{SITE.email}</a> : <Tbc key="e" value={null} hint="public email address" />,
  ],
  [
    'WhatsApp',
    <a key="w" href={waLink()} target="_blank" rel="noopener noreferrer">
      {SITE.whatsapp.display}
    </a>,
  ],
  ['Telephone', <Tbc key="t" value={null} hint="phone number for calls, or state that WhatsApp is the phone contact" />],
  ['Commercial register and number', <Tbc key="r" value={L.registrationNumber} hint="name of the register and registration number" />],
  ['VAT / GST no.', <Tbc key="v" value={L.vatNumber} hint="tax number, or state that none applies" />],
  ['Tourism registration', <Tbc key="g" value={L.tourismRegistration} hint="Indian tourism-department approval number" />],
  ['Customer money protection', <Tbc key="i" value={L.insolvencyProtection} hint="insurer, bank guarantee or fund that protects prepayments" />],
];

const notice: LegalDoc = {
  title: 'Legal notice',
  description: 'Who runs Wildora Expeditions: legal name, address, registration, customer-money protection and how to reach us.',
  lede: 'The business behind the trips, so you know who you are booking with and how to reach us.',
  updated: '2026-10-14',
  sections: [
    {
      id: 'trader',
      title: 'Trader information',
      content: (
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,14rem)_1fr]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-wd-faint text-sm">{k}</dt>
              <dd className="text-wd-ink">{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'content',
      title: 'Responsible for content',
      content: (
        <p>
          Person responsible for the content of this website under § 18(2) of the German Interstate Media Treaty
          (Medienstaatsvertrag): <Tbc value={null} hint="name and address of the person responsible" />.
        </p>
      ),
    },
    {
      id: 'disputes',
      title: 'Consumer dispute resolution',
      content: (
        <>
          <p>
            <Tbc
              value={null}
              hint="whether we are willing or obliged to take part in dispute resolution proceedings before a consumer arbitration board, and if so which one"
            />
          </p>
          <p>
            If something has gone wrong, please talk to us first: see{' '}
            <Link href="/terms/#complaints">complaints in our booking conditions</Link>.
          </p>
        </>
      ),
    },
    {
      id: 'liability',
      title: 'Liability for content',
      content: (
        <p>
          We take care to keep this website accurate and up to date, but trip details, seasons and park rules can change.
          What we confirm to you in writing when you book takes precedence over the website. Nothing here limits our
          responsibilities under our <Link href="/terms/">booking conditions</Link> or the law.
        </p>
      ),
    },
    {
      id: 'links',
      title: 'Links to other websites',
      content: (
        <p>
          This website links to other websites, such as WhatsApp, OpenStreetMap and the sources of our photographs and
          map data. Their owners are responsible for their content; we have no control over it. If we learn that a
          linked page is unlawful, we will remove the link.
        </p>
      ),
    },
    {
      id: 'copyright',
      title: 'Copyright',
      content: (
        <p>
          Unless stated otherwise, the text on this website is © {SITE.name}. Photographs and map data come from many
          photographers and sources, each under its own licence: see <Link href="/credits/">photo and map credits</Link>.
          Please do not reuse material from this website without permission, except where its licence allows.
        </p>
      ),
    },
  ],
};

export default notice;
