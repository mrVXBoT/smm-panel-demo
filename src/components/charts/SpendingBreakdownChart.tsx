import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BreakdownItem {
  name: string;
  value: number;
  color: string;
}

export function SpendingBreakdownChart({ data = [] }: { data?: BreakdownItem[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (!total)
    return (
      <div className="h-64 grid place-items-center text-brand-muted-dark text-sm">
        Your first order starts the story.
      </div>
    );
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border-strong)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
              formatter={(value: unknown) => [String(value ?? 0), 'Orders']}
            />
            <Pie data={data} innerRadius={48} outerRadius={68} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-brand-secondary mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.name}</span>
            <span className="text-brand-muted-dark font-mono text-[11px]">
              ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
