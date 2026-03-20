export const revenueData = [
    { name: '1', revenue: 32000, profit: 6400 },
    { name: '3', revenue: 35000, profit: 7000 },
    { name: '5', revenue: 31000, profit: 6200 },
    { name: '7', revenue: 38000, profit: 7600 },
    { name: '9', revenue: 47000, profit: 9400 },
    { name: '11', revenue: 42000, profit: 8400 },
    { name: '13', revenue: 39000, profit: 7800 },
    { name: '15', revenue: 45000, profit: 9000 },
    { name: '17', revenue: 56000, profit: 11200 },
    { name: '19', revenue: 51000, profit: 10200 },
    { name: '21', revenue: 62000, profit: 12400 },
    { name: '23', revenue: 50000, profit: 10000 },
    { name: '25', revenue: 58000, profit: 11600 },
    { name: '27', revenue: 48000, profit: 9600 },
    { name: '29', revenue: 65000, profit: 13000 },
    { name: '31', revenue: 72000, profit: 14400 },
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
