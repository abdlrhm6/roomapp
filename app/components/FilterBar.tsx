'use client'

import React, { useEffect, useState } from 'react';

type Filter = {country: string,city: string,price: number,type: string};

export default function FilterBar({onclick}: 
  {onclick: ({country,city,price}: Filter)=>void})
   {

  const [priceRange, setPriceRange] = useState(1000);
  const [filters,setFilters] = useState<Filter>({country: "",city: "",price: 0,type: ""});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({...filters,[e.target.id]: e.target.value});
  }

useEffect(() => {
  setFilters({...filters,price: priceRange});
}, [priceRange]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg mt-4">
      <div className="grid sm:grid-cols-1 grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="country" className="mb-1 text-sm font-medium text-gray-700">Country</label>
          <input type="text" placeholder="Enter Country" id="country" className="p-2 border rounded-md"
          value={filters.country}
          onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="city" className="mb-1 text-sm font-medium text-gray-700">Room City</label>
          <input type="text" placeholder="Enter City" id="city" className="p-2 border rounded-md"
          onChange={handleChange}
          value={filters.city}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="roomType" className="mb-1 text-sm font-medium text-gray-700">Room Type</label>
          <select id="type" className="p-2 border rounded-md"
          onChange={handleChange}
          value={filters.type}
          >
            <option value="" disabled>Select</option>
            <option value="" >All Types</option>
            <option value="single">Single Room</option>
            <option value="house">House</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="priceRange" className="mb-1 text-sm font-medium text-gray-700">max Price</label>
          <div className="flex items-center">
            <input 
              type="range" 
              id="price" 
              min="0" 
              max="1000" 
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full mr-4"
            />
            <span className="text-sm font-medium">${priceRange}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button 
        onClick={() => onclick(filters)}
        className="w-full block sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
