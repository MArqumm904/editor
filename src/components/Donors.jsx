import React from 'react';
import ppf from "../assets/images/image.png"

const Donors = () => {
  const donors = [
    { id: 1, name: "John Doe", amount: "$100" },
    { id: 2, name: "John Doe", amount: "$100" },
    { id: 3, name: "John Doe", amount: "$100" },
    { id: 4, name: "John Doe", amount: "$100" }
  ];

  return (
    <div className="bg-darkbg flex items-center justify-center p-8 pt-24">
      <div className="max-w-6xl w-full">
        {/* Title */}
        <h1 className="text-white text-4xl font-bold text-center mb-16">
          Our Amazing Donors
        </h1>
        
        {/* Donors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-gradient-to-br from-[#8088E2] to-[#0D0B13] rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="w-40 h-40  rounded-full mb-6 flex items-center justify-center">
                    <img src={ppf} alt="" className='w-46 h-46 bg-gray-300 rounded-full'/>
              </div>
              
              {/* Name */}
              <h3 className="text-white text-xl font-semibold mb-3">
                {donor.name}
              </h3>
              
              {/* Amount with dot indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white text-lg font-medium">
                  {donor.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Donors;