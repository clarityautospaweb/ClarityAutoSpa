import BeforeAfterSlider from "@/components/features/BeforeAfterSlider";

export const metadata = {
  title: "Our Work | Clarity Auto Spa",
  description: "View our auto detailing transformations.",
};

export default async function GalleryPage() {
  let images = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
      cache: "no-store",
    });
    if (res.ok) {
      images = await res.json();
    }
  } catch (error) {
    console.error("Network error fetching gallery:", error);
  }

  const beforeAfters = images.filter((img) => img.imageType === "Before/After");
  const plainImages = images.filter((img) => img.imageType === "Plain Image");

  return (
    <div className="pt-52 pb-24 bg-[#111618] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full tracking-[0.15em] uppercase mb-5 text-[12px] font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Our Work
          </div>
          <h1 className="font-heading font-medium md: text-white capitalize mb-6 text-[clamp(2.5rem,5vw,4rem)] leading-[1.08] tracking-[-0.01em]">
            Transformation Gallery
          </h1>
          <p className="text-white/80 text-lg">
            See the dramatic difference a professional detail can make.
          </p>
        </div>

        {beforeAfters.length > 0 && (
          <div className="mb-24 space-y-12">
            <h2 className="text-2xl font-medium text-center text-white capitalize mb-8 text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] font-heading">
              Featured Transformations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {beforeAfters.map((item) => (
                <div key={item._id} className="flex flex-col gap-4">
                  <BeforeAfterSlider
                    beforeImage={item.beforeImageUrl}
                    afterImage={item.afterImageUrl}
                  />
                  {item.title && (
                    <p className="text-gray-500 font-medium text-sm text-center">
                      {item.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {plainImages.length > 0 && (
        <div className="w-full px-4 sm:px-6">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {plainImages.map((item) => (
              <div
                key={item._id}
                className="break-inside-avoid relative rounded-2xl overflow-hidden shadow-md group"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "Gallery Image"}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-cream font-medium text-sm">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center text-gray-400 text-xl font-light">
          More transformations coming soon.
        </div>
      )}
    </div>
  );
}
