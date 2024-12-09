/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, PauseCircle, PlayCircle } from "lucide-react";

interface CandlestickData {
  date: string;
  values: [number, number, number, number]; // [open, close, low, high]
}

interface ChartProps {
  initialData: CandlestickData[];
  title?: string;
  refreshInterval?: number; // in milliseconds
  onDataRequest?: () => Promise<CandlestickData>;
}

export default function LiveCandlestickChart({
  initialData,
  title = "GOLD/USD Chart",
  refreshInterval = 5000,
  onDataRequest,
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>(initialData);
  const [isLive, setIsLive] = useState(true);
  const [timeRange, setTimeRange] = useState("1M"); // 1D, 1W, 1M, 3M, 6M, 1Y

  // Calculate moving averages
  const calculateMA = (data: CandlestickData[], period: number) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null);
        continue;
      }
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].values[1]; // Using close price
      }
      result.push(+(sum / period).toFixed(2));
    }
    return result;
  };

  useEffect(() => {
    if (!chartRef.current || chartInstance.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Handle window resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // Live data update effect
  useEffect(() => {
    if (!isLive || !onDataRequest) return;

    const updateInterval = setInterval(async () => {
      try {
        const newData = await onDataRequest();
        if (newData) {
          setChartData((prev) => [...prev.slice(1), newData]);
        }
      } catch (error) {
        console.error("Failed to fetch new data:", error);
      }
    }, refreshInterval);

    return () => clearInterval(updateInterval);
  }, [isLive, onDataRequest, refreshInterval]);

  // Chart update effect
  useEffect(() => {
    if (!chartInstance.current) return;

    const ma5 = calculateMA(chartData, 5);
    const ma20 = calculateMA(chartData, 20);

    const options: echarts.EChartsOption = {
      animation: true,
      legend: {
        top: 10,
        left: "center",
        data: ["Candlestick", "MA5", "MA20"],
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.map((item) => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return date.toLocaleDateString();
          },
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: (params: any) => {
          const date = params[0].axisValue;
          let tooltip = `<strong>${date}</strong><br/>`;

          params.forEach((param: any) => {
            if (param.seriesName === "Candlestick") {
              const [open, close, low, high] = param.data;
              tooltip += `Open: ${open}<br/>`;
              tooltip += `Close: ${close}<br/>`;
              tooltip += `Low: ${low}<br/>`;
              tooltip += `High: ${high}<br/>`;
            } else {
              tooltip += `${param.seriesName}: ${param.data}<br/>`;
            }
          });

          return tooltip;
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 50,
          end: 100,
        },
        {
          show: true,
          type: "slider",
          bottom: "3%",
          start: 50,
          end: 100,
        },
      ],
      series: [
        {
          name: "Candlestick",
          type: "candlestick",
          data: chartData.map((item) => item.values),
          itemStyle: {
            color: "#ef4444",
            color0: "#22c55e",
            borderColor: "#ef4444",
            borderColor0: "#22c55e",
          },
        },
        {
          name: "MA5",
          type: "line",
          data: ma5,
          smooth: true,
          lineStyle: {
            width: 1,
            opacity: 0.7,
          },
        },
        {
          name: "MA20",
          type: "line",
          data: ma20,
          smooth: true,
          lineStyle: {
            width: 1,
            opacity: 0.7,
          },
        },
      ],
    };

    chartInstance.current.setOption(options);
  }, [chartData]);

  // Time range filter handler
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case "1D":
        startDate.setDate(now.getDate() - 1);
        break;
      case "1W":
        startDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredData = initialData.filter(
      (item) => new Date(item.date) >= startDate
    );
    setChartData(filteredData);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            {["1D", "1W", "1M", "3M", "6M", "1Y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange(range)}
              >
                {range}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? (
                <PauseCircle className="h-4 w-4" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={chartRef}
          className="w-full h-[500px]"
          style={{ minHeight: "500px" }}
        />
      </CardContent>
    </Card>
  );
}
