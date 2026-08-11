import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Group Programmes | Wildora Expeditions',
  description: 'Tailor-made guided India wildlife programmes for families, private groups, international visitors, photographers, companies, schools and universities.',
};

const groupTypes = [
  {
    title: 'Families & Friends',
    body: 'Easy-paced nature days with safaris, short walks, birding, viewpoints, local food, and enough downtime for mixed ages.'
  },
  {
    title: 'International Visitors',
    body: 'Airport transfers, currency-friendly quotes, route notes, comfort planning, and guided wildlife time shaped around flight schedules.'
  },
  {
    title: 'Birding & Photography Groups',
    body: 'Target birds, mammals, macro subjects, big cats, low-light rainforest sessions, and patient field support for small specialist groups.'
  },
  {
    title: 'Clubs, Companies & Retreats',
    body: 'Nature immersion, team days, light conservation activities, lodge-based wildlife, landscape trails, and guided forest experiences.'
  },
  {
    title: 'Schools & Universities',
    body: 'Academic modules, student camps, field methods, and curriculum-linked sessions remain available when requested.'
  },
  {
    title: 'Private Naturalist Tours',
    body: 'A dedicated guide, custom route, flexible daily rhythm, and a species list shaped around your personal interests.'
  }
];

const customOptions = [
  'Target species: tigers, leopards, elephants, hornbills, pheasants, frogs, reptiles, butterflies, mammals, orchids, or habitat specialities',
  'Trip style: relaxed holiday, safari-focused, photography-focused, adventurous monsoon, family-friendly, or academic',
  'Activities: jeep safaris, birding, night walks, wetland visits, desert drives, waterfall stops, mountain trails, local markets, and checklist sessions',
  'Comfort: lodge category, safari intensity, walking difficulty, rooming preferences, food needs, transport, and airport pick-up',
  'Length: half-day guiding, weekend breaks, 4-7 day tours, or longer multi-region routes'
];

export default function CustomGroupsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-[#33361f] to-[#5b6b3a] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Custom Guided Programmes</h1>
          <p className="text-xl text-gray-100">
            Tailor-made India wildlife experiences for private groups, families, visitors from abroad, photographers, companies, schools and universities.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-gray-700 mb-6">
            Our default style is not a classroom-style field course. We design guided programmes around what your group wants to experience: safaris, birds, mammals, forests, deserts, wetlands, mountains, night trails, local food, photography time, and comfortable travel.
          </p>
          <p className="text-lg text-gray-700">
            If you need an academic version, we can still build one. But for most groups, the priority is a memorable, well-guided nature holiday with expert interpretation in the field.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#33361f]">Who We Build For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupTypes.map((group) => (
              <div key={group.title} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-[#5b6b3a]">{group.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{group.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#33361f]">What Can Be Customized</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <ul className="space-y-4">
              {customOptions.map((option) => (
                <li key={option} className="flex items-start gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-[#b5651d] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f3eedf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#33361f]">Sample Leisure Group Day</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#33361f] text-white">
                  <tr>
                    <th className="p-4">Time</th>
                    <th className="p-4">Experience</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-4 font-semibold">06:00 - 09:00</td>
                    <td className="p-4">Guided safari, birding, wetland, or forest walk while wildlife is active</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-semibold">09:00 - 11:00</td>
                    <td className="p-4">Breakfast, checklist notes, and free time</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">11:00 - 13:00</td>
                    <td className="p-4">Village, landscape, river, forest, desert, tea, spice, or viewpoint visit depending on the region</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-semibold">13:00 - 15:30</td>
                    <td className="p-4">Lunch and rest during the hottest or wettest part of the day</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">15:30 - 18:00</td>
                    <td className="p-4">Forest-edge walk, safari drive, photography session, wetland visit, or scenic drive</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-semibold">After dinner</td>
                    <td className="p-4">Optional night walk for frogs, reptiles, owls, moths, and rainforest sounds</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            The rhythm changes with season, weather, permits, age range, and group energy.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#33361f]">Academic Options When Needed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#5b6b3a]">Short Modules</h3>
              <p className="text-gray-700 text-sm">Three to five day programmes introducing tropical ecology, species observation, and conservation stories through field time.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#5b6b3a]">Field Courses</h3>
              <p className="text-gray-700 text-sm">Longer programmes for colleges and universities with field methods, data recording, student projects, and review sessions.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#5b6b3a]">Youth Camps</h3>
              <p className="text-gray-700 text-sm">Safe, structured camps with age-appropriate nature walks, activities, observation skills, and guided group reflection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#33361f]">Safety & Logistics</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Every custom programme is planned around group size, age range, walking ability, weather, forest access, transport time, food needs, and safe wildlife observation.
            </p>
            <div className="bg-white border-l-4 border-[#5b6b3a] p-4">
              <h3 className="font-semibold text-[#33361f] mb-2">We can arrange:</h3>
              <ul className="space-y-1 text-sm">
                <li>- Airport or rail pick-up where practical</li>
                <li>- Internal transport between field sites</li>
                <li>- Accommodation matched to comfort and budget</li>
                <li>- Dietary planning and vegetarian-friendly meals</li>
                <li>- Local permits and access coordination</li>
                <li>- Route notes, packing guidance, and target species lists</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#33361f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Tell Us What Your Group Wants</h2>
          <p className="text-lg mb-8 text-gray-200">
            Share your dates, group size, interests, budget range, and comfort level. Most groups get a suggested route and quote within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#b5651d] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8f4e14] transition-colors"
          >
            Get My Custom Plan
          </Link>
        </div>
      </section>
    </div>
  );
}
