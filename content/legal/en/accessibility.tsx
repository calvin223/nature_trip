import type { LegalDoc } from '@/content/legal';
import { Tbc } from '@/components/LegalPage';
import { Link } from '@/i18n/navigation';
import { SITE, waLink } from '@/lib/site';

/* Each claim below was checked against the code on 2026-10-14 (skip link and landmarks in
   SiteShell, focus and reduced-motion rules in globals.css, Escape in Navigation, the lightbox and
   its captions toggle in SpeciesIndex/SpeciesCaption, viewport in app/[locale]/layout.tsx, the
   contact form's labels and errors, the maps' text alternatives in TripMap). Re-check when the
   site changes. */
const accessibility: LegalDoc = {
  title: 'Accessibility statement',
  description: 'How we make this website usable for everyone, the standard we aim for, known limitations and how to tell us about a problem.',
  lede: 'We want everyone to be able to plan a trip with us, whatever device, browser or assistive technology they use.',
  updated: '2026-10-14',
  sections: [
    {
      id: 'commitment',
      title: 'Our commitment',
      content: (
        <>
          <p>
            {SITE.name} wants this website to be usable by as many people as possible. We aim to meet the Web Content
            Accessibility Guidelines (WCAG) 2.2 at level AA.
          </p>
          <p>
            This statement is about the website. For what our trips themselves involve, for example walking and
            access, see the <Link href="/faq/">FAQ</Link> or ask us.
          </p>
        </>
      ),
    },
    {
      id: 'what-we-have-done',
      title: 'What we have done',
      content: (
        <ul>
          <li>Pages are built with headings and landmarks (header, navigation, main content and footer).</li>
          <li>A &quot;Skip to content&quot; link is the first thing you reach with the keyboard.</li>
          <li>
            Menus, dropdowns, filters, photo galleries and the photo viewer work with a keyboard. Dropdowns close with
            Escape; in the photo viewer the arrow keys change the photo and Escape closes it.
          </li>
          <li>The keyboard focus is clearly outlined.</li>
          <li>If your device is set to reduce motion, animations are switched off or reduced.</li>
          <li>Text colours have a contrast ratio of at least 4.5:1 against the page and card backgrounds.</li>
          <li>
            Form fields have visible labels. Required fields are marked, and errors are explained in text next to the
            field and announced to screen readers.
          </li>
          <li>
            Photographs have text alternatives, usually the species or place name. Where the same name is already
            given next to a photo, the photo is marked as decorative so it is not read out twice.
          </li>
          <li>The photo viewer has a button to show or hide captions.</li>
          <li>Every map has a text description for screen readers, and route maps also list their stops.</li>
          <li>You can zoom the page: zooming is not disabled.</li>
        </ul>
      ),
    },
    {
      id: 'limitations',
      title: 'Known limitations',
      content: (
        <ul>
          <li>
            The maps are pictures. Screen readers get a short description (and, on route maps, the list of stops), but
            not the visual detail, such as the shape of the route or the distances between places. Each trip&apos;s
            itinerary describes the route in text, day by day.
          </li>
        </ul>
      ),
    },
    {
      id: 'feedback',
      title: 'Feedback and contact',
      content: (
        <>
          <p>If you find a barrier on this website, or need information in another format, please tell us:</p>
          <ul>
            <li>
              WhatsApp:{' '}
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                {SITE.whatsapp.display}
              </a>
            </li>
            <li>
              Email:{' '}
              {SITE.email ? <a href={`mailto:${SITE.email}`}>{SITE.email}</a> : <Tbc value={null} hint="public email address" />}
            </li>
          </ul>
          <p>
            We aim to reply within <Tbc value={null} hint="response time" />.
          </p>
        </>
      ),
    },
    {
      id: 'preparation',
      title: 'How this statement was prepared',
      content: (
        <p>
          This statement was prepared on <Tbc value={null} hint="date of the statement" />, based on{' '}
          <Tbc value={null} hint="a self-assessment or an independent audit" />. It was last reviewed on{' '}
          <Tbc value={null} hint="date of the last review" />.
        </p>
      ),
    },
    {
      id: 'eaa',
      title: 'European Accessibility Act',
      content: (
        <p>
          We are assessing whether the European Accessibility Act (Directive (EU) 2019/882) applies to us, or whether we
          are exempt as a micro-enterprise: <Tbc value={null} hint="outcome of the assessment" />.
        </p>
      ),
    },
  ],
};

export default accessibility;
