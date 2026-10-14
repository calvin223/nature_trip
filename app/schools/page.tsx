import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import { wildlifeDisclaimer } from '@/lib/data';
import { waLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Custom Groups & Schools',
  description:
    'Tailor-made guided nature programmes in India for families, friends, private groups, clubs, companies, international visitors, schools and universities.',
};

const GROUP_TYPES = [
  {
    title: 'Families',
    body: 'Gentle-paced nature days with safaris, short walks, birding, viewpoints, local food and enough downtime for mixed ages.',
  },
  {
    title: 'Friends & private groups',
    body: 'Your own departure on your dates, with a dedicated guide, a route shaped around your interests and a daily rhythm you choose.',
  },
  {
    title: 'Clubs & societies',
    body: 'Birding, photography and natural-history groups: target birds, mammals, butterflies or macro subjects, low-light rainforest sessions and patient field support.',
  },
  {
    title: 'Companies & retreats',
    body: 'Nature immersion, team days, lodge-based wildlife, landscape trails and guided forest walks, planned around your schedule.',
  },
  {
    title: 'International visitors',
    body: 'Route notes, comfort planning and guided wildlife time shaped around your flights. Airport or rail pick-up can be discussed for private programmes.',
  },
  {
    title: 'Schools & universities',
    body: 'Field modules, student camps, field methods and curriculum-linked sessions, built as custom programmes on request.',
  },
];

const CUSTOM_OPTIONS: [string, string][] = [
  ['Target species', 'Tigers, leopards, elephants, hornbills, Western Ghats endemics, pheasants, frogs, reptiles, butterflies, orchids or other habitat specialities. We plan for the best chance, never a guarantee.'],
  ['Trip style', 'Relaxed holiday, safari-focused, photography-focused, adventurous monsoon, family-friendly or academic.'],
  ['Activities', 'Jeep safaris, birding, night walks where rules allow, wetland visits, waterfall stops, mountain trails, local markets and checklist sessions.'],
  ['Comfort', 'Lodge category, safari intensity, walking difficulty, rooming preferences, food needs, transport and pick-up arrangements.'],
  ['Length', 'Half-day guiding, weekend breaks, 4–7 day tours or longer multi-region routes.'],
];

const SAMPLE_DAY: [string, string][] = [
  ['06:00–09:00', 'Guided safari, birding, wetland or forest walk while wildlife is most active'],
  ['09:00–11:00', 'Breakfast, checklist notes and free time'],
  ['11:00–13:00', 'Village, landscape, river, forest, tea, spice or viewpoint visit, depending on the region'],
  ['13:00–15:30', 'Lunch and rest through the hottest or wettest part of the day'],
  ['15:30–18:00', 'Forest-edge walk, safari drive, photography session, wetland visit or scenic drive'],
  ['After dinner', 'Optional night walk for frogs, reptiles, owls, moths and rainforest sounds, where rules allow'],
];

const ACADEMIC = [
  {
    title: 'Short modules',
    body: 'Three to five day programmes introducing tropical ecology, species observation and conservation through time in the field.',
  },
  {
    title: 'Field courses',
    body: 'Longer programmes for colleges and universities, with field methods, data recording, student projects and review sessions.',
  },
  {
    title: 'Youth camps',
    body: 'Structured camps with age-appropriate nature walks, activities, observation skills and guided group reflection.',
  },
];

const LOGISTICS = [
  'Airport or rail pick-up, where practical',
  'Transport between field sites',
  'Accommodation matched to your comfort and budget',
  'Dietary planning, with vegetarian-friendly meals',
  'Park permits and access coordination',
  'Route notes, packing guidance and target-species lists',
];

const GROUP_ENQUIRY =
  'Hello Wildora, I would like to plan a custom trip for our group.\n' +
  'Type of group: \nNumber of people: \nAges: \nPreferred dates: \nInterests: ';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 flex-none mt-px" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5v.01" strokeLinecap="round" />
    </svg>
  );
}

export default function CustomGroupsPage() {
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap">
          <div className="max-w-3xl fade-up">
            <p className="eyebrow">Custom groups &amp; schools</p>
            <h1 className="h-display mb-5">
              A trip built around <span className="accent-text">your group</span>
            </h1>
            <p className="lede">
              Families, friends, clubs, companies, visitors from abroad, schools and universities: tell us who is coming
              and what you want to experience, and we will design a guided programme around your dates, pace,
              interests and comfort.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink(GROUP_ENQUIRY)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                <WhatsAppIcon /> Plan on WhatsApp
              </a>
              <Link href="/contact/" className="btn btn-ghost btn-lg">Send an enquiry</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Who we build for</p>
            <h2 className="h-section">Every kind of group</h2>
            <p>
              Our default is a well-guided nature holiday, not a classroom field course. If you need an academic
              version, we build that too.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 float-grid">
            {GROUP_TYPES.map((g, i) => (
              <article key={g.title} className="glass glass-pad card-3d reveal" style={delay((i % 3) * 100)}>
                <h3 className="h-card">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-wd-muted">{g.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Your programme</p>
            <h2 className="h-section">What can be customised</h2>
            <p>
              We shape the programme around what your group wants: safaris, birds, mammals, forests, wetlands,
              mountains, night trails, local food, photography time and comfortable travel.
            </p>
          </div>
          <div className="glass glass-pad card-3d reveal">
            <dl className="grid gap-x-10 gap-y-6 md:grid-cols-2">
              {CUSTOM_OPTIONS.map(([term, detail]) => (
                <div key={term} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1 text-wd-lime">✓</span>
                  <div>
                    <dt className="font-semibold text-white">{term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-wd-muted">{detail}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="wd-head reveal">
            <p className="eyebrow">An example only</p>
            <h2 className="h-section">A sample group day</h2>
            <p>The rhythm changes with the season, weather, permits, ages and the group’s energy.</p>
          </div>
          <div className="glass glass-strong card-3d reveal overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only-wd">A sample day on a custom group programme</caption>
                <thead>
                  <tr className="border-b border-[var(--wd-line-strong)] text-xs uppercase tracking-[0.16em] text-wd-lime">
                    <th scope="col" className="px-5 py-4 font-semibold">Time</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Experience</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_DAY.map(([time, what]) => (
                    <tr key={time} className="border-b border-[var(--wd-line)] last:border-0">
                      <th scope="row" className="px-5 py-4 font-semibold text-white whitespace-nowrap align-top">{time}</th>
                      <td className="px-5 py-4 text-wd-muted">{what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Schools &amp; universities</p>
            <h2 className="h-section">Academic options when you need them</h2>
            <p>
              Our naturalists include past and present environmental-science lecturers at Bishop Heber College,
              Tiruchirappalli, with experience of nature camps and field-based learning for schools and colleges.{' '}
              <Link href="/experts/" className="link-arrow">Meet the naturalists</Link>
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3 float-grid">
            {ACADEMIC.map((a, i) => (
              <article key={a.title} className="glass glass-pad card-3d reveal" style={delay(i * 100)}>
                <h3 className="h-card">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-wd-muted">{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap">
          <div className="wd-head reveal">
            <p className="eyebrow">Planning</p>
            <h2 className="h-section">Safety &amp; logistics</h2>
            <p>
              Every custom programme is planned around group size, ages, walking ability, weather, forest access,
              travel time, food needs and safe wildlife watching.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 float-grid">
            <article className="glass glass-pad card-3d reveal">
              <h3 className="h-card">What we can arrange</h3>
              <ul className="mt-4 space-y-2.5">
                {LOGISTICS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-wd-muted">
                    <span aria-hidden="true" className="mt-2 flex-none w-1.5 h-1.5 rounded-full bg-wd-lime" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="glass glass-strong glass-pad card-3d reveal !border-[rgba(242,177,52,0.45)]" style={delay(100)}>
              <span className="chip chip-sun">Required for every guest</span>
              <h3 className="h-card mt-4">Health &amp; insurance</h3>
              <p className="mt-2 text-sm leading-relaxed text-wd-ink/90">
                Every member of the group, students and staff included, needs comprehensive travel medical insurance
                and must tell us about any medical condition or allergy before booking. Many routes are remote, and the
                nearest hospital can be hours away.
              </p>
              <Link href="/practical/#health" className="link-arrow text-sm mt-4">Health, insurance &amp; medical information</Link>
            </article>
          </div>
          <p className="wd-note reveal mt-8">
            <InfoIcon />
            <span>{wildlifeDisclaimer}</span>
          </p>
        </div>
      </section>

      <section className="wd-section">
        <div className="wd-wrap wd-wrap--narrow">
          <div className="glass glass-pad card-3d reveal text-center">
            <p className="eyebrow">Start planning</p>
            <h2 className="h-section">Tell us what your group wants</h2>
            <p className="lede mt-4 max-w-2xl mx-auto">
              Share your dates, group size, ages, interests, budget range and comfort level. We will suggest a route
              and a guided programme.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={waLink(GROUP_ENQUIRY)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                <WhatsAppIcon /> Plan on WhatsApp
              </a>
              <Link href="/contact/" className="btn btn-ghost btn-lg">Send an enquiry</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
