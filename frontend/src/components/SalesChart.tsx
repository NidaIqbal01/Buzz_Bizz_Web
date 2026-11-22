
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type SalesOrder = {
  total: number;
  status: string;
  createdAt?: string;
};

type SalesChartProps = {
  orders: SalesOrder[];
};

const currency = (value: number) =>
  `Rs. ${value.toLocaleString("en-PK")}`;

export default function SalesChart({ orders }: SalesChartProps) {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    );

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      revenue: 0,
    };
  });

  const monthMap = new Map(months.map((month) => [month.key, month]));

  let hasSales = false;

  orders.forEach((order) => {
    if (
      !["Confirmed", "Processing", "Delivered"].includes(order.status) ||
      !order.createdAt
    ) {
      return;
    }

    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = monthMap.get(key);

    if (month) {
      month.revenue += Number(order.total) || 0;
      hasSales = true;
    }
  });

  const totalRevenue = months.reduce(
    (sum, month) => sum + month.revenue,
    0
  );

  return (
    <section className="panel sales-chart-panel">
      <div className="panel-heading">
        <div>
          <h2>Sales Overview</h2>
          <p>Revenue generated over the last six months</p>
        </div>

        <span className="sales-chart-total">
          {currency(totalRevenue)}
        </span>
      </div>

      {!hasSales ? (
        <div className="sales-empty-state">
          <div className="sales-empty-icon">—</div>
          <h3>Your sales graph will appear here</h3>
          <p>
            Once you start confirming customer orders, your monthly
            revenue trend will be displayed here.
          </p>
        </div>
      ) : (
        <div className="sales-chart">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={months}
              margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D39B8B" stopOpacity={0.42} />
                  <stop offset="100%" stopColor="#D39B8B" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#E9E5D6"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#817e6e", fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#817e6e", fontSize: 10 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
                width={45}
              />

              <Tooltip
                formatter={(value) => [currency(Number(value)), "Revenue"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ECEAD7",
                  fontSize: 12,
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#B77F83"
                strokeWidth={3}
                fill="url(#salesGradient)"
                activeDot={{ r: 6, fill: "#B77F83" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
