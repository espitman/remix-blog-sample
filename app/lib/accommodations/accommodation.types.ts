export type AccommodationLocation = {
  city: string;
  province: string;
  cityEn: string;
  provinceEn: string;
  geo: {
    lat: number;
    long: number;
  };
};

export type AccommodationMetrics = {
  areaSize: number;
  bathroomsCount: number;
  bedroomsCount: number;
  buildingSize: number;
  iranianToiletsCount: number;
  toiletsCount: number;
};

export type AccommodationPrice = {
  mainPrice: number;
  perNight: number;
  discountPercent: number;
  discountedPrice: number;
  capacity: {
    base: number;
    extra: number;
  };
  isGuarantee: boolean;
  isDefaultDate: boolean;
  text: string;
  vatPrice: number | null;
};

export type AccommodationRateReview = {
  score: number;
  count: number;
};

export type AccommodationBadge = {
  name: string;
  icon: string;
};

export type Accommodation = {
  id: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  image: string;
  images: string[];
  kind: string;
  type: string;
  place_id: string;
  code: number;
  room_id: string;
  location: AccommodationLocation;
  accommodationMetrics: AccommodationMetrics;
  min_price: number;
  price: AccommodationPrice;
  rate_review: AccommodationRateReview;
  tags: string[];
  verified: boolean;
  status: string;
  capacity: {
    base: number;
    extra: number;
  };
  badges: AccommodationBadge[];
  amenities: string[];
};

export type AccommodationSearchResponse = {
  result: {
    items: Accommodation[];
  };
};

export type AccommodationSearchParams = {
  pageSize?: number;
  pageNumber?: number;
};

// Detail types
export type AccommodationDetailAmenity = {
  id: string;
  icon: {
    url: string;
  };
  title: {
    en: string;
    fa: string;
  };
};

export type AccommodationDetailBadge = {
  name: string;
  title: string;
  icon: string;
  data: string[];
  helper?: string | null;
};

export type AccommodationDetailBadges = {
  main: AccommodationDetailBadge[];
  secondary: AccommodationDetailBadge[];
  data: unknown[];
};

export type AccommodationDetail = {
  id: string;
  code: number;
  title: string;
  alibabaTitle: string;
  description: string;
  checkIn: string;
  checkOut: string;
  minNight: number;
  status: string;
  reservationType: string;
  type: string;
  capacity: {
    beds: {
      twin: number;
      single: number;
      double: number;
      mattress: number;
    };
    guests: {
      base: number;
      extra: number;
    };
  };
  price: {
    base: number;
    weekend: number;
    holiday: number;
    extraPeople: {
      base: number;
      weekend: number;
      holiday: number;
    };
  };
  placeImages: Array<{
    type: string;
    url: string;
    caption: string;
  }>;
  amenities: AccommodationDetailAmenity[];
  accommodationMetrics: AccommodationMetrics;
  placeOfResidence: {
    area: {
      city: {
        name: { fa: string; en: string };
        province: {
          name: { fa: string; en: string };
        };
      };
    };
    location: {
      lng: number;
      lat: number;
    };
  };
  rateAndReview: {
    count: number;
    score: number;
  };
  badges: AccommodationDetailBadges;
  extraDescription: Array<{
    title: string;
    subTitle: string;
    text: string;
  }>;
  cancellationPolicyText: string;
  cancellationPolicyDetails: {
    title: string;
    beforeCheckIn: {
      title: string;
      text: string;
      color: string;
    };
    untilCheckIn: {
      title: string;
      text: string;
      color: string;
    };
    afterCheckIn: {
      title: string;
      text: string;
      color: string;
    };
  };
  nearbyCentersV2: Array<{
    title: string;
    items: Array<{
      key: string;
      value: string;
      accessibleBy: string;
    }>;
  }>;
  hostProfile: {
    items: Array<{
      icon: string;
      text: string;
      subText: string;
    }>;
  };
};

export type AccommodationDetailResponse = {
  result: {
    item: AccommodationDetail;
  };
};

// Review Summary types
export type ReviewSummary = {
  overall_sentiment: "positive" | "negative" | "neutral";
  recommendation: boolean;
  strengths: string[];
  summary: string;
  weaknesses: string[];
};

