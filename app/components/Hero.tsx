import { FaSearch, FaUsers, FaHome, FaGlobe, FaCheckCircle } from 'react-icons/fa';

export default function Hero() {
  const stats = [
    { icon: FaUsers, value: '10,000+', label: 'Happy Users' },
    { icon: FaHome, value: '5,000+', label: 'Rooms Created' },
    { icon: FaGlobe, value: '50+', label: 'Countries' },
  ];

  const topCountries = [
    { name: 'USA', flag: '🇺🇸' },
    { name: 'UK', flag: '🇬🇧' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Germany', flag: '🇩🇪' },
  ];

  const services = [
    'Verified Listings',
    'Secure Payments',
    '24/7 Support',
    'Roommate Matching',
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Create a profile', 'Browse listings', 'Message up to 5 users/month'],
    },
    {
      name: 'Premium',
      price: '$9.99/month',
      features: ['All Basic features', 'Unlimited messaging', 'Featured profile', 'Early access to new listings'],
    },
    {
      name: 'Pro',
      price: '$19.99/month',
      features: ['All Premium features', 'Background checks', 'Priority support', 'Roommate matching algorithm'],
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Roommate</h1>
          <p className="text-xl md:text-2xl mb-8">Connect, Share, and Thrive in Your Ideal Living Space</p>
          
          {/* Search Form */}
          <form className="max-w-3xl mx-auto bg-white rounded-full p-2 flex flex-wrap items-center justify-center shadow-lg">
            <input
              type="text"
              placeholder="Enter city or neighborhood"
              className="flex-grow px-6 py-3 rounded-full text-gray-800 focus:outline-none"
            />
            <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 mt-2 md:mt-0">
              <FaSearch className="inline-block mr-2" />
              Search
            </button>
          </form>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white bg-opacity-20 rounded-lg p-6 backdrop-filter backdrop-blur-lg">
              <stat.icon className="text-4xl mb-4 mx-auto" />
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-filter backdrop-blur-lg">
                <div className="text-lg font-semibold">{service}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Top Countries</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {topCountries.map((country, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-full px-6 py-2 backdrop-filter backdrop-blur-lg">
                <span className="text-2xl mr-2">{country.flag}</span>
                <span className="font-semibold">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-100 p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
