'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-dark-secondary py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-gray-100 mb-4">
              <span className="text-strava">⚡</span>
              SmartWatts
            </div>
            <p className="text-sm text-gray-400">
              AI-powered cycling performance analytics for serious cyclists.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-100 mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gray-100">Dashboard</a></li>
              <li><a href="#" className="hover:text-gray-100">Analytics</a></li>
              <li><a href="#" className="hover:text-gray-100">AI Coach</a></li>
              <li><a href="#" className="hover:text-gray-100">Pricing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-100 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gray-100">Documentation</a></li>
              <li><a href="#" className="hover:text-gray-100">Blog</a></li>
              <li><a href="#" className="hover:text-gray-100">API</a></li>
              <li><a href="#" className="hover:text-gray-100">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-100 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gray-100">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-100">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-100">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} SmartWatts. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-gray-100 text-sm">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-gray-100 text-sm">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-gray-100 text-sm">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
