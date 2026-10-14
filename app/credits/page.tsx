import type { Metadata } from 'next';
import Link from 'next/link';
import { peoplePhotos } from '@/lib/peoplePhotos';
import { img } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'Photo & Map Credits',
  description: 'Photographers, licences and map data sources used on the Wildora Expeditions website.',
};

export default function CreditsPage() {
  return (
    <>
      <section className="wd-page-head">
        <div className="wd-wrap wd-wrap--narrow">
          <p className="eyebrow">Credits</p>
          <h1 className="h-display mb-4">Photo &amp; map credits</h1>
          <p className="lede">We only use images and map data we have the right to use. Here is where each one comes from.</p>
        </div>
      </section>

      <section className="wd-section--tight">
        <div className="wd-wrap wd-wrap--narrow space-y-6">
          <div className="glass glass-pad">
            <h2 className="h-card mb-2">Wildlife and habitat photographs</h2>
            <p className="text-wd-muted leading-relaxed">
              Photographs of species and habitats across the site were supplied by the Wildora team. Please do not reuse them without permission.
            </p>
          </div>

          <div className="glass glass-pad">
            <h2 className="h-card mb-2">People in the field</h2>
            <p className="text-wd-muted leading-relaxed mb-5">
              Illustrative photographs of travellers, used under open licences. They are chosen so that no one is identifiable, and they do not show Wildora guests.
            </p>
            {peoplePhotos.length === 0 ? (
              <p className="text-wd-faint">None in use.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {peoplePhotos.map((p) => (
                  <li key={p.slug} className="py-4 flex gap-4 items-start">
                    <img src={img(p.thumb)} alt="" loading="lazy" decoding="async" className="w-24 h-16 object-cover rounded-lg flex-shrink-0 border border-[var(--wd-line)]" />
                    <div className="text-sm leading-relaxed">
                      <p className="text-wd-ink">{p.alt}</p>
                      <p className="text-wd-faint">
                        Photo: {p.credit.author} ·{' '}
                        <a href={p.credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">{p.credit.source}</a> ·{' '}
                        <a href={p.credit.licenceUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-white">{p.credit.licence}</a>
                      </p>
                      <p className="text-wd-faint text-xs">Changes: {p.credit.changes ?? 'resized and converted to WebP'}.</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass glass-pad">
            <h2 className="h-card mb-2">Maps</h2>
            <p className="text-wd-muted leading-relaxed">
              Maps are drawn from{' '}
              <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-wd-lime">Natural Earth</a>{' '}
              data, which is in the public domain. India&apos;s boundaries follow Natural Earth&apos;s India point-of-view dataset. Route lines and stop positions are approximate and for orientation only.
              Links to individual places open in{' '}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-wd-lime">OpenStreetMap</a> (© OpenStreetMap contributors).
            </p>
          </div>

          <div className="glass glass-pad">
            <h2 className="h-card mb-2">Typefaces</h2>
            <p className="text-wd-muted leading-relaxed">Fraunces and Geist, both under the SIL Open Font License.</p>
          </div>

          <p className="text-sm text-wd-faint">
            Think something here is yours and credited wrongly? <Link href="/contact/" className="underline underline-offset-2 hover:text-white">Tell us</Link> and we will fix or remove it.
          </p>
        </div>
      </section>
    </>
  );
}
