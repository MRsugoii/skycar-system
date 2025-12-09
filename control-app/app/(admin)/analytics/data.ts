export const revenueData = [
    { name: '1月', revenue: 450000, profit: 90000 },
    { name: '2月', revenue: 520000, profit: 104000 },
    { name: '3月', revenue: 480000, profit: 96000 },
    { name: '4月', revenue: 610000, profit: 122000 },
    { name: '5月', revenue: 550000, profit: 110000 },
    { name: '6月', revenue: 750000, profit: 150000 },
    { name: '7月', revenue: 820000, profit: 164000 },
    { name: '8月', revenue: 780000, profit: 156000 },
    { name: '9月', revenue: 890000, profit: 178000 },
    { name: '10月', revenue: 950000, profit: 190000 },
    { name: '11月', revenue: 1020000, profit: 204000 },
    { name: '12月', revenue: 1150000, profit: 230000 },
];

export const orderStatusData = [
    { name: '已完成', value: 85, color: '#22c55e' }, // green-500
    { name: '進行中', value: 12, color: '#3b82f6' }, // blue-500
    { name: '已取消', value: 3, color: '#ef4444' }, // red-500
];

export const peakHoursData = [
    { hour: '00:00', orders: 45 },
    { hour: '02:00', orders: 20 },
    { hour: '04:00', orders: 15 },
    { hour: '06:00', orders: 30 },
    { hour: '08:00', orders: 120 },
    { hour: '10:00', orders: 85 },
    { hour: '12:00', orders: 110 },
    { hour: '14:00', orders: 75 },
    { hour: '16:00', orders: 65 },
    { hour: '18:00', orders: 145 },
    { hour: '20:00', orders: 130 },
    { hour: '22:00', orders: 95 },
];

export const driverPerformanceData = [
    { name: '王大明', rating: 4.9, orders: 156, revenue: 45000 },
    { name: '李阿姨', rating: 4.8, orders: 142, revenue: 41500 },
    { name: '張小豪', rating: 5.0, orders: 128, revenue: 39800 },
    { name: '陳建宏', rating: 4.7, orders: 115, revenue: 33200 },
    { name: '林志豪', rating: 4.9, orders: 98, revenue: 28900 },
];

export const kpiMetrics = [
    {
        title: "本月總營收",
        value: "NT$ 1,150,000",
        change: "+12.5%",
        trend: "up",
        icon: "dollar"
    },
    {
        title: "平均客單價",
        value: "NT$ 420",
        change: "+3.2%",
        trend: "up",
        icon: "cart"
    },
    {
        title: "活躍司機數",
        value: "45 / 50",
        change: "+5.0%",
        trend: "up",
        icon: "users"
    },
    {
        title: "總訂單數",
        value: "2,845",
        change: "+15.8%",
        trend: "up",
        icon: "orders"
    }
];
