import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAccommodationDetail } from "~/lib/accommodations/accommodation.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils/cn";
import { ArrowLeft, MapPin, Users, Bed, Bath, Home, Star, CheckCircle2 } from "lucide-react";

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

  const accommodation = await getAccommodationDetail(Number(code));

  if (!accommodation) {
    throw new Response("Accommodation not found", { status: 404 });
  }

  return json({ accommodation });
}

export default function AccommodationDetail() {
  const { accommodation } = useLoaderData<typeof loader>();

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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
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
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to accommodations
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
                <span>({accommodation.rateAndReview.count} reviews)</span>
              </div>
            )}
            {accommodation.reservationType === "instant" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant Booking</span>
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
                    "overflow-hidden rounded-lg",
                    index === 0 && "md:col-span-2 md:row-span-2"
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.caption || accommodation.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
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
                  <CardTitle>About this place</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {accommodation.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Extra Descriptions */}
            {accommodation.extraDescription && accommodation.extraDescription.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>More Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {accommodation.extraDescription.map((desc, index) => (
                    <div key={index}>
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
                  <CardTitle>What this place offers</CardTitle>
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
                        <span className="text-sm">{amenity.title.fa}</span>
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
                  <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
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
                  <CardTitle>Nearby Places</CardTitle>
                </CardHeader>
                <CardContent>
                  {accommodation.nearbyCentersV2.map((center, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h4 className="font-semibold mb-3">{center.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {center.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center p-2 rounded border">
                            <span className="text-sm text-muted-foreground">{item.key}</span>
                            <span className="text-sm font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
                  <span className="text-muted-foreground">Toman</span>
                  <span className="text-sm text-muted-foreground">/ night</span>
                </div>
                {accommodation.price.weekend && (
                  <p className="text-sm text-muted-foreground">
                    Weekend: {accommodation.price.weekend.toLocaleString("fa-IR")} Toman
                  </p>
                )}
                {accommodation.price.holiday && (
                  <p className="text-sm text-muted-foreground">
                    Holiday: {accommodation.price.holiday.toLocaleString("fa-IR")} Toman
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Check-in/Check-out */}
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                    <p className="font-semibold">{accommodation.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                    <p className="font-semibold">{accommodation.checkOut}</p>
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">
                        {accommodation.capacity.guests.base} guests
                        {accommodation.capacity.guests.extra > 0 && ` + ${accommodation.capacity.guests.extra} extra`}
                      </p>
                    </div>
                  </div>
                  {accommodation.accommodationMetrics.bedroomsCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {accommodation.accommodationMetrics.bedroomsCount} Bedroom{accommodation.accommodationMetrics.bedroomsCount > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {accommodation.capacity.beds.double} Double bed{accommodation.capacity.beds.double > 1 ? "s" : ""}
                          {accommodation.capacity.beds.mattress > 0 && `, ${accommodation.capacity.beds.mattress} Mattress${accommodation.capacity.beds.mattress > 1 ? "es" : ""}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {accommodation.accommodationMetrics.bathroomsCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {accommodation.accommodationMetrics.bathroomsCount} Bathroom{accommodation.accommodationMetrics.bathroomsCount > 1 ? "s" : ""}
                        </p>
                        {accommodation.accommodationMetrics.iranianToiletsCount > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {accommodation.accommodationMetrics.iranianToiletsCount} Iranian toilet{accommodation.accommodationMetrics.iranianToiletsCount > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {accommodation.accommodationMetrics.areaSize > 0 && (
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {accommodation.accommodationMetrics.areaSize} m²
                        </p>
                        <p className="text-sm text-muted-foreground">Area size</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Min Nights */}
                {accommodation.minNight > 0 && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">Minimum stay:</span> {accommodation.minNight} night{accommodation.minNight > 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {/* Badges */}
                {accommodation.badges?.main && accommodation.badges.main.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold">Highlights</h4>
                    {accommodation.badges.main.slice(0, 3).map((badge, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <img src={badge.icon} alt={badge.title} className="w-6 h-6 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">{badge.title}</p>
                          {badge.data && badge.data.length > 0 && (
                            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                              {badge.data.slice(0, 2).map((item, itemIndex) => (
                                <li key={itemIndex}>• {item}</li>
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
                    <h4 className="font-semibold mb-3">Host Information</h4>
                    <div className="space-y-2">
                      {accommodation.hostProfile.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img src={item.icon} alt="" className="w-5 h-5" />
                          <div>
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
                  Reserve Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

