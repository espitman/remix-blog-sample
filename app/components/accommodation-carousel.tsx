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
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Accommodations</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
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
          <Card
            key={accommodation.id}
            className="min-w-[320px] max-w-[320px] flex-shrink-0 hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-48 overflow-hidden rounded-t-lg relative">
              <img
                src={accommodation.image}
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
              {accommodation.badges.length > 0 && (
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                  {accommodation.badges[0].name}
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2 text-lg">
                {accommodation.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {accommodation.rate_review && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold">
                      {accommodation.rate_review.score}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({accommodation.rate_review.count})
                    </span>
                  </div>
                )}
                {accommodation.verified && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Verified
                  </span>
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

