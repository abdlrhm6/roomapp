import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Find Roommates', href: '/find' },
    { name: 'List Your Space', href: '/list' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: '#' },
    { icon: FaTwitter, href: '#' },
    { icon: FaInstagram, href: '#' },
    { icon: FaLinkedinIn, href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div>
            <h3 className="text-3xl font-bold mb-4">Roomat.</h3>
            <p className="text-sm mb-4">Find your perfect roommate with ease.</p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.href} className="text-white hover:text-blue-200 transition-colors">
                  <link.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-blue-200 transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-xl font-semibold mb-4">Stay Connected</h4>
            <p className="mb-4">Subscribe to our newsletter for the latest updates and roommate tips.</p>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white bg-opacity-20 text-white placeholder-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300 flex-grow"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-400 transition-colors mt-2 sm:mt-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white border-opacity-20 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Roomat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
