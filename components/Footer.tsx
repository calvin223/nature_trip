import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#33361f] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-1">Wildora Expeditions</h3>
            <p className="text-[#b5651d] text-sm font-medium mb-4">Discover Nature. Experience the wild.</p>
            <p className="text-gray-300 text-sm">
              Small-group, expert-led wildlife holidays across India, covering forests, deserts, wetlands, mountains, rainforests, coasts, and custom group routes. 25+ years in the field.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Wild India
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-gray-300 hover:text-white transition-colors">
                  Our Trips
                </Link>
              </li>
              <li>
                <Link href="/experts" className="text-gray-300 hover:text-white transition-colors">
                  Our Experts
                </Link>
              </li>
              <li>
                <Link href="/species" className="text-gray-300 hover:text-white transition-colors">
                  Species Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/schools" className="text-gray-300 hover:text-white transition-colors">
                  Custom Groups
                </Link>
              </li>
              <li>
                <Link href="/practical" className="text-gray-300 hover:text-white transition-colors">
                  Practical Info & FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: info@wildoraexpeditions.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>WhatsApp: +91 94431 61606</li>
              <li className="pt-2">
                <Link href="/contact" className="text-[#b5651d] hover:text-[#8f4e14] font-medium">
                  Check availability -&gt;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Wildora Expeditions. All rights reserved.</p>
          <p className="mt-2">
            Committed to ethical wildlife tourism, local expertise, and low-impact travel.
          </p>
        </div>
      </div>
    </footer>
  );
}
