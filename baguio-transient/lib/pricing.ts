import { PROPERTY } from "./config/property";

export type RateDay = {
  date: string;       // YYYY-MM-DD
  basePrice: number;
  extraPaxPrice: number;
  includedPax: number;
  rateName: string;
};

export type PriceBreakdown = {
  nights: number;
  nightlyBreakdown: RateDay[];
  accommodationTotal: number;
  extraPaxFee: number;
  grandTotal: number;
  reservationFee: number;
  remainingBalance: number;
};

export function calculatePrice(
  checkIn: Date,
  checkOut: Date,
  paxCount: number,
  rates: Array<{
    start_date: string;
    end_date: string;
    base_price: number;
    extra_pax_price: number;
    included_pax: number;
    rate_name: string;
  }>
): PriceBreakdown {
  const nights: RateDay[] = [];
  const cursor = new Date(checkIn);

  while (cursor < checkOut) {
    const dateStr = cursor.toISOString().split("T")[0];
    const match = rates.find(
      (r) => dateStr >= r.start_date && dateStr <= r.end_date
    );
    nights.push({
      date: dateStr,
      basePrice: match?.base_price ?? PROPERTY.defaultBasePrice,
      extraPaxPrice: match?.extra_pax_price ?? PROPERTY.defaultExtraPaxPrice,
      includedPax: match?.included_pax ?? PROPERTY.defaultIncludedPax,
      rateName: match?.rate_name ?? "Standard Rate",
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const accommodationTotal = nights.reduce((sum, n) => sum + n.basePrice, 0);

  // Extra pax is charged per night for pax over the included amount
  const extraPaxFee = nights.reduce((sum, n) => {
    const extraPax = Math.max(0, paxCount - n.includedPax);
    return sum + extraPax * n.extraPaxPrice;
  }, 0);

  const grandTotal = accommodationTotal + extraPaxFee;
  const reservationFee = grandTotal * (PROPERTY.reservationFeePercent / 100);
  const remainingBalance = grandTotal - reservationFee;

  return {
    nights: nights.length,
    nightlyBreakdown: nights,
    accommodationTotal,
    extraPaxFee,
    grandTotal,
    reservationFee,
    remainingBalance,
  };
}