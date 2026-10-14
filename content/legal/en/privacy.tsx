import type { LegalDoc } from '@/content/legal';
import { Tbc } from '@/components/LegalPage';
import { Link } from '@/i18n/navigation';
import { SITE, hasEmail, hasForm, waLink } from '@/lib/site';

/* Privacy notice, structured on Art. 13 GDPR. DRAFT: wording to be checked by a lawyer. */
const L = SITE.legal;

const privacy: LegalDoc = {
  title: 'Privacy notice',
  description: 'What personal data Wildora Expeditions collects, why, who receives it, how long it is kept and your rights.',
  lede: 'What we collect when you contact us or book a trip, why, who sees it, how long we keep it and what your rights are.',
  updated: '2026-10-14',
  sections: [
    {
      id: 'controller',
      title: 'Who is responsible',
      content: (
        <>
          <p>
            {SITE.name}, <Tbc value={L.legalName} hint="legal name" />, <Tbc value={L.address} hint="address" />, is
            responsible for your personal data (the &quot;controller&quot; under the GDPR). For travellers in the
            United Kingdom, the UK GDPR applies in the same way; the article numbers in this notice are the same in both.
          </p>
          <ul>
            <li>
              Privacy requests: <Tbc value={L.privacyContact} hint="email or postal address for privacy requests" />
            </li>
            <li>
              WhatsApp:{' '}
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                {SITE.whatsapp.display}
              </a>
            </li>
            <li>
              Our representative in the EU (Art. 27 GDPR):{' '}
              <Tbc value={null} hint="name and address of our EU representative, or confirm that none is required" />
            </li>
            <li>
              Our representative in the UK (Art. 27 UK GDPR):{' '}
              <Tbc value={null} hint="name and address of our UK representative, or confirm that none is required" />
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'what-we-collect',
      title: 'What we collect',
      content: (
        <>
          <p>This website has no accounts, no tracking cookies and no analytics. We receive:</p>
          <ul>
            <li>
              <strong>Your enquiry:</strong> what you choose to send us: your name, the country you live in, the trip and
              dates you are interested in, group size, children&apos;s ages, dietary needs, medical or mobility notes,
              your message, and the contact details you give us so we can reply.
            </li>
            <li>
              <strong>WhatsApp conversations,</strong> if you choose to write to us on WhatsApp: your phone number, your
              WhatsApp profile name and the messages and files you send. If you use WhatsApp from the enquiry form, the
              form only writes the message; nothing is sent until you send it from your own WhatsApp.
            </li>
            {hasEmail && (
              <li>
                <strong>Emails</strong> you send us, which go to our mailbox (<Tbc value={null} hint="mail provider" />).
              </li>
            )}
            <li>
              <strong>Booking and payment records,</strong> if you book: travellers&apos; names, contact details and ages,
              what you have booked and paid, and{' '}
              <Tbc value={null} hint="any identity or passport details that lodges or park permits require" />.
            </li>
            <li>
              <strong>Technical access logs,</strong> kept by the company that hosts this website when you visit it: for
              example your IP address, the page requested, the time and your browser type.
            </li>
          </ul>
          <p>
            <strong>Health information.</strong> Medical conditions, allergies, mobility notes, dietary needs that reveal
            a health condition, and the short health form we ask travellers to complete are health data, a special
            category of personal data. Please share them only so we can judge whether a trip suits you and plan for your
            safety.{' '}
            {hasForm
              ? 'We ask for your explicit consent before the web form sends them, and we use them for nothing else.'
              : 'We use them for nothing else.'}
          </p>
        </>
      ),
    },
    {
      id: 'purposes',
      title: 'Why we use it, and on what legal basis',
      content: (
        <ul>
          <li>
            To answer your enquiry and, if you book, to arrange and run your trip: steps you ask us to take before a
            contract, and performing that contract (Art. 6(1)(b) GDPR).
          </li>
          <li>
            Health information, including food allergies:{' '}
            {hasForm && (
              <>
                if you send it through the web form, your explicit consent (Art. 9(2)(a) GDPR), which you can withdraw at
                any time. If you give it to us in any other way, for example on WhatsApp or in our health form:{' '}
              </>
            )}
            <Tbc
              value={null}
              hint="legal basis for health information a traveller gives us without the web form's consent box, e.g. on WhatsApp, by email or in the health form asked for at booking, as advised by a lawyer"
            />
            . In an emergency in which you cannot give consent, we may share relevant health information with medical
            services to protect your life (Art. 9(2)(c) GDPR).
          </li>
          <li>
            Running this website and keeping it secure: our legitimate interest in a working, safe website (Art. 6(1)(f)
            GDPR).
          </li>
          <li>
            Keeping accounting and tax records and meeting other legal obligations (Art. 6(1)(c) GDPR).{' '}
            <Tbc value={null} hint="which legal obligations apply, including under Indian law, and their legal basis" />
          </li>
        </ul>
      ),
    },
    {
      /* Art. 13(2)(e) GDPR. */
      id: 'required',
      title: 'Do you have to give us your data?',
      content: (
        <>
          <p>
            Whether you enquire or book is your choice. To reply to an enquiry, we need only the details marked as
            required on the enquiry form; everything else is optional.
          </p>
          <p>
            To book, we need{' '}
            <Tbc
              value={null}
              hint="which data are needed to book, e.g. travellers' names and ages, identity or passport details for permits, the health form and travel insurance details"
            />
            . Without them we cannot confirm your booking. Data that we or our suppliers must collect by law:{' '}
            <Tbc value={null} hint="e.g. identity details that lodges or permit offices must record, or confirm that there are none" />.
          </p>
        </>
      ),
    },
    {
      id: 'recipients',
      title: 'Who receives it',
      content: (
        <>
          <ul>
            <li>Our team in India.</li>
            {hasForm && (
              <li>
                Our form service, if you use <strong>Send enquiry</strong>:{' '}
                <Tbc value={null} hint="provider name and country" />. It passes your answers on to us.
              </li>
            )}
            <li>
              WhatsApp, operated by Meta, when you choose to write to us on WhatsApp. WhatsApp handles your messages
              under its own terms and privacy policy.
            </li>
            <li>
              The company that hosts this website. The site is currently served by GitHub Pages, a service of GitHub,
              Inc., USA. <Tbc value={null} hint="confirm the hosting provider" />
            </li>
            <li>
              Lodges, drivers and guides, who receive what they need to deliver your trip: for example names and dates,
              dietary needs and food allergies (we pass food allergies on to every kitchen on the route), and relevant
              medical information so they can look after you.
            </li>
            <li>
              Others who need it for your booking: <Tbc value={null} hint="e.g. bank or payment provider, park authorities for permits" />.
            </li>
          </ul>
          <p>We do not sell your data.</p>
        </>
      ),
    },
    {
      id: 'transfers',
      title: 'International transfers',
      content: (
        <p>
          Our team works from India and this website is hosted in the USA, so your data is processed outside the European
          Economic Area and the United Kingdom. Safeguards:{' '}
          <Tbc
            value={null}
            hint="e.g. standard contractual clauses (with the UK addendum for UK travellers), or Art. 49(1)(b) GDPR where a transfer is necessary for your contract, as advised by a lawyer"
          />
          .
        </p>
      ),
    },
    {
      id: 'retention',
      title: 'How long we keep it',
      content: (
        <ul>
          <li>
            Enquiries that do not lead to a booking: <Tbc value={null} hint="period" />.
          </li>
          <li>
            Booking and payment records: as long as tax and accounting law requires,{' '}
            <Tbc value={null} hint="period and the law that sets it" />.
          </li>
          <li>
            Health information: <Tbc value={null} hint="how soon after the trip it is deleted" />.
          </li>
        </ul>
      ),
    },
    {
      id: 'rights',
      title: 'Your rights',
      content: (
        <>
          <p>You have the right to:</p>
          <ul>
            <li>see the data we hold about you and get a copy (access);</li>
            <li>have it corrected (rectification);</li>
            <li>have it deleted (erasure);</li>
            <li>have its use restricted (restriction);</li>
            <li>receive it in a machine-readable format, or have it sent to someone else (portability);</li>
            <li>object to our use of it on the basis of legitimate interests (objection);</li>
            <li>withdraw your consent at any time, without affecting what we did before you withdrew it;</li>
            <li>
              complain to a data-protection supervisory authority, for example the one in the EU country where you live
              or work or, in the United Kingdom, the{' '}
              <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
                Information Commissioner&apos;s Office
              </a>
              .
            </li>
          </ul>
          <p>
            To exercise a right, write to the privacy contact above. We will reply within one month.
          </p>
        </>
      ),
    },
    {
      id: 'automated',
      title: 'No automated decisions',
      content: <p>We do not make decisions about you by automated means alone, and we do not profile you.</p>,
    },
    {
      id: 'cookies',
      title: 'Cookies and local storage',
      content: (
        <p>
          This website sets no cookies. If you choose a language in the language switcher, your browser remembers that
          choice on your device; it is never sent to us. See <Link href="/cookies/">cookies and local storage</Link>.
        </p>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      content: (
        <p>
          When children travel with us, we receive their details, such as age, dietary needs and relevant health
          information, from their parent or guardian, and use them only to plan and run the trip.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to this notice',
      content: (
        <p>
          We will update this notice when the way we use personal data or the law changes. The date at the bottom of
          this page shows when it was last updated.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contact',
      content: (
        <p>
          Privacy requests: <Tbc value={L.privacyContact} hint="email or postal address for privacy requests" />. Our full
          company details are in the <Link href="/legal/">legal notice</Link>. See also our{' '}
          <Link href="/terms/">booking conditions</Link>.
        </p>
      ),
    },
  ],
};

export default privacy;
