import InteractiveImageBentoGallery from "@/components/ui/bento-gallery";

const fallbackItems = [
  {
    id: 1,
    title: "Ceramic Coating",
    desc: "Unmatched gloss and protection.",
    url: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800", 
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Paint Correction",
    desc: "Restoring the mirror finish.",
    url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
    span: "md:row-span-1",
  },
  {
    id: 3,
    title: "Interior Detailing",
    desc: "Immaculate inside and out.",
    url: "https://images.unsplash.com/photo-1600705722908-bab1e6190b4d?auto=format&fit=crop&q=80&w=800",
    span: "md:row-span-1",
  },
  {
    id: 4,
    title: "Wheel & Tire Care",
    desc: "Attention to every detail.",
    url: "https://images.unsplash.com/photo-1619551734325-81aaf323686c?auto=format&fit=crop&q=80&w=800",
    span: "md:row-span-2",
  },
  {
    id: 5,
    title: "Foam Wash",
    desc: "Gentle and thorough cleaning.",
    url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800",
    span: "md:row-span-1",
  },
  {
    id: 6,
    title: "Engine Bay",
    desc: "Spotless under the hood.",
    url: "https://images.unsplash.com/photo-1610647752706-3bb12232b3bf?auto=format&fit=crop&q=80&w=800",
    span: "md:col-span-2 md:row-span-1",
  },
];

export default async function GallerySection() {
  let galleryImages = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      galleryImages = data
        .filter(img => img.showOnLandingPage)
        .map((img, index) => {
          const spans = [
            "md:col-span-2 md:row-span-2", 
            "md:row-span-1", 
            "md:row-span-1", 
            "md:row-span-2", 
            "md:row-span-1", 
            "md:col-span-2 md:row-span-1"
          ];
          return {
            id: img._id || index,
            title: img.title || "Premium Detailing",
            desc: img.description || "Expert care for your vehicle.",
            url: img.imageUrl || img.afterImageUrl,
            span: spans[index % spans.length]
          };
        })
        .filter(img => img.url);
    }
  } catch (error) {
    console.error("Network error fetching gallery:", error);
  }

  // Use DB images if available, otherwise fallback to Unsplash
  const itemsToDisplay = galleryImages.length > 0 ? galleryImages : fallbackItems;

  return (
    <div id="gallery" className="w-full antialiased bg-[#111618] border-t border-white/10">
      <InteractiveImageBentoGallery
        imageItems={itemsToDisplay}
        title="See the Clarity Difference"
        description="Interact with our gallery to see the transformative results of our premium detailing services. Drag to explore, click to expand."
      />
    </div>
  );
}
