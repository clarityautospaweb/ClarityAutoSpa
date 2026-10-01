"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Cookies from "js-cookie";
import ServicesTab from "../components/tabs/ServicesTab";
import TestimonialsTab from "../components/tabs/TestimonialsTab";
import GalleryTab from "../components/tabs/GalleryTab";
import CategoriesTab from "../components/tabs/CategoriesTab";
import ServiceCategoriesTab from "../components/tabs/ServiceCategoriesTab";
import SubmissionsTab from "../components/tabs/SubmissionsTab";
import SettingsTab from "../components/tabs/SettingsTab";
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("services");
  const [admin, setAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("admin_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Invalid session");
        
        const data = await res.json();
        setAdmin(data.admin);
      } catch (err) {
        Cookies.remove("admin_token");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("admin_token");
    router.push("/login");
  };

  if (!admin) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl uppercase tracking-widest">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row text-gray-900 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header handleLogout={handleLogout} />

        {/* Scrollable Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-cream">
          <div className="max-w-5xl mx-auto">
            {activeTab === "services" && <ServicesTab />}
            {activeTab === "testimonials" && <TestimonialsTab />}
            {activeTab === "gallery" && <GalleryTab />}
            {activeTab === "categories" && <CategoriesTab />}
            {activeTab === "service-categories" && <ServiceCategoriesTab />}
            {activeTab === "submissions" && <SubmissionsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}


