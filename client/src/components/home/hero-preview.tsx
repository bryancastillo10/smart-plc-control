import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { waterQualityTrend } from "@/constants/hero-water-quality-placeholder";
import { formatTime } from "@/utils/formatDate";
import { useMemo } from "react";

const HeroPreview = () => {
	const latestReading = waterQualityTrend[waterQualityTrend.length - 1];
	
	const avgPH = useMemo(
		() =>
		  (
			waterQualityTrend.reduce((sum, point) => sum + point.pH, 0) /
			waterQualityTrend.length
		  ).toFixed(2),
		[]
	  );

  return (
	<Card className="border-slate-200/20 bg-white/8 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">
              Water Quality Dashboard Preview
            </CardTitle>
            <CardDescription className="text-slate-300">
              Placeholder operational data modeled for a plant-level water
              treatment workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200/20 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Avg pH
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{avgPH}</p>
              </div>
              <div className="rounded-lg border border-slate-200/20 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Turbidity
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {latestReading.turbidity.toFixed(1)} NTU
                </p>
              </div>
              <div className="rounded-lg border border-slate-200/20 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Dissolved O2
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">
                  {latestReading.dissolvedOxygen.toFixed(1)} mg/L
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/20 bg-slate-950/40 p-4">
              <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
                Water Quality Trend
              </p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={waterQualityTrend}>
                    <defs>
                      <linearGradient id="phFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#47556955" />
                    <XAxis
                      dataKey="timeStamp"
                      stroke="#94a3b8"
                      tickLine={false}
                      tickFormatter={(value) => formatTime(value)}
                      minTickGap={16}
                    />
                    <YAxis stroke="#94a3b8" tickLine={false} />
                    <Tooltip
                      labelFormatter={(value) => formatTime(String(value))}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="pH"
                      stroke="#22d3ee"
                      fillOpacity={1}
                      fill="url(#phFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </CardContent>
        </Card>
  )
}

export default HeroPreview;
