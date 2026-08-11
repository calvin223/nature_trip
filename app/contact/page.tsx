'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    groupType: '',
    preferredDates: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Until a backend/form service (e.g. Formspree, Getform) is connected,
    // hand off to the visitor's email client with the enquiry pre-filled.
    const subject = encodeURIComponent(`Trip enquiry from ${formData.name || 'website'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Country: ${formData.country}\n` +
      `Group type: ${formData.groupType}\n` +
      `Preferred dates, trip or target species: ${formData.preferredDates}\n\n` +
      `Message:\n${formData.message}`
    );
    window.location.href = `mailto:info@wildoraexpeditions.com?subject=${subject}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#33361f] to-[#5b6b3a] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Let&apos;s Plan Your Trip</h1>
          <p className="text-xl text-gray-100">
            Tell us your dates, group size, interests, and comfort level. We reply within 24 hours with a route and quote — no obligation.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#33361f]">Send an Enquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="groupType" className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Type *
                  </label>
                  <select
                    id="groupType"
                    name="groupType"
                    required
                    value={formData.groupType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="individual">Solo Traveller</option>
                    <option value="couple">Couple</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends / Private Group</option>
                    <option value="international">International Visitors</option>
                    <option value="photography">Photography / Birding Group</option>
                    <option value="corporate">Company / Retreat</option>
                    <option value="student-group">School Group</option>
                    <option value="university">University/College</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredDates" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Dates, Trip or Target Species
                  </label>
                  <input
                    type="text"
                    id="preferredDates"
                    name="preferredDates"
                    value={formData.preferredDates}
                    onChange={handleChange}
                    placeholder="e.g., December 2026, tiger safari, Himalayan birds, easy pace"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your group size, interests, fitness level, preferred comfort, target species, and any questions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5b6b3a] focus:border-transparent"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#b5651d] text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-[#8f4e14] transition-colors"
                >
                  Send My Enquiry
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#33361f]">Contact Information</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#5b6b3a] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-700">info@wildoraexpeditions.com</p>
                      <p className="text-sm text-gray-600 mt-1">We respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#5b6b3a] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-700">+91 98765 43210</p>
                      <p className="text-sm text-gray-600 mt-1">Monday - Saturday, 9 AM - 6 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#5b6b3a] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                      <p className="text-gray-700">+91 94431 61606</p>
                      <a
                        href="https://wa.me/919443161606"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#b5651d] hover:text-[#8f4e14] text-sm font-medium inline-block mt-2"
                      >
                        Start Chat -&gt;
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Response Guarantee</h3>
                <p className="text-sm text-blue-800">
                  We typically respond to all inquiries within 24 hours. For urgent requests, please call or WhatsApp us directly.
                </p>
              </div>

              {/* Office Hours */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">All times are India Standard Time (IST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section (Placeholder) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#33361f]">Where We Operate</h2>
          <div className="bg-gradient-to-br from-[#5b6b3a] to-[#33361f] rounded-lg h-96 flex items-center justify-center text-white">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xl">Wildlife Regions Across India</p>
              <p className="text-sm text-gray-200 mt-2">Forests, deserts, wetlands, mountains, rainforests, coasts, and custom routes nationwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Before You Go */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#33361f]">Before You Contact Us</h2>
          <p className="text-gray-700 mb-8">
            Many common questions are answered in our FAQ section. Check there first for seasons, packing, fitness level, safety, accommodation, meals, and custom tour options.
          </p>
          <a
            href="/practical"
            className="inline-block border-2 border-[#33361f] text-[#33361f] px-8 py-3 rounded-lg font-semibold hover:bg-[#33361f] hover:text-white transition-colors"
          >
            View FAQ
          </a>
        </div>
      </section>
    </div>
  );
}
