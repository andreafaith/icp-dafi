import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const YieldTrendChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="predicted" fill="#8884d8" stroke="#8884d8" />
      <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
      <Line type="monotone" dataKey="confidence" stroke="#ffc658" strokeDasharray="5 5" />
    </ComposedChart>
  </ResponsiveContainer>
);

export const ResourceUsageChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="usage" fill="#8884d8" />
      <Bar dataKey="efficiency" fill="#82ca9d" />
      <Line type="monotone" dataKey="cost" stroke="#ffc658" />
    </BarChart>
  </ResponsiveContainer>
);

export const SoilHealthRadar = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar name="Current" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
    </RadarChart>
  </ResponsiveContainer>
);

export const MarketTrendChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="wheat" fill="#8884d8" />
      <Bar dataKey="corn" fill="#82ca9d" />
      <Bar dataKey="soybeans" fill="#ffc658" />
      <Line type="monotone" dataKey="confidence" stroke="#ff7300" />
    </ComposedChart>
  </ResponsiveContainer>
);

export const MLPerformanceChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
      <Line type="monotone" dataKey="confidence" stroke="#82ca9d" />
      <Scatter dataKey="events" fill="#ffc658" />
    </LineChart>
  </ResponsiveContainer>
);

export const WeatherImpactChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Area yAxisId="left" type="monotone" dataKey="temperature" fill="#8884d8" stroke="#8884d8" />
      <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#82ca9d" />
      <Bar yAxisId="right" dataKey="extremeEvents" fill="#ffc658" />
    </ComposedChart>
  </ResponsiveContainer>
);

export const FinancialMetricsChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="revenue" fill="#82ca9d" stroke="#82ca9d" />
      <Bar dataKey="costs" fill="#8884d8" />
      <Line type="monotone" dataKey="roi" stroke="#ffc658" />
    </ComposedChart>
  </ResponsiveContainer>
);

export const ResourceDistributionPie = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const CompetitionAnalysisChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="marketShare" fill="#8884d8" />
      <Line type="monotone" dataKey="growth" stroke="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);
