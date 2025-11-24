import React, { useState, useEffect } from 'react';

export default function FlagSearchApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  
  useEffect(() => {
    fetchAllCountries();
  }, []);

  
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  const fetchAllCountries = async () => {
    setLoading(true);
    setError('');
    
    try {
     
      const regions = ['africa', 'americas', 'asia', 'europe', 'oceania'];
      const promises = regions.map(region => 
        fetch(`https://restcountries.com/v3.1/region/${region}`)
          .then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const allCountries = results.flat();
      
      if (!Array.isArray(allCountries) || allCountries.length === 0) {
        throw new Error('No data received');
      }
      
      
      const sortedData = allCountries.sort((a, b) => 
        a.name.common.localeCompare(b.name.common)
      );
      
      setCountries(sortedData);
      setFilteredCountries(sortedData);
      setError('');
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Unable to load countries. Please try again.');
      setCountries([]);
      setFilteredCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  const getCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies).map(c => `${c.name} (${c.symbol})`).join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">Country Explorer</h1>
          </div>
          
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

     
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading countries...</p>
          </div>
        )}

        
        {error && !loading && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Failed to Load Countries
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchAllCountries}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        )}

        
        {!loading && filteredCountries.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {searchTerm ? (
                  <>
                    Found <span className="font-semibold">{filteredCountries.length}</span> {filteredCountries.length === 1 ? 'country' : 'countries'}
                  </>
                ) : (
                  <>
                    Showing <span className="font-semibold">{filteredCountries.length}</span> countries
                  </>
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCountries.map((country) => (
                <div
                  key={country.cca3}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                 
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={country.flags.svg || country.flags.png}
                      alt={`Flag of ${country.name.common}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {country.name.common}
                    </h3>
                    
                    <button
                      onClick={() => setSelectedCountry(country)}
                      className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

       
        {!loading && filteredCountries.length === 0 && !error && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Countries Found
            </h2>
            <p className="text-gray-500">
              Try searching with a different term
            </p>
          </div>
        )}
      </main>

     
      {selectedCountry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCountry.name.common}
              </h2>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              
              <div className="mb-6">
                <img
                  src={selectedCountry.flags.svg || selectedCountry.flags.png}
                  alt={`Flag of ${selectedCountry.name.common}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>

             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Official Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCountry.name.official}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Capital</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCountry.capital ? selectedCountry.capital.join(', ') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Population</p>
                    <p className="font-semibold text-gray-900">
                      {formatNumber(selectedCountry.population)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Region</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCountry.region} {selectedCountry.subregion ? `(${selectedCountry.subregion})` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="font-semibold text-gray-900">
                      {getLanguages(selectedCountry.languages)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Currencies</p>
                    <p className="font-semibold text-gray-900">
                      {getCurrencies(selectedCountry.currencies)}
                    </p>
                  </div>
                </div>
              </div>

             
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold text-gray-900">
                      {formatNumber(selectedCountry.area)} km²
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Timezone</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCountry.timezones ? selectedCountry.timezones[0] : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Driving Side</p>
                    <p className="font-semibold text-gray-900 uppercase">
                      {selectedCountry.car?.side || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">UN Member</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCountry.unMember ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
              {selectedCountry.maps?.googleMaps && (
                <div className="mt-6">
                  <a
                    href={selectedCountry.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}