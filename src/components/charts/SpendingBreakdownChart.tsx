import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BreakdownItem {
  name: string;
  value: number;
  color: string;
}

const DEFAULT_BREAKDOWN: BreakdownItem[] = [
  { name: 'Telegram Growth', value: 42, color: '#38BDF8' },
  { name: 'Telegram Stars', value: 24, color: '#F59E0B' },
  { name: 'Telegram Premium', value: 18, color: '#A78BFA' },
  { name: 'Virtual Numbers', value: 16, color: '#22C55E' },
];

export function SpendingBreakdownChart({ data = DEFAULT_BREAKDOWN }: { data?: BreakdownItem[] }) {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#111B2E',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value: unknown) => [`${String(value ?? 0)}%`, 'Share']}
            />
            <Pie data={data} innerRadius={48} outerRadius={68} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B1120" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-300 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.name}</span>
            <span className="text-slate-400 font-mono text-[11px]">({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
