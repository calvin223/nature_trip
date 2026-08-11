'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { species } from '@/lib/data';
import { speciesTabs, photosForTab, speciesMatchesTab, tabForPhotoCategory, findPhoto, img } from '@/lib/photos';

/* species-card id -> field photo slug, where our archive has a matching shot */
const speciesPhotoSlugs: Record<string, string> = {
  'bengal-tiger': 'bengal-tiger',
  'asiatic-lion': 'asiatic-lion',
  'great-hornbill': 'great-indian-hornbill',
  'southern-birdwing': 'southern-birdwing',
  'rhododendron': 'nilgiri-rhododendron',
};

export default function SpeciesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  /* Home page deep-links in as /species#cat-birds — open that tab. */
  useEffect(() => {
    const applyHash = () => {
      const match = /^#cat-(.+)$/.exec(window.location.hash);
      const tab = match ? tabForPhotoCategory(match[1]) : undefined;
      if (tab) setSelectedCategory(tab);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const filteredSpecies = species.filter((s) => speciesMatchesTab(s.category, selectedCategory));
  const galleryPhotos = photosForTab(selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#33361f] to-[#5b6b3a] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Species We Focus On</h1>
          <p className="text-xl text-gray-100">
            Big cats, birds, mammals, reptiles, amphibians, butterflies, plants, and local specialities we build India routes around
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {speciesTabs.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#b5651d] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Species Grid — some tabs are covered by the field gallery alone, so skip it when empty. */}
      <section className={filteredSpecies.length === 0 ? 'hidden' : 'py-12'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecies.map((sp) => (
              <div key={sp.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {(() => {
                  const p = findPhoto(speciesPhotoSlugs[sp.id]);
                  if (!p) return null;
                  return (
                    <div className="relative h-48 bg-gradient-to-br from-[#5b6b3a] to-[#33361f]">
                      <img src={img(p.src)} alt={sp.commonName} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  );
                })()}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-[#5b6b3a] text-white text-xs px-2 py-1 rounded">
                      {sp.category}
                    </span>
                    {sp.endemic && (
                      <span className="bg-[#b5651d] text-white text-xs px-2 py-1 rounded">
                        Endemic
                      </span>
                    )}
                    {sp.threatened && (
                      <span className="bg-[#c0392b] text-white text-xs px-2 py-1 rounded">
                        Threatened
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1 text-[#33361f]">{sp.commonName}</h3>
                  <p className="text-sm text-gray-600 italic mb-3">{sp.scientificName}</p>
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Habitat:</span> {sp.habitat}
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    <span className="font-semibold">Field Note:</span> {sp.fieldNote}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Field photo gallery */}
      <section className="py-16 bg-[#262714]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#b5651d] font-semibold uppercase tracking-wide text-sm mb-2">Photographed on our expeditions</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Field Photo Gallery</h2>
            <p className="text-green-50/70 mt-3 max-w-2xl mx-auto text-sm">
              {galleryPhotos.length} photograph{galleryPhotos.length === 1 ? '' : 's'}
              {selectedCategory === 'All' ? '' : ` in ${selectedCategory}`}, all taken in the field by our guides and guests.
            </p>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>*]:mb-3">
            {galleryPhotos.map((p) => (
              <div key={p.slug} className="photo-tile photo-tile--captioned break-inside-avoid">
                <img src={img(p.src)} alt={`${p.name} — ${p.categoryLabel}`} loading="lazy" decoding="async" style={{ aspectRatio: `${p.w} / ${p.h}` }} />
                <span className="photo-tile__caption">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Endemic Species */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#33361f]">
            Why Local Specialities Matter
          </h2>
          <p className="text-gray-700 mb-4">
            Some species are widespread icons, while others are tied to a narrow Indian region, habitat, altitude, river system, island, or season. Both kinds of wildlife shape a good expedition.
          </p>
          <p className="text-gray-700 mb-4">
            Endemic and threatened species are especially important because they depend on specific habitats. When those habitats are damaged, there may be no easy second chance elsewhere.
          </p>
          <p className="text-gray-700">
            On our guided tours, we focus on the endemic and locally special species most likely in each route and season, while keeping observation ethical and low-impact.
          </p>
        </div>
      </section>

      {/* Ethical Observation */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#33361f]">
            Ethical Wildlife Observation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border-l-4 border-green-600 p-4">
              <h3 className="font-semibold text-green-900 mb-2">We DO:</h3>
              <ul className="space-y-1 text-sm text-green-800">
                <li>- Maintain safe distances from wildlife</li>
                <li>- Use ethical photography practices</li>
                <li>- Teach identification by sight and sound</li>
                <li>- Respect animal behavior and habitats</li>
                <li>- Support local conservation efforts</li>
              </ul>
            </div>
            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-semibold text-red-900 mb-2">We DON&apos;T:</h3>
              <ul className="space-y-1 text-sm text-red-800">
                <li>- Use bird call playback (audio luring)</li>
                <li>- Disturb nesting or breeding animals</li>
                <li>- Handle wildlife unnecessarily</li>
                <li>- Collect specimens or eggs</li>
                <li>- Trample vegetation for photos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#33361f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">See These Species in the Wild</h2>
          <p className="text-lg mb-8 text-gray-200">
            Join a guided India wildlife trip built around the right region, habitat, and season — small groups, so nobody misses the sighting.
          </p>
          <Link
            href="/trips"
            className="inline-block bg-[#b5651d] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8f4e14] transition-colors"
          >
            Browse Trips With Spots Open
          </Link>
        </div>
      </section>
    </div>
  );
}
