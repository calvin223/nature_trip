'use client';

import { useState } from 'react';
import { faqs } from '@/lib/data';

export default function PracticalPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#33361f] to-[#5b6b3a] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Practical Info & FAQ</h1>
          <p className="text-xl text-gray-100">
            Seasons, fitness, packing, comfort, safety, and custom tour details
          </p>
        </div>
      </section>

      {/* Best Seasons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#33361f]">Best Seasons to Visit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-[#5b6b3a]">Monsoon (Jun-Sep)</h3>
              <p className="text-sm text-gray-700 mb-3">
                Heavy rainfall in many regions, lush forests, and dramatic landscapes. Best for rainforest frogs, reptiles, waterfalls, and green habitats. Be prepared for leeches and wet conditions on relevant routes.
              </p>
              <div className="text-xs text-gray-600">
                <strong>Best for:</strong> Rainforests, herping, waterfalls
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-[#b5651d]">
              <div className="bg-[#b5651d] text-white text-xs px-2 py-1 rounded inline-block mb-2">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#5b6b3a]">Cool Season (Oct-Mar)</h3>
              <p className="text-sm text-gray-700 mb-3">
                Pleasant weather in many regions, strong birding, wetlands, deserts, family travel, and comfortable safari conditions.
              </p>
              <div className="text-xs text-gray-600">
                <strong>Best for:</strong> Birding, wetlands, safaris, family trips
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-[#5b6b3a]">Dry Safari Season (Mar-Jun)</h3>
              <p className="text-sm text-gray-700 mb-3">
                Drier conditions can concentrate wildlife near water in many forest reserves. Higher elevations remain cooler. Good visibility for mammals and many safari routes.
              </p>
              <div className="text-xs text-gray-600">
                <strong>Best for:</strong> Big cats, mammals, photography
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Levels */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#33361f]">Understanding Difficulty Levels</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Easy</h3>
              <p className="text-gray-700">
                Mostly vehicle-based safaris, lodge walks, easy wetland visits, or gentle trails. Suitable for most fitness levels including families with children.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-yellow-700">Moderate</h3>
              <p className="text-gray-700">
                Walks of 4-8 km per day, uneven trails, warmer safari days, rainforest conditions, or some elevation changes. Requires basic fitness and comfort outdoors.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-red-700">Challenging</h3>
              <p className="text-gray-700">
                Longer walks, high altitude, cold desert, steep trails, remote habitat, or extended field hours. Requires good physical fitness and stamina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Pack */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#33361f]">What to Pack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#5b6b3a]">Essential Gear</h3>
              <ul className="space-y-2 text-gray-700">
                <li>- Sturdy walking shoes or boots</li>
                <li>- Rain jacket (waterproof, not just water-resistant)</li>
                <li>- Long pants and full-sleeve shirts</li>
                <li>- Warm layer for evenings/high altitudes</li>
                <li>- Hat and sunscreen</li>
                <li>- Insect repellent</li>
                <li>- Reusable water bottle</li>
                <li>- Headlamp with extra batteries</li>
                <li>- Personal medications</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#5b6b3a]">Recommended Items</h3>
              <ul className="space-y-2 text-gray-700">
                <li>- Binoculars (8x or 10x magnification)</li>
                <li>- Camera with telephoto lens or macro option</li>
                <li>- Field notebook and pen</li>
                <li>- Field guides (we provide shared references, but personal copies are useful)</li>
                <li>- Dry bags for electronics</li>
                <li>- Small backpack for day trips</li>
                <li>- Power bank for charging devices</li>
                <li>- Plastic bags for wet clothes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#33361f]">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#33361f]">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-[#5b6b3a] transition-transform ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-[#33361f]">Accommodation & Food</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Accommodation:</strong> We use comfortable wildlife lodges, eco-lodges, guesthouses, camps, and nature-friendly stays with clean rooms and practical amenities. Rooms are typically twin-sharing; single occupancy may be available for a supplement.
            </p>
            <p>
              <strong>Meals:</strong> All meals are included and feature fresh, locally sourced vegetarian-friendly food. Meals are served in a relaxed style, with time to talk through the day&apos;s sightings and route. We can accommodate most dietary restrictions with advance notice (vegan, gluten-free, allergies).
            </p>
            <p>
              <strong>Water:</strong> Boiled/filtered drinking water is provided. We encourage using your own reusable bottle to minimize plastic waste.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#33361f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-lg mb-8 text-gray-200">
            We reply within 24 hours — ask us anything before you commit to dates.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#b5651d] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8f4e14] transition-colors"
          >
            Ask Us Anything
          </a>
        </div>
      </section>
    </div>
  );
}
