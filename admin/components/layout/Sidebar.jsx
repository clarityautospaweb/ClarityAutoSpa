import { LogOut, Car, MessageSquare, Image as ImageIcon, CircleDollarSign, Tag } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, handleLogout }) {
  return (
    <aside className="w-full md:w-64 bg-[#F9FAFB] border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Car className="w-6 h-6 text-cream" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-gray-900">Clarity Auto Spa</h1>
          <p className="text-xs text-gray-500">Admin workspace</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Management
        </div>
        <button
          onClick={() => setActiveTab("services")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'services' 
              ? 'bg-primary-light text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
          }`}
        >
          <CircleDollarSign className="w-4 h-4" />
          Services & Pricing
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'testimonials' 
              ? 'bg-primary-light text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Testimonials
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'gallery' 
              ? 'bg-primary-light text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Gallery
        </button>
        <button
          onClick={() => setActiveTab("service-categories")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'service-categories' 
              ? 'bg-primary-light text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
          }`}
        >
          <Tag className="w-4 h-4" />
          Home Page Categories
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'categories' 
              ? 'bg-primary-light text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
          }`}
        >
          <Tag className="w-4 h-4" />
          Configuration (Old)
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'submissions' 
              ? 'bg-primary-light text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Submissions
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settings' 
              ? 'bg-primary-light text-primary border-l-4 border-primary' 
              : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
          }`}
        >
          <Tag className="w-4 h-4" />
          Settings
        </button>
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
