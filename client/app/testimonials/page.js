import ReviewCard from "@/components/cards/ReviewCard";
import CTABanner from "@/components/layout/CTABanner";

export const metadata = {
  title: "Client Reviews | Clarity Auto Spa",
  description: "Read what our clients are saying about Brooklyn's most trusted auto detailing shop.",
};

export default async function ReviewsPage() {
  let mappedReviews = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      mappedReviews = data.map((t) => ({
        name: t.customerName,
        source: "Clarity Auto Spa",
        rating: t.rating,
        text: t.quote,
        photo: t.photoUrl
      }));
    } else {
      console.error("Failed to fetch testimonials. Status:", res.status);
    }
  } catch (error) {
    console.error("Network error fetching testimonials:", error);
  }

  // Hardcoded fallback removed to use dynamic data from database

  return (
    <div className="pt-32 bg-[#111618] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-gold tracking-[0.15em] uppercase text-md mb-4 text-[12px] md:text-[13px] font-bold">
            Testimonials
          </div>
          <h1 className="font-heading font-medium md: text-white capitalize mb-6 text-[clamp(2.5rem,5vw,4rem)] leading-[1.08] tracking-[-0.01em]">
            What Our Clients Say
          </h1>
          <p className="text-white/80 text-lg font-semibold max-w-2xl mx-auto">
            Brooklyn's most trusted auto detailing shop, located in the heart of Park Slope.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mappedReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
        
      </div>
      <CTABanner />
    </div>
  );
}
