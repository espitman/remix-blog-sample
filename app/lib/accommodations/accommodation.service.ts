import type {
  Accommodation,
  AccommodationSearchResponse,
  AccommodationSearchParams,
} from "./accommodation.types";

export type { Accommodation, AccommodationSearchResponse, AccommodationSearchParams } from "./accommodation.types";

const JABAMA_API_URL =
  "https://gw.jabama.com/api/taraaz/v2/search/merchandising/legacy-plp/all-apartment?platform=mobile&allowEmptyCity=true&hasUnitRoom=true&guarantees=false";

/**
 * Fetch accommodations from Jabama API
 */
export async function getAccommodations(
  params: AccommodationSearchParams = {}
): Promise<Accommodation[]> {
  const { pageSize = 32, pageNumber = 1 } = params;

  try {
    const response = await fetch(JABAMA_API_URL, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7",
        "Content-Type": "application/json",
        Origin: "https://www.jabama.com",
        Referer: "https://www.jabama.com/",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
        "X-Server-Side": "false",
        "X-Web": "true",
        "X-unify": "9160260b-04d2-4fdb-96df-5ff8eea4431a",
        "ab-channel": "GuestWebDesktop,React1.0.0,OS X,10.15.7,undefined,2b21dde0-5a15-4950-9927-8e2fa735e66d",
        "x-user-experiments":
          "c8da7b6fcde197c7-CANCELLATION_RESELL,CANCELLATION_RESELL:TREATMENT,MOBILE_PDP_GOFTINO,MOBILE_PDP_GOFTINO:TREATMENT,INSTANT_RESERVATION_HINT,INSTANT_RESERVATION_HINT:TREATMENT,SNAPPPAY_BNPL_EXPERIMENT:ALL_OPEN,NEW_PAYMENT_FUNNEL,NEW_PAYMENT_FUNNEL:TREATMENT,VAT_WITH_SERVICE,VAT_WITH_SERVICE:,NEW_CITY_SEARCH,NEW_CITY_SEARCH:,NEW_PLP_SEARCH,NEW_PLP_SEARCH:,NEW_PLP_SEARCH_ALL-VILLAS2,NEW_PLP_SEARCH_ALL-VILLAS2:,METRIC_VARIANCE:B,T50,T50:,force_login,force_login:TREATMENT,PAYMENT_TYPE_FEE:TREATMENT,HS_AI_AGENT,HS_AI_AGENT:TREATMENT,APP_USER_LOCATION,APP_USER_LOCATION:TREATMENT,ADS_SEARCH_V2,ADS_SEARCH_V2:,SERVICE_FEE_5_35,SERVICE_FEE_5_35:,SEARCH_OPTIMIZATION,SEARCH_OPTIMIZATION:MULTIMETRIC",
      },
      body: JSON.stringify({
        "page-size": pageSize,
        "page-number": pageNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch accommodations: ${response.statusText}`);
    }

    const data: AccommodationSearchResponse = await response.json();
    return data.result.items || [];
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    // Return empty array on error instead of throwing
    return [];
  }
}

