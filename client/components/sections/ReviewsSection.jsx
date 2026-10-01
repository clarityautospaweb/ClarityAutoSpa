import ReviewsCarousel from "./ReviewsCarousel";
import { reviews as fallbackReviews } from "@/lib/siteData";

export default async function ReviewsSection() {
  let settings = null;
  let mappedReviews = [];
  try {
    const [res, settingsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, { cache: 'no-store' })
    ]);
    if (res.ok) {
      const data = await res.json();
      mappedReviews = data.map((t) => ({
        name: t.customerName,
        source: "Google review",
        rating: t.rating,
        text: t.quote,
        featured: t.featured !== undefined ? t.featured : true
      }));
    }
    if (settingsRes.ok) {
      settings = await settingsRes.json();
    }
  } catch (error) {
    console.error("Network error fetching testimonials:", error);
  }

  const rating = settings?.rating || 4.6;
  const reviewCount = settings?.reviewCount || 133;
  const googleUrl = settings?.googleReviewsUrl || "#";

  // Use featured reviews from DB, otherwise all from DB, otherwise fallback
  let displayReviews = mappedReviews.filter(r => r.featured);
  if (displayReviews.length === 0) {
    displayReviews = mappedReviews;
  }
  if (displayReviews.length === 0) {
    displayReviews = fallbackReviews;
  }

  return (
    <ReviewsCarousel 
      reviews={displayReviews} 
      rating={rating} 
      reviewCount={reviewCount} 
      googleUrl={googleUrl} 
    />
  );
}
