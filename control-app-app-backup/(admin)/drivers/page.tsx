import { Star, MapPin, Phone, MoreHorizontal } from "lucide-react";

export default function DriversPage() {
    const drivers = [
        { id: 1, name: "陳大華", status: "Online", rating: 4.8, trips: 1250, location: "台北市中山區", phone: "0912-345-678", vehicle: "Toyota Camry (白)" },
        { id: 2, name: "林志豪", status: "Busy", rating: 4.9, trips: 890, location: "台北市信義區", phone: "0923-456-789", vehicle: "Honda CR-V (黑)" },
        { id: 3, name: "黃國榮", status: "Offline", rating: 4.7, trips: 2100, location: "新北市板橋區", phone: "0934-567-890", vehicle: "Toyota Altis (銀)" },
        { id: 4, name: "吳雅婷", status: "Online", rating: 5.0, trips: 450, location: "台北市大安區", phone: "0945-678-901", vehicle: "Tesla Model 3 (白)" },
        { id: 5, name: "張建國", status: "Online", rating: 4.6, trips: 3200, location: "台北市內湖區", phone: "0956-789-012", vehicle: "Nissan Sentra (黑)" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">司機管理</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    新增司機
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <div key={driver.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                                    {driver.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span>{driver.rating}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{driver.trips} trips</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${driver.status === 'Online' ? 'bg-green-100 text-green-700' :
                                    driver.status === 'Busy' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {driver.status}
                            </span>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <MapPin size={16} className="text-gray-400" />
                                {driver.location}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Car size={16} className="text-gray-400" />
                                {driver.vehicle}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone size={16} className="text-gray-400" />
                                {driver.phone}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                查看詳情
                            </button>
                            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
