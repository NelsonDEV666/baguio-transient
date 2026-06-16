"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCalendarProps {
  unavailableDates: string[];
  pendingDates: string[];
  confirmedDates: string[];
  blockedDates: string[];
  selectedCheckIn: string;
  selectedCheckOut: string;
  onSelectDates: (checkIn: string, checkOut: string) => void;
}

export function BookingCalendar({
  unavailableDates = [],
  pendingDates = [],
  confirmedDates = [],
  blockedDates = [],
  selectedCheckIn,
  selectedCheckOut,
  onSelectDates,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calendar generation logic
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formatTileDate = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  const handleDayClick = (day: number) => {
    const dateStr = formatTileDate(day);
    
    // Prevent clicking locked out dates as Check-In
    if (!selectedCheckIn && (confirmedDates.includes(dateStr) || blockedDates.includes(dateStr))) {
      return;
    }

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      onSelectDates(dateStr, "");
    } else {
      const start = new Date(selectedCheckIn);
      const end = new Date(dateStr);

      if (end <= start) {
        // Reset and make this the new check-in date if selected date is before previous check-in
        onSelectDates(dateStr, "");
      } else {
        // Verify if any date within the proposed range contains a confirmed or blocked day
        let cursor = new Date(start);
        let hasConflict = false;
        while (cursor <= end) {
          const checkStr = cursor.toISOString().split("T")[0];
          if (confirmedDates.includes(checkStr) || blockedDates.includes(checkStr)) {
            hasConflict = true;
            break;
          }
          cursor.setDate(cursor.getDate() + 1);
        }

        if (hasConflict) {
          alert("Your selection overlaps with an already booked or blocked date. Please select a clear range.");
          return;
        }

        onSelectDates(selectedCheckIn, dateStr);
      }
    }
  };

  const getDayStyles = (day: number) => {
    const dateStr = formatTileDate(day);
    const todayStr = new Date().toISOString().split("T")[0];
    const isPast = dateStr < todayStr;

    // Check if within current selected range
    const isCheckIn = dateStr === selectedCheckIn;
    const isCheckOut = dateStr === selectedCheckOut;
    const isWithinRange =
      selectedCheckIn &&
      selectedCheckOut &&
      dateStr > selectedCheckIn &&
      dateStr < selectedCheckOut;

    if (isCheckIn || isCheckOut) {
      return "bg-blue-600 text-white font-bold rounded-lg z-10 shadow-sm";
    }
    if (isWithinRange) {
      return "bg-blue-50 text-blue-900 font-semibold rounded-none";
    }
    if (isPast) {
      return "text-gray-300 cursor-not-allowed pointer-events-none line-through";
    }
    if (blockedDates.includes(dateStr)) {
      return "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none rounded-lg border border-gray-200 line-through";
    }
    if (confirmedDates.includes(dateStr)) {
      return "bg-red-50 text-red-400 cursor-not-allowed pointer-events-none rounded-lg border border-red-100 line-through";
    }
    if (pendingDates.includes(dateStr)) {
      return "bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium rounded-lg border border-amber-200/60";
    }

    return "bg-white text-gray-900 hover:bg-gray-100 border border-gray-100 rounded-lg";
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 shadow-inner">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-gray-900">
          {months[currentMonth]} {currentYear}
        </h3>
        <div className="flex gap-1">
          <button type="button" onClick={handlePrevMonth} className="p-2 rounded-lg border hover:bg-gray-50 text-gray-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={handleNextMonth} className="p-2 rounded-lg border hover:bg-gray-50 text-gray-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Legend Labels */}
      <div className="grid grid-cols-7 text-center gap-1.5 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((wd) => (
          <span key={wd} className="text-xs font-bold text-gray-400 uppercase tracking-wider py-1">
            {wd}
          </span>
        ))}
      </div>

      {/* Days Matrix Rendering */}
      <div className="grid grid-cols-7 gap-1.5 text-sm">
        {blanksArray.map((b) => (
          <div key={`blank-${b}`} className="p-3" />
        ))}
        {daysArray.map((day) => (
          <button
            key={`day-${day}`}
            type="button"
            onClick={() => handleDayClick(day)}
            className={`p-2.5 transition-all flex items-center justify-center text-center font-medium aspect-square h-10 w-10 mx-auto ${getDayStyles(day)}`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Color Coding Indicator Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-white border border-gray-200 block" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200 block" />
          <span>Pending Hold</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200 block" />
          <span>Booked Out</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-gray-100 border border-gray-200 block" />
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  );
}