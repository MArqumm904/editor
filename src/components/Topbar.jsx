import { Search, Plus } from "lucide-react";

const Topbar = () => {
  const filterTags = ["Discovery", "Abstract", "Sci-fi", "Abstract"];

  return (
    <nav className="bg-darkbg border-gray-800 px-6 py-4 mt-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Filter Tags */} 
        <div className="flex items-center gap-3">
          {filterTags.map((tag, index) => (
            <button
              key={index}
              className={
                index === 0
                  ? "px-5 py-3 bg-[#8088E2] hover:bg-[#8088E2] text-white text-sm rounded-full transition-colors"
                  : "px-5 py-3 bg-darkbg border-2 border-[#8088E2] text-white text-sm rounded-full transition-colors hover:bg-[#8088E2] hover:text-black"
              }
            >
              {tag}
            </button>
          ))}
          <button className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 border border-white rounded-lg pl-10 pr-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8088E2] focus:border-[#8088E2] w-80"
          />
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
