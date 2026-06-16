"use client";

import { useState, useEffect } from "react";

export function useAvailability() {
  const [availability, setAvailability] = useState({
    unavailableDates: [] as string[],
    pendingDates: [] as string[],
    confirmedDates: [] as string[],
    blockedDates: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveAvailability = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/availability");
        const data = await res.json();
        
        if (res.ok) {
          setAvailability({
            unavailableDates: data.unavailableDates || [],
            pendingDates: data.pendingDates || [],
            confirmedDates: data.confirmedDates || [],
            blockedDates: data.blockedDates || [],
          });
        }
      } catch (error) {
        console.error("Failed to sync live calendar dates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveAvailability();
  }, []);

  return { availability, isLoading };
}