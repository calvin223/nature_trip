import Link from 'next/link';
import { trips, experts, services, reviews, trustSignals } from '@/lib/data';
import { photos, photoCategories, img, tripPhotoSlugs, findPhoto } from '@/lib/photos';
import HomeHero from '@/components/HomeHero';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-[#b5651d]" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < n ? 'currentColor' : 'none'} stroke="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.075 9.372c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.274-3.945z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section: full-bleed wildlife photo loop */}
      <HomeHero />

      {/* Trust marquee */}
      <section className="bg-[#33361f] text-green-50/90 py-4 overflow-hidden">
        <div className="flex w-max marquee-track">
          {[...trustSignals, ...trustSignals].map((s, i) => (
            <span key={i} className="flex items-center gap-3 px-8 text-sm font-medium whitespace-nowrap">
              <span className="text-[#b5651d]">*</span> {s}
            </span>
          ))}
        </div>
      </section>

      {/* Field photo film-strip: every photo in our archive, shot on our own trips */}
      <section className="py-14 bg-[#262714]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Shot in the field by our guides</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">What You&apos;ll See With Us</h2>
          <p className="text-green-50/70 mt-3 max-w-2xl mx-auto text-sm">
            Every photograph below was taken on our own expeditions — tigers, owls, bee-eaters, moths, frogs, orchids and the forests they live in.
          </p>
        </div>
        <div className="space-y-3">
          {[photos.filter((_, i) => i % 2 === 0), photos.filter((_, i) => i % 2 === 1)].map((row, r) => (
            <div key={r} className="photo-marquee">
              <div className={`photo-marquee-track${r === 1 ? ' photo-marquee-track--reverse' : ''}`}>
                {[...row, ...row].map((p, i) => (
                  <div key={`${p.slug}-${i}`} className="photo-tile h-32 md:h-40 flex-shrink-0" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                    <img src={img(p.thumb)} alt={p.name} loading="lazy" decoding="async" />
                    <span className="photo-tile__caption">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Why travel with us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#33361f] mb-4">
              Most Wildlife Trips Rush You. This One Doesn&apos;t.
            </h2>
            <p className="text-gray-600">
              A packed checklist and a driver watching the clock is how most people &ldquo;see&rdquo; India&apos;s wildlife — long drives, distant blurs, and a guide who&apos;s already thinking about the next stop. We built Wildora around the opposite idea: unhurried field time, capped group sizes, and naturalists who slow down for the sighting that matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { t: 'Guided India Wildlife Tours', d: 'Safaris, birding, butterflies, rainforest walks, wetlands, deserts, mountains, and night trails led by experts.', icon: 'book' },
              { t: 'Routes by Region', d: "Trips are matched to India's best wildlife seasons, habitats, target species, and your comfort level.", icon: 'globe' },
              { t: 'Leisure-First Pace', d: 'Field time, photography, viewpoints, food, and rest are balanced into every itinerary.', icon: 'check' },
              { t: 'Custom Groups', d: 'Private tours and group programmes can be built around your dates and interests.', icon: 'heart' },
            ].map((c) => (
              <div key={c.t} className="text-center card-lift bg-white rounded-2xl border border-gray-100 p-6">
                <div className="w-16 h-16 bg-[#5b6b3a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={c.icon} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#33361f]">{c.t}</h3>
                <p className="text-gray-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Field gallery bento */}
      <section className="py-20 bg-[#f3eedf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">From our field archives</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#33361f]">Moments Worth Travelling For</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[9rem] md:auto-rows-[11rem]">
            {[
              { slug: 'tigress-with-cubs', span: 'col-span-2 row-span-2' },
              { slug: 'indian-paradise-flycatcher', span: 'row-span-2' },
              { slug: 'lion-tailed-macaque', span: '' },
              { slug: 'atlas-moth', span: '' },
              { slug: 'asiatic-lion', span: 'col-span-2' },
              { slug: 'indian-chameleon', span: 'row-span-2' },
              { slug: 'indian-roller', span: '' },
              { slug: 'grassland-shola-mosaic', span: 'col-span-2' },
              { slug: 'southern-birdwing', span: '' },
            ].map(({ slug, span }) => {
              const p = findPhoto(slug);
              if (!p) return null;
              return (
                <Link key={slug} href={`/species#cat-${p.category}`} className={`photo-tile photo-tile--captioned block ${span}`}>
                  <img src={img(p.src)} alt={`${p.name} — ${p.categoryLabel}`} loading="lazy" decoding="async" />
                  <span className="photo-tile__caption">{p.name} · {p.categoryLabel}</span>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/species" className="inline-block text-[#33361f] font-semibold hover:text-[#5b6b3a] transition-colors">
              Browse the Full Species Gallery -&gt;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-20 bg-[#f3eedf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Upcoming departures — filling now</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#33361f]">Featured Trips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-lift flex flex-col">
                <div className="relative h-48 bg-gradient-to-br from-[#4a5230] to-[#33361f] leaf-texture">
                  {(() => {
                    const p = findPhoto(tripPhotoSlugs[trip.id]);
                    if (!p) return null;
                    /* Re-cropped photos are framed head-first, so anchor to the top rather than the centre. */
                    return <img src={img(p.wide ?? p.src)} alt={p.name} loading="lazy" decoding="async" className={`absolute inset-0 w-full h-full object-cover ${p.wide ? 'object-top' : ''}`} />;
                  })()}
                  {typeof trip.spotsLeft === 'number' && trip.spotsLeft <= 6 && (
                    <span className="absolute top-3 left-3 bg-[#9a3324] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Only {trip.spotsLeft} spots left
                    </span>
                  )}
                  {trip.region && (
                    <span className="absolute bottom-3 left-3 bg-black/40 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
                      {trip.region}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-[#33361f]">{trip.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{trip.description}</p>
                  <div className="space-y-1.5 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-2"><Clock /> {trip.duration}</div>
                    <div className="flex items-center gap-2"><Signal /> {trip.difficulty} - {trip.targetSpecies}</div>
                    {trip.nextDeparture && (
                      <div className="flex items-center gap-2 text-[#b5651d] font-medium"><Calendar /> Next departure: {trip.nextDeparture}</div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.focus.map((f, idx) => (
                      <span key={idx} className="bg-[#f3eedf] text-[#33361f] border border-[#ded3b0] text-xs px-2 py-1 rounded">{f}</span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-[#33361f]">{trip.price}</span>
                    </div>
                    <Link href={`/trips/${trip.id}`} className="block text-center bg-[#b5651d] text-white px-4 py-3 rounded-lg hover:bg-[#8f4e14] transition-colors font-semibold">
                      {typeof trip.spotsLeft === 'number' && trip.spotsLeft <= 6 ? 'Check Availability' : 'View Itinerary'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/trips" className="inline-block text-[#33361f] font-semibold hover:text-[#5b6b3a] transition-colors">
              View All Trips &amp; Custom Options -&gt;
            </Link>
          </div>
        </div>
      </section>

      {/* Explore by category */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Explore by group</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#33361f]">Wildlife We Track, Watch &amp; Photograph</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              ['birds', 'white-throated-kingfisher'],
              ['mammals', 'indian-leopard'],
              ['butterflies', 'common-map'],
              ['moths', 'indian-moon-moth'],
              ['reptiles', 'indian-star-tortoise'],
              ['amphibians', 'painted-frog'],
              ['invertebrates', 'giant-wood-spider'],
              ['plants-habitats', 'montane-shola-forest'],
            ].map(([catId, slug]) => {
              const cat = photoCategories.find((c) => c.id === catId);
              const p = findPhoto(slug);
              if (!cat || !p) return null;
              return (
                <Link key={catId} href={`/species#cat-${catId}`} className="photo-tile block h-44 md:h-52 card-lift">
                  <img src={img(p.src)} alt={`${cat.label} — ${p.name}`} loading="lazy" decoding="async" />
                  <span className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#1c1d10]/90 to-transparent text-white">
                    <span className="block font-bold">{cat.label}</span>
                    <span className="block text-xs text-green-50/80">{cat.count} field photo{cat.count > 1 ? 's' : ''}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services / Experiences */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Guided services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#33361f] mb-3">Experiences &amp; Services We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Book a fixed departure, add a guided day tour, or ask us to build a private programme around your target species, group size, and comfort level.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-6 card-lift">
                <ServiceIcon name={s.icon} />
                <h3 className="font-semibold text-[#33361f] mb-1">{s.title}</h3>
                <p className="text-xs text-[#b5651d] font-medium mb-2">{s.tagline}</p>
                <p className="text-sm text-gray-600 mb-3">{s.description}</p>
                <p className="text-xs text-gray-500"><span className="font-semibold">Best for:</span> {s.forWho}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="inline-block bg-[#33361f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a5230] transition-colors">
              Design My Guided Experience
            </Link>
          </div>
        </div>
      </section>

      {/* International visitors band */}
      <section className="py-16 bg-[#33361f] text-white relative overflow-hidden">
        <div className="absolute inset-0 leaf-texture opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Travelling from abroad?</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Made simple for international visitors</h2>
            <p className="text-green-50/90 mb-6">
              Many guests fly in from the UK, Europe, North America and Australia. We handle route planning across India so you can focus on wildlife, scenery, and downtime.
            </p>
            <ul className="space-y-3 text-green-50/90">
              {[
                'Pricing available in USD, GBP and EUR',
                'Route planning around Delhi, Mumbai, Bengaluru, Kochi, Chennai, Kolkata, Jaipur, Guwahati, Nagpur and other gateways',
                'Target-species lists, park timing and route notes before you travel',
                'Secure deposits, clear cancellation terms and insurance guidance',
                'Comfortable eco-lodges, vegetarian-friendly food, all transport arranged',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3"><span className="text-[#b5651d] mt-1"><Check /></span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white/95 text-gray-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-[#33361f] mb-2">Plan your visit</h3>
            <p className="text-sm text-gray-600 mb-5">Tell us your dates, group size, comfort level, and target species. We&apos;ll reply within 24 hours with a tailored plan and quote in your currency.</p>
            <Link href="/contact" className="block text-center bg-[#b5651d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8f4e14] transition-colors mb-3">
              Request a Custom Quote
            </Link>
            <a href="https://wa.me/919443161606" target="_blank" rel="noopener noreferrer" className="block text-center border border-[#33361f] text-[#33361f] px-6 py-3 rounded-lg font-semibold hover:bg-[#33361f] hover:text-white transition-colors">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#f3eedf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#33361f]">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <Stars n={r.rating} />
                <p className="text-gray-700 italic my-4 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <p className="text-sm font-semibold text-[#33361f]">{r.name}</p>
                <p className="text-xs text-gray-500">{r.country} - {r.trip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Experts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">The people who guide you</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#33361f]">Meet Our Experts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-2xl shadow-md p-6 text-center card-lift border border-gray-100">
                {expert.imageUrl ? (
                  <img
                    src={img(expert.imageUrl)}
                    alt={expert.name}
                    loading="lazy"
                    decoding="async"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-[#4a5230] to-[#33361f] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {expert.name.split(' ').filter((w) => w.length > 1)[0]?.[0]}
                    {expert.name.split(' ').filter((w) => w.length > 1)[1]?.[0]}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-1 text-[#33361f]">{expert.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{expert.qualifications}</p>
                <p className="text-sm text-[#5b6b3a] font-medium mb-2">{expert.specialization}</p>
                <p className="text-xs text-gray-500">{expert.experience}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/experts" className="inline-block text-[#33361f] font-semibold hover:text-[#5b6b3a] transition-colors">
              Learn More About Our Team -&gt;
            </Link>
          </div>
        </div>
      </section>

      {/* Lead magnet / checklist */}
      <section id="checklist" className="py-20 bg-[#f3eedf]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Free download — no strings attached</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#33361f] mb-3">The India Wildlife Trip-Planning Checklist</h2>
              <p className="text-gray-600 mb-4">The same route-planning notes our guides use, in one place: target species, seasons, and region choices, so you book the right trip the first time.</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-2">
                <li className="flex items-center gap-2"><Check /> Safaris, birding, wetlands, mountains and rainforests</li>
                <li className="flex items-center gap-2"><Check /> Seasonal timing guide</li>
                <li className="flex items-center gap-2"><Check /> Site-by-site notes</li>
              </ul>
            </div>
            <form className="md:col-span-2 space-y-3">
              <input type="text" placeholder="Your name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent" />
              <input type="email" placeholder="Email address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent" />
              <button type="submit" className="w-full bg-[#b5651d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8f4e14] transition-colors">
                Send Me the Checklist
              </button>
              <p className="text-xs text-gray-400 text-center">No spam. Unsubscribe anytime.</p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-canopy text-white relative overflow-hidden">
        <div className="absolute inset-0 leaf-texture opacity-50"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Go Where the Wild Things Are?</h2>
          <p className="text-xl mb-8 text-green-50/90">
            Groups are capped at 10-12 guests, and our most-requested routes lock in months ahead. Claim your season, or tell us what you&apos;re after and we&apos;ll build a private programme around it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trips" className="bg-[#b5651d] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8f4e14] transition-colors shadow-lg">
              Browse Trips With Spots Open
            </Link>
            <Link href="/contact" className="bg-white/10 backdrop-blur border border-white/40 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-colors">
              Ask About Dates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- Inline icon helpers --- */
function Check() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function Clock() {
  return (
    <svg className="w-4 h-4 text-[#5b6b3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function Signal() {
  return (
    <svg className="w-4 h-4 text-[#5b6b3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
function Calendar() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function ServiceIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    guide: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0 0l3-9-9 3 6 6z',
    camera: 'M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm9 8a4 4 0 100-8 4 4 0 000 8z',
    moon: 'M21 12.8A8.5 8.5 0 1111.2 3a6.5 6.5 0 009.8 9.8z',
    map: 'M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3zm0 0V3m6 18V6',
    family: 'M16 11a4 4 0 10-8 0v1H6a3 3 0 00-3 3v3h18v-3a3 3 0 00-3-3h-2v-1z',
    leaf: 'M20 4C11 4 5 9 5 17c0 1.5.5 2.8 1.4 3.8C8 12 13 8 20 4z',
    groups: 'M8 11a4 4 0 118 0v1h1.5a3.5 3.5 0 013.5 3.5V19H3v-3.5A3.5 3.5 0 016.5 12H8v-1z',
    school: 'M12 3l9 5-9 5-9-5 9-5zm-5 8v4c0 2 2.5 4 5 4s5-2 5-4v-4',
  };

  return (
    <div className="w-12 h-12 bg-[#f3eedf] border border-[#ded3b0] rounded-lg flex items-center justify-center mb-4 text-[#5b6b3a]">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[name]} />
      </svg>
    </div>
  );
}
function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    globe: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  };
  return (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[name]} />
    </svg>
  );
}
