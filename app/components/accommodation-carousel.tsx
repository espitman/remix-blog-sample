import { Link } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Accommodation } from "~/lib/accommodations/accommodation.types";
import { cn } from "~/lib/utils/cn";

export function AccommodationCarousel({ accommodations }: { accommodations: Accommodation[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 400;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const targetScroll = direction === "left" 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  if (accommodations.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Accommodations</h2>
          <p className="text-muted-foreground mt-2">
            Discover amazing places to stay
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {accommodations.map((accommodation) => (
          <Link key={accommodation.id} to={`/accommodations/${accommodation.code}`}>
            <Card
              className="min-w-[340px] max-w-[340px] flex-shrink-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20 group cursor-pointer"
            >
            <div className="w-full h-56 overflow-hidden rounded-t-lg relative">
              <img
                src={accommodation.image}
                alt={accommodation.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {accommodation.badges.length > 0 && (
                <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  {accommodation.badges[0].name}
                </div>
              )}
              {accommodation.verified && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                {accommodation.name}
              </CardTitle>
              <div className="flex items-center gap-3 mt-3">
                {accommodation.rate_review && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold">
                      {accommodation.rate_review.score}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({accommodation.rate_review.count} reviews)
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <p>
                    {accommodation.location.city}, {accommodation.location.province}
                  </p>
                  {accommodation.accommodationMetrics.bedroomsCount > 0 && (
                    <p>
                      {accommodation.accommodationMetrics.bedroomsCount} Bedrooms
                      {accommodation.accommodationMetrics.bathroomsCount > 0 &&
                        ` • ${accommodation.accommodationMetrics.bathroomsCount} Bathrooms`}
                    </p>
                  )}
                  <p>
                    Capacity: {accommodation.capacity.base}
                    {accommodation.capacity.extra > 0 && ` + ${accommodation.capacity.extra}`}
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {accommodation.price.discountedPrice.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-sm text-muted-foreground">Toman</span>
                  </div>
                  {accommodation.price.discountPercent > 0 && (
                    <p className="text-xs text-muted-foreground line-through">
                      {accommodation.price.mainPrice.toLocaleString("fa-IR")} Toman
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

