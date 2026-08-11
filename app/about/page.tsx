import type { Metadata } from 'next';
import { findPhoto, img } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'About Wild India | Wildora Expeditions',
  description: 'Learn about India wildlife regions, habitats, endemic species, national parks, reserves, and ethical guided nature travel across the country.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-[#33361f] to-[#5b6b3a] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Wildora Expeditions</h1>
          <p className="text-xl text-gray-100">
            One country, many wild worlds: rainforests, tiger forests, deserts, wetlands, mountains, mangroves, grasslands, and coastlines — and guides who&apos;ve spent decades in every one of them.
          </p>
        </div>
      </section>

      {/* Origin story / trust builder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-[#33361f]">Why Wildora Exists</h2>
          <div className="bg-white rounded-lg p-6 md:p-8 border-l-4 border-[#5b6b3a] shadow-sm space-y-4 text-gray-700">
            <p>
              Long before Wildora Expeditions had a name, our guides were already in the field — tracking Striped Hyena through Sanjay Dubri, documenting butterfly diversity in the Eastern Ghats, teaching tropical ecology at Bishop Heber College, and leading birdwatching walks through Ramsar wetlands. Tour guiding came later. The field time came first.
            </p>
            <p>
              We started Wildora because too many wildlife trips are run by logistics companies that hire a driver and call it a safari. We wanted the opposite: routes built by the same naturalists, researchers, and educators who&apos;d spend their own free weekend doing exactly this — just with better vehicles, better timing, and a lot less rushing.
            </p>
            <p>
              That&apos;s still how every itinerary gets built today: by people who know which waterhole the leopard actually uses, not just which one is on the map.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-[#33361f]">A Continent-Scale Wildlife Destination</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              India is one of the world&apos;s richest wildlife destinations because its habitats change dramatically across short distances. A single country can offer tiger safaris, Himalayan birding, desert foxes, river dolphins, mangrove cats, rainforest frogs, elephants, hornbills, butterflies, and winter wetlands.
            </p>
            <p>
              Wildora Expeditions plans routes around the wildlife, season, comfort level, and travel style you want. The aim is not to sell one fixed region, but to match the right Indian landscape to the right guest.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#33361f]">India Wildlife Regions We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Central Indian Forests',
                body: 'Tiger, leopard, wild dog, sloth bear, gaur, deer, owls, raptors, and dry forest birding across classic safari landscapes.',
                photo: 'dry-deciduous-forest'
              },
              {
                title: 'Himalaya & Foothills',
                body: 'Pheasants, raptors, red panda routes, mountain mammals, rhododendron forests, alpine views, and high-altitude extensions.',
                photo: 'nilgiri-rhododendron'
              },
              {
                title: 'Deserts & Grasslands',
                body: 'Desert fox, blackbuck, wolves, bustards, cranes, raptors, open-country birding, salt flats, and winter light.',
                photo: 'blackbuck'
              },
              {
                title: 'Wetlands, Rivers & Mangroves',
                body: 'Migratory birds, storks, cranes, otters, river dolphins, crocodiles, mangrove wildlife, and boat-based nature experiences.',
                photo: 'mangrove-creek'
              },
              {
                title: 'Rainforests & Monsoon Habitats',
                body: 'Frogs, reptiles, hornbills, butterflies, orchids, night walks, waterfalls, and rich forest soundscapes during the rains.',
                photo: 'evergreen-forest'
              },
              {
                title: 'Coasts & Islands',
                body: 'Marine-influenced habitats, coastal birds, mangroves, island forests, beaches, and relaxed nature-focused extensions.',
                photo: 'palmyra-palms'
              }
            ].map((region) => {
              const p = findPhoto(region.photo);
              return (
                <div key={region.title} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                  {p && (
                    <div className="h-44 overflow-hidden">
                      <img src={img(p.src)} alt={`${region.title} — ${p.name}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-[#5b6b3a]">{region.title}</h3>
                    <p className="text-gray-700">{region.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-[#33361f]">Endemics, Icons, and Hidden Wildlife</h2>
          <div className="bg-white rounded-lg p-6 border-l-4 border-[#b5651d] shadow-sm">
            <p className="text-gray-700 mb-6">
              India is famous for tigers, elephants, rhinos, lions, leopards, and peacocks, but its quieter wildlife is just as rewarding: frogs, reptiles, butterflies, hornbills, pheasants, endemic birds, orchids, insects, and nocturnal mammals. Our routes can focus on the headline species or the small, local specialities most visitors miss.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b5651d]">100+</div>
                <div className="text-sm text-gray-600">National parks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b5651d]">1300+</div>
                <div className="text-sm text-gray-600">Bird species</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b5651d]">500+</div>
                <div className="text-sm text-gray-600">Mammal species</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b5651d]">Many</div>
                <div className="text-sm text-gray-600">Endemic species</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#33361f]">Trip Styles Across India</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['Big Cat Safaris', 'Tiger, leopard, lion, snow leopard, and clouded habitat routes where suitable.'],
              ['Birding Expeditions', 'Wetlands, forests, deserts, mountains, migration routes, and target bird lists.'],
              ['Rainforest & Herping Trips', 'Monsoon frogs, reptiles, forest insects, night walks, and waterfall landscapes.'],
              ['Family Nature Holidays', 'Gentle walks, safaris, lodge time, food, scenery, and mixed-age pacing.'],
              ['Photography Routes', 'Mammals, birds, macro, low light, landscapes, and ethical fieldcraft.'],
              ['Custom India Circuits', 'Multi-region itineraries combining wildlife, culture, comfort, and seasonal highlights.']
            ].map(([title, body]) => (
              <div key={title} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-[#5b6b3a]">{title}</h3>
                <p className="text-gray-700 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#33361f]">Seasons Across India</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#5b6b3a] pl-6">
              <h3 className="text-xl font-semibold mb-2 text-[#33361f]">Winter & Early Spring (October - March)</h3>
              <p className="text-gray-700">
                Comfortable weather for birding, wetlands, family holidays, desert landscapes, forest walks, and many safari routes.
              </p>
            </div>
            <div className="border-l-4 border-[#b5651d] pl-6">
              <h3 className="text-xl font-semibold mb-2 text-[#33361f]">Dry Heat & Big Cat Season (March - June)</h3>
              <p className="text-gray-700">
                Hotter conditions often concentrate wildlife around water, making this a strong period for many tiger and dry forest safaris.
              </p>
            </div>
            <div className="border-l-4 border-[#5b6b3a] pl-6">
              <h3 className="text-xl font-semibold mb-2 text-[#33361f]">Monsoon (June - September)</h3>
              <p className="text-gray-700">
                Rain closes or changes access in some parks, but opens extraordinary rainforest, frog, reptile, waterfall, and green landscape experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#33361f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Ethical Wildlife Travel</h2>
          <div className="prose prose-lg max-w-none text-gray-200">
            <p className="mb-4">
              India&apos;s wildlife tourism only works when it respects park rules, local communities, animal behaviour, and habitat limits. We avoid baiting, risky handling, crowd pressure, and unrealistic sighting promises.
            </p>
            <p className="mb-4">
              Our role is to plan good routes, set honest expectations, work with local expertise, and help guests experience wild India without treating animals as props.
            </p>
            <p>
              By choosing ethical guided nature tourism, you support the long-term value of protected habitats and the people who live around them.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
