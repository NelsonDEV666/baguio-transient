"use client";

import { useState, useEffect } from "react";
import { calculatePrice, PriceBreakdown } from "@/lib/pricing";

export function usePricing(checkIn: string, checkOut: string, paxCount: number) {
  const [rates, setRates] = useState([]);
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/rates");
        const json = await res.json();
        if (json && json.rates) {
          setRates(json.rates);
        }
      } catch (err) {
        console.error("Error fetching live rates:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRates();
  }, []);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setBreakdown(null);
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end > start) {
      let currentCalculation: any = null;

      try {
        // Try calculating using the live database configuration scripts first
        currentCalculation = calculatePrice(start, end, paxCount, rates);
      } catch (err) {
        console.warn("Live calculation check bypassed. Initiating safe offline layout calculations.");
      }

      // Naming convention fix using snake_case models matching your core configurations
      if (!currentCalculation || !currentCalculation.total_price) {
        const nightsCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const baseRatePerNight = 3500; 
        const extraPaxRate = 500;
        const basePaxCount = 4;
        
        let nightTotal = nightsCount * baseRatePerNight;
        let extraPaxTotal = 0;
        
        if (paxCount > basePaxCount) {
          extraPaxTotal = (paxCount - basePaxCount) * extraPaxRate * nightsCount;
        }
        
        const total = nightTotal + extraPaxTotal;
        
        currentCalculation = {
          base_price: nightTotal,
          extra_pax_price: extraPaxTotal,
          total_price: total,
          reservation_fee: total * 0.5, 
          nights_count: nightsCount
        };
      }

      setBreakdown(currentCalculation as PriceBreakdown);
    } else {
      setBreakdown(null);
    }
  }, [checkIn, checkOut, paxCount, rates]);

  return { breakdown, isLoading };
}