-- Create table for Holiday Surcharges
CREATE TABLE IF NOT EXISTS holiday_surcharges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type TEXT CHECK (type IN ('FIXED', 'MULTIPLIER')) NOT NULL,
    value NUMERIC NOT NULL,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for Admin Settings (Global Config)
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial Admin Settings
INSERT INTO admin_settings (key, value, description) VALUES
('night_surcharge', '{"start_time": "23:00", "end_time": "06:00", "surcharge": 200, "type": "FIXED"}', 'Nighttime surcharge configuration'),
('addon_prices', '{"signage": 200, "seat_rear": 100, "seat_front": 100, "seat_booster": 50, "stop_point": 200}', 'Unit prices for add-on services')
ON CONFLICT (key) DO NOTHING;
