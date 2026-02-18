import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Charts({ data }) {

  const chartData = [
    { name: "Electricity", value: data.electricity },
    { name: "Water", value: data.water },
    { name: "Waste", value: data.waste },
    { name: "Transport", value: data.transport },
    { name: "Renewable", value: data.renewable },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 
    p-4 sm:p-6 rounded-2xl shadow-xl 
    col-span-1 md:col-span-2">

      <h2 className="font-bold mb-4 text-sm sm:text-base">
        Usage Overview
      </h2>

      <div className="w-full h-64 sm:h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
