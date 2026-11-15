import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VolumeDataPoint {
  date: string;
  orders: number;
  spendDollars: number;
}

export function OrderVolumeChart({ data = [] }: { data?: VolumeDataPoint[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-strong)',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'var(--foreground)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            }}
            formatter={(value: unknown, name: unknown) => [
              name === 'spendDollars' && typeof value === 'number'
                ? `$${value.toFixed(2)}`
                : String(value ?? 0),
              name === 'spendDollars' ? 'Simulated Volume' : 'Orders Count',
            ]}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#38BDF8"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#orderGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
