import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VolumeDataPoint {
  date: string;
  orders: number;
  spendDollars: number;
}

const DEFAULT_VOLUME_DATA: VolumeDataPoint[] = [
  { date: 'Mon', orders: 12, spendDollars: 24.5 },
  { date: 'Tue', orders: 19, spendDollars: 38.2 },
  { date: 'Wed', orders: 15, spendDollars: 29.0 },
  { date: 'Thu', orders: 28, spendDollars: 52.4 },
  { date: 'Fri', orders: 22, spendDollars: 45.1 },
  { date: 'Sat', orders: 34, spendDollars: 72.8 },
  { date: 'Sun', orders: 40, spendDollars: 87.0 },
];

export function OrderVolumeChart({ data = DEFAULT_VOLUME_DATA }: { data?: VolumeDataPoint[] }) {
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
            axisLine={{ stroke: '#1E293B' }}
          />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#1E293B' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111B2E',
              borderColor: '#334155',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#F1F5F9',
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
            dataKey="spendDollars"
            stroke="#A78BFA"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#spendGrad)"
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
