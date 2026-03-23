import { supabase } from './supabase';

export type CarTypePrices = {
    [key: string]: number; // car_type_id -> price
};

export type PriceContext = {
    airport: string;
    region: string;
    carTypeId: string;
    pickupDate: string; // YYYY-MM-DD
    pickupTime: string; // HH:mm
    addOns?: {
        seats?: { rear?: number; front?: number; booster?: number };
        signage?: boolean;
        stops?: number;
    };
    coupon?: number;
};

export type PriceResult = {
    total: number;
    breakdown: {
        base: number;
        night: number;
        holiday: number;
        remote: number;
        signage: number;
        seats: number;
        stops: number;
        discount: number;
    };
    details: {
        holidayName?: string;
        nightRule?: string;
    };
};

export const PricingService = {
    // --- Core Calculation ---
    async calculatePrice(ctx: PriceContext): Promise<PriceResult | null> {
        // 1. Fetch Base Price & Remote Surcharge
        const { data: routeData, error: routeError } = await supabase
            .from('airport_prices')
            .select('*')
            .eq('airport', ctx.airport)
            .eq('region', ctx.region)
            .single();

        if (routeError || !routeData) {
            console.error('PricingService: Route not found', routeError);
            return null;
        }

        const basePrice = Number(routeData.prices[ctx.carTypeId] || 0);
        const remoteFee = Number(routeData.remote_surcharge || 0);

        // 2. Fetch Settings & Rules (Could be cached)
        const { data: settingsData } = await supabase.from('admin_settings').select('*');
        const { data: holidays } = await supabase.from('holiday_surcharges').select('*');

        const settingsMap = (settingsData || []).reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as any);
        const nightRule = settingsMap['night_surcharge'] || { start_time: "23:00", end_time: "06:00", surcharge: 200, type: "FIXED" };
        const addonPrices = settingsMap['addon_prices'] || { signage: 200, seat_rear: 100, seat_front: 100, seat_booster: 50, stop_point: 200 };

        // 3. Night Surcharge
        let nightFee = 0;
        if (this.isNightTime(ctx.pickupTime, nightRule.start_time, nightRule.end_time)) {
            nightFee = nightRule.type === 'FIXED' ? Number(nightRule.surcharge) : Math.round(basePrice * (Number(nightRule.surcharge) - 1));
        }

        // 4. Holiday Surcharge
        let holidayFee = 0;
        let holidayName = undefined;
        const activeHoliday = (holidays || []).find((h: any) => ctx.pickupDate >= h.start_date && ctx.pickupDate <= h.end_date);

        // Priority logic: Currently just taking the first match, or could sort by priority if DB has it
        if (activeHoliday) {
            holidayName = activeHoliday.name;
            holidayFee = activeHoliday.type === 'FIXED'
                ? Number(activeHoliday.value)
                : Math.round(basePrice * (Number(activeHoliday.value) - 1));
        }

        // 5. Add-ons
        const signageFee = ctx.addOns?.signage ? Number(addonPrices.signage || 200) : 0;

        const seats = ctx.addOns?.seats || {};
        const seatFee = (seats.rear || 0) * (addonPrices.seat_rear || 0) +
            (seats.front || 0) * (addonPrices.seat_front || 0) +
            (seats.booster || 0) * (addonPrices.seat_booster || 0);

        const stopFee = (ctx.addOns?.stops || 0) * (addonPrices.stop_point || 200);

        const discount = ctx.coupon || 0;

        const total = basePrice + nightFee + holidayFee + remoteFee + signageFee + seatFee + stopFee - discount;

        return {
            total: Math.max(0, total),
            breakdown: { base: basePrice, night: nightFee, holiday: holidayFee, remote: remoteFee, signage: signageFee, seats: seatFee, stops: stopFee, discount },
            details: { holidayName, nightRule: nightFee > 0 ? `${nightRule.start_time}-${nightRule.end_time}` : undefined }
        };
    },

    // --- Helper: Night Time Check ---
    isNightTime(time: string, start: string, end: string): boolean {
        const [h, m] = time.split(':').map(Number);
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);

        const tVal = h * 60 + m;
        const sVal = sh * 60 + sm;
        const eVal = eh * 60 + em;

        if (sVal > eVal) { // Crosses midnight (e.g. 23:00 to 06:00)
            return tVal >= sVal || tVal < eVal;
        } else {
            return tVal >= sVal && tVal < eVal;
        }
    },

    // --- Admin: Fetch/Update ---
    async getHolidays() {
        return supabase.from('holiday_surcharges').select('*').order('start_date', { ascending: true });
    },

    async addHoliday(holiday: any) {
        return supabase.from('holiday_surcharges').insert(holiday);
    },

    async deleteHoliday(id: string) {
        return supabase.from('holiday_surcharges').delete().eq('id', id);
    },

    async getGlobalSettings() {
        const { data } = await supabase.from('admin_settings').select('*');
        return (data || []).reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as any);
    },

    async updateGlobalSetting(key: string, value: any) {
        return supabase.from('admin_settings').upsert({ key, value });
    }
};
