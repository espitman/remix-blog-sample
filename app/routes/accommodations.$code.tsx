import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getAccommodationDetail, getAccommodationReviewSummary } from "~/lib/accommodations/accommodation.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils/cn";
import { ArrowRight, MapPin, Users, Bed, Bath, Home, Star, CheckCircle2, ThumbsUp, ThumbsDown, MessageSquare, ChevronRight, ChevronLeft, X } from "lucide-react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.accommodation) {
    return [{ title: "Accommodation Not Found" }];
  }

  return [
    { title: `${data.accommodation.title} | Remix Blog` },
    { name: "description", content: data.accommodation.description || "" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const code = params.code;

  if (!code || isNaN(Number(code))) {
    throw new Response("Invalid accommodation code", { status: 400 });
  }

  const [accommodation, reviewSummary] = await Promise.all([
    getAccommodationDetail(Number(code)),
    getAccommodationReviewSummary(Number(code)),
  ]);

  if (!accommodation) {
    throw new Response("Accommodation not found", { status: 404 });
  }

  return json({ accommodation, reviewSummary });
}

export default function AccommodationDetail() {
  const { accommodation, reviewSummary } = useLoaderData<typeof loader>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && accommodation.placeImages) {
      setSelectedImageIndex(
        selectedImageIndex === 0 
          ? accommodation.placeImages.length - 1 
          : selectedImageIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && accommodation.placeImages) {
      setSelectedImageIndex(
        selectedImageIndex === accommodation.placeImages.length - 1 
          ? 0 
          : selectedImageIndex + 1
      );
    }
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null || !accommodation.placeImages) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedImageIndex(
          selectedImageIndex === 0 
            ? accommodation.placeImages!.length - 1 
            : selectedImageIndex - 1
        );
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedImageIndex(
          selectedImageIndex === accommodation.placeImages!.length - 1 
            ? 0 
            : selectedImageIndex + 1
        );
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImageIndex, accommodation.placeImages]);

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Remix Blog
            </Link>
            <Link
              to="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              بازگشت به خانه
              <ArrowRight className="w-4 h-4 mr-2" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          بازگشت به اقامتگاه‌ها
          <ArrowRight className="w-4 h-4 mr-2" />
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{accommodation.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {accommodation.placeOfResidence.area.city.name.fa}, {accommodation.placeOfResidence.area.city.province.name.fa}
              </span>
            </div>
            {accommodation.rateAndReview && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">{accommodation.rateAndReview.score}</span>
                <span>({accommodation.rateAndReview.count} نظر)</span>
              </div>
            )}
            {accommodation.reservationType === "instant" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>رزرو آنی</span>
              </div>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {accommodation.placeImages && accommodation.placeImages.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodation.placeImages.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "overflow-hidden rounded-lg cursor-pointer",
                    index === 0 && "md:col-span-2 md:row-span-2"
                  )}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image.url}
                    alt={image.caption || accommodation.title}
                    className={cn(
                      "w-full object-cover hover:scale-105 transition-transform duration-300",
                      index === 0 
                        ? "h-[400px] md:h-[520px]" 
                        : "h-[200px] md:h-[250px]"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImageIndex !== null && accommodation.placeImages && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="بستن"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Previous Button */}
              {accommodation.placeImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                  aria-label="عکس قبلی"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}

              {/* Next Button */}
              {accommodation.placeImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                  aria-label="عکس بعدی"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}

              {/* Image */}
              <img
                src={accommodation.placeImages[selectedImageIndex].url}
                alt={accommodation.placeImages[selectedImageIndex].caption || accommodation.title}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image Counter */}
              {accommodation.placeImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImageIndex + 1} / {accommodation.placeImages.length}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {accommodation.description && (
              <Card>
                <CardHeader>
                  <CardTitle>درباره این اقامتگاه</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-muted-foreground text-right">
                    {accommodation.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Extra Descriptions */}
            {accommodation.extraDescription && accommodation.extraDescription.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات بیشتر</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {accommodation.extraDescription.map((desc, index) => (
                    <div key={index} className="text-right">
                      <h3 className="font-semibold mb-2">{desc.title}</h3>
                      {desc.subTitle && (
                        <p className="text-sm text-muted-foreground mb-2">{desc.subTitle}</p>
                      )}
                      <p className="whitespace-pre-line text-muted-foreground">{desc.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>امکانات اقامتگاه</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {accommodation.amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center gap-3">
                        <img
                          src={amenity.icon.url}
                          alt={amenity.title.fa}
                          className="w-6 h-6"
                        />
                        <span className="text-sm text-right">{amenity.title.fa}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cancellation Policy */}
            {accommodation.cancellationPolicyDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>سیاست لغو رزرو</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-right">
                    {accommodation.cancellationPolicyText}
                  </p>
                  <div className="space-y-3">
                    {accommodation.cancellationPolicyDetails.beforeCheckIn && (
                      <div className="p-3 rounded-lg border" style={{ borderColor: accommodation.cancellationPolicyDetails.beforeCheckIn.color + "40", backgroundColor: accommodation.cancellationPolicyDetails.beforeCheckIn.color + "10" }}>
                        <h4 className="font-semibold mb-1" style={{ color: accommodation.cancellationPolicyDetails.beforeCheckIn.color }}>
                          {accommodation.cancellationPolicyDetails.beforeCheckIn.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {accommodation.cancellationPolicyDetails.beforeCheckIn.text}
                        </p>
                      </div>
                    )}
                    {accommodation.cancellationPolicyDetails.untilCheckIn && (
                      <div className="p-3 rounded-lg border" style={{ borderColor: accommodation.cancellationPolicyDetails.untilCheckIn.color + "40", backgroundColor: accommodation.cancellationPolicyDetails.untilCheckIn.color + "10" }}>
                        <h4 className="font-semibold mb-1" style={{ color: accommodation.cancellationPolicyDetails.untilCheckIn.color }}>
                          {accommodation.cancellationPolicyDetails.untilCheckIn.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {accommodation.cancellationPolicyDetails.untilCheckIn.text}
                        </p>
                      </div>
                    )}
                    {accommodation.cancellationPolicyDetails.afterCheckIn && (
                      <div className="p-3 rounded-lg border" style={{ borderColor: accommodation.cancellationPolicyDetails.afterCheckIn.color + "40", backgroundColor: accommodation.cancellationPolicyDetails.afterCheckIn.color + "10" }}>
                        <h4 className="font-semibold mb-1" style={{ color: accommodation.cancellationPolicyDetails.afterCheckIn.color }}>
                          {accommodation.cancellationPolicyDetails.afterCheckIn.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {accommodation.cancellationPolicyDetails.afterCheckIn.text}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nearby Centers */}
            {accommodation.nearbyCentersV2 && accommodation.nearbyCentersV2.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>مکان‌های نزدیک</CardTitle>
                </CardHeader>
                <CardContent>
                  {accommodation.nearbyCentersV2.map((center, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h4 className="font-semibold mb-3">{center.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {center.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center p-2 rounded border text-right">
                            <span className="text-sm font-medium">{item.value}</span>
                            <span className="text-sm text-muted-foreground">{item.key}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Review Summary */}
            {reviewSummary && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <CardTitle>خلاصه نظرات مهمانان</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Sentiment & Recommendation */}
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      {reviewSummary.overall_sentiment === "positive" ? (
                        <ThumbsUp className="w-6 h-6 text-green-600" />
                      ) : reviewSummary.overall_sentiment === "negative" ? (
                        <ThumbsDown className="w-6 h-6 text-red-600" />
                      ) : (
                        <MessageSquare className="w-6 h-6 text-yellow-600" />
                      )}
                      <span className="font-semibold">
                        {reviewSummary.overall_sentiment === "positive" 
                          ? "نظرات مثبت" 
                          : reviewSummary.overall_sentiment === "negative"
                          ? "نظرات منفی"
                          : "نظرات خنثی"}
                      </span>
                    </div>
                    {reviewSummary.recommendation && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">توصیه می‌شود</span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-semibold mb-3 text-right">خلاصه</h4>
                    <p className="text-muted-foreground leading-relaxed text-right">
                      {reviewSummary.summary}
                    </p>
                  </div>

                  {/* Strengths */}
                  {reviewSummary.strengths && reviewSummary.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-right flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-green-600" />
                        نقاط قوت
                      </h4>
                      <ul className="space-y-2">
                        {reviewSummary.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-3 text-right">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {reviewSummary.weaknesses && reviewSummary.weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-right flex items-center gap-2">
                        <ThumbsDown className="w-5 h-5 text-orange-600" />
                        نقاط ضعف
                      </h4>
                      <ul className="space-y-2">
                        {reviewSummary.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-3 text-right">
                            <span className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center text-orange-600">•</span>
                            <span className="text-muted-foreground">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold">
                    {accommodation.price.base.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-muted-foreground">تومان</span>
                  <span className="text-sm text-muted-foreground">/ شب</span>
                </div>
                {accommodation.price.weekend && (
                  <p className="text-sm text-muted-foreground text-right">
                    آخر هفته: {accommodation.price.weekend.toLocaleString("fa-IR")} تومان
                  </p>
                )}
                {accommodation.price.holiday && (
                  <p className="text-sm text-muted-foreground text-right">
                    تعطیلات: {accommodation.price.holiday.toLocaleString("fa-IR")} تومان
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Check-in/Check-out */}
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg text-right">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ورود</p>
                    <p className="font-semibold">{accommodation.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">خروج</p>
                    <p className="font-semibold">{accommodation.checkOut}</p>
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="font-semibold">
                        {accommodation.capacity.guests.base} مهمان
                        {accommodation.capacity.guests.extra > 0 && ` + ${accommodation.capacity.guests.extra} اضافه`}
                      </p>
                    </div>
                  </div>
                  {accommodation.accommodationMetrics.bedroomsCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <div className="text-right">
                        <p className="font-semibold">
                          {accommodation.accommodationMetrics.bedroomsCount} اتاق خواب
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {accommodation.capacity.beds.double} تخت دو نفره
                          {accommodation.capacity.beds.mattress > 0 && `، ${accommodation.capacity.beds.mattress} رختخواب سنتی`}
                        </p>
                      </div>
                    </div>
                  )}
                  {accommodation.accommodationMetrics.bathroomsCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <div className="text-right">
                        <p className="font-semibold">
                          {accommodation.accommodationMetrics.bathroomsCount} حمام
                        </p>
                        {accommodation.accommodationMetrics.iranianToiletsCount > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {accommodation.accommodationMetrics.iranianToiletsCount} سرویس ایرانی
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {accommodation.accommodationMetrics.areaSize > 0 && (
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-muted-foreground" />
                      <div className="text-right">
                        <p className="font-semibold">
                          {accommodation.accommodationMetrics.areaSize} متر مربع
                        </p>
                        <p className="text-sm text-muted-foreground">مساحت</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Min Nights */}
                {accommodation.minNight > 0 && (
                  <div className="p-3 bg-muted rounded-lg text-right">
                    <p className="text-sm">
                      <span className="font-semibold">حداقل اقامت:</span> {accommodation.minNight} شب
                    </p>
                  </div>
                )}

                {/* Badges */}
                {accommodation.badges?.main && accommodation.badges.main.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-right">ویژگی‌های برجسته</h4>
                    {accommodation.badges.main.slice(0, 3).map((badge, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <img src={badge.icon} alt={badge.title} className="w-6 h-6 flex-shrink-0" />
                        <div className="text-right">
                          <p className="font-semibold text-sm">{badge.title}</p>
                          {badge.data && badge.data.length > 0 && (
                            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                              {badge.data.slice(0, 2).map((item, itemIndex) => (
                                <li key={itemIndex} className="text-right">• {item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Host Profile */}
                {accommodation.hostProfile && accommodation.hostProfile.items.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 text-right">اطلاعات میزبان</h4>
                    <div className="space-y-2">
                      {accommodation.hostProfile.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img src={item.icon} alt="" className="w-5 h-5" />
                          <div className="text-right">
                            <p className="font-semibold text-sm">{item.text}</p>
                            <p className="text-xs text-muted-foreground">{item.subText}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reserve Button */}
                <Button className="w-full" size="lg">
                  رزرو کنید
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

