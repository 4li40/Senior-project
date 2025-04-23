import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface LineChartComponentProps {
  data: { name: string; value: number }[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  return format(new Date(parseInt(year), parseInt(month) - 1), 'MMM yyyy');
};

export function LineChartComponent({ data }: LineChartComponentProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tickFormatter={formatDate}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Earnings']}
            labelFormatter={formatDate}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 