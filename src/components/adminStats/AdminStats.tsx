import { User, Box, Package, DollarSign } from "lucide-react";

type Stats = {
     users: { total?: number; customers?: number; sellers?: number; admins?: number };
     medicines?: number;
     orders: { total?: number; delivered?: number };
     revenue?: number;
};

interface Props {
     stats?: Stats;
}

export default function AdminStats({ stats }: Props) {
     return (
          <div className="p-8 bg-gray-50 min-h-screen">
               <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Users Card */}
                    <div className="flex flex-col justify-between p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105">
                         <div className="flex items-center mb-4">
                              <User className="w-6 h-6 text-blue-500 mr-2" />
                              <h2 className="text-lg font-semibold text-gray-700">Users</h2>
                         </div>
                         <div className="space-y-1 text-gray-600">
                              <p>Total: {stats?.users?.total ?? 0}</p>
                              <p>Customers: {stats?.users?.customers ?? 0}</p>
                              <p>Sellers: {stats?.users?.sellers ?? 0}</p>
                              <p>Admins: {stats?.users?.admins ?? 0}</p>
                         </div>
                    </div>

                    {/* Medicines Card */}
                    <div className="flex flex-col justify-between p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105">
                         <div className="flex items-center mb-4">
                              <Box className="w-6 h-6 text-green-500 mr-2" />
                              <h2 className="text-lg font-semibold text-gray-700">Medicines</h2>
                         </div>
                         <p className="text-gray-600">Total Medicines: {stats?.medicines ?? 0}</p>
                    </div>

                    {/* Orders Card */}
                    <div className="flex flex-col justify-between p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105">
                         <div className="flex items-center mb-4">
                              <Package className="w-6 h-6 text-orange-500 mr-2" />
                              <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
                         </div>
                         <div className="space-y-1 text-gray-600">
                              <p>Total Orders: {stats?.orders?.total ?? 0}</p>
                              <p>Delivered Orders: {stats?.orders?.delivered ?? 0}</p>
                         </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="flex flex-col justify-between p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105">
                         <div className="flex items-center mb-4">
                              <DollarSign className="w-6 h-6 text-purple-500 mr-2" />
                              <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
                         </div>
                         <p className="text-gray-600 text-xl font-semibold">
                              ${stats?.revenue?.toFixed(2) ?? "0.00"}
                         </p>
                    </div>
               </div>
          </div>
     );
}
