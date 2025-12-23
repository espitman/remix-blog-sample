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

