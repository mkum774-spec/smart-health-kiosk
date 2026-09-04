import React from "react";

/**
 * When ayurveda comes back null from GET /doctor/consultations/{id},
 * you can't distinguish "patient chose general check-in" from "patient
 * skipped mid-form" from the API alone — both just produce null. That's
 * fine; the doctor doesn't need the distinction. One empty-state message
 * covers both.
 */
export function AyurvedaEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-center select-none">
      <p className="text-slate-700 font-medium">
        No Ayurvedic assessment recorded for this visit
      </p>
      <p className="text-sm text-slate-500 mt-1">
        Patient checked in for a general/routine visit. Constitutional
        assessment can be added during consultation if needed.
      </p>
    </div>
  );
}
