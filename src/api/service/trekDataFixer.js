// src/utils/trekDataFixer.js

/**
 * Auto-fixes trek duration by counting departure days (not itinerary days)
 */
export function fixTrekDurationData(trekData) {
    if (!trekData) return trekData;

    // ✅ PRIORITY 1: Calculate days from departure dates (most accurate)
    let actualDays = 0;
    const firstDeparture = trekData.departures?.[0] ||
        trekData.cost_dates_data?.departures_by_month?.[0]?.departures?.[0];

    if (firstDeparture?.start && firstDeparture?.end) {
        const startDate = new Date(firstDeparture.start + "T00:00:00Z");
        const endDate = new Date(firstDeparture.end + "T00:00:00Z");
        actualDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive
    }

    // ✅ FALLBACK: Use itinerary days count
    if (actualDays === 0) {
        actualDays = trekData.itinerary_days?.length ||
            trekData.itinerary?.length ||
            trekData.trek?.itinerary_days?.length ||
            trekData.trek?.itinerary?.length ||
            0;
    }

    if (actualDays === 0) return trekData;

    // ✅ Update duration
    const correctedDuration = `${actualDays} Days`;

    // ✅ Fix hero duration
    const fixedHero = trekData.hero ? {
        ...trekData.hero,
        duration: String(actualDays),
    } : undefined;

    // ✅ Fix ALL departure end dates to match calculated duration
    const fixedDepartures = (trekData.departures || []).map(dep => {
        if (!dep.start) return dep;

        const startDate = new Date(dep.start + "T00:00:00Z");
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + actualDays - 1); // Inclusive: start is day 1

        return {
            ...dep,
            end: endDate.toISOString().split('T')[0],
        };
    });

    // ✅ Fix departures_by_month
    const fixedDeparturesByMonth = (trekData.cost_dates_data?.departures_by_month ||
        trekData.cost_dates?.departures_by_month ||
        []).map(month => ({
            ...month,
            departures: (month.departures || []).map(dep => {
                if (!dep.start) return dep;

                const startDate = new Date(dep.start + "T00:00:00Z");
                const endDate = new Date(startDate);
                endDate.setUTCDate(startDate.getUTCDate() + actualDays - 1);

                return {
                    ...dep,
                    end: endDate.toISOString().split('T')[0],
                };
            }),
        }));

    // ✅ Fix nested trek object
    const fixedTrek = trekData.trek ? {
        ...trekData.trek,
        duration: correctedDuration,
    } : undefined;

    console.log(`✅ Trek duration fixed: ${trekData.duration} → ${correctedDuration} (based on ${firstDeparture ? 'departure dates' : 'itinerary count'})`);

    return {
        ...trekData,
        duration: correctedDuration,
        ...(fixedHero && { hero: fixedHero }),
        ...(fixedTrek && { trek: fixedTrek }),
        departures: fixedDepartures,
        cost_dates_data: trekData.cost_dates_data ? {
            ...trekData.cost_dates_data,
            departures_by_month: fixedDeparturesByMonth,
        } : undefined,
        cost_dates: trekData.cost_dates ? {
            ...trekData.cost_dates,
            departures_by_month: fixedDeparturesByMonth,
        } : undefined,
        _durationFixed: true,
        _calculatedDays: actualDays,
    };
}

export function fixMultipleTreks(treks) {
    if (!Array.isArray(treks)) return treks;
    return treks.map(trek => fixTrekDurationData(trek));
}
