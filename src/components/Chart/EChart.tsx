/* eslint-disable */
"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CandlestickData {
  date: string;
  values: [number, number, number, number]; // [open, close, low, high]
}

// Sample data - you can replace this with your actual data
export const chartData: CandlestickData[] = [
  {
    date: "2024-05-14",
    values: [100, 101.93, 98.58, 103.35],
  },
  {
    date: "2024-05-15",
    values: [101.93, 101.51, 100.46, 102.97],
  },
  {
    date: "2024-05-16",
    values: [101.51, 101.01, 100.5, 102.02],
  },
  {
    date: "2024-05-17",
    values: [101.01, 102.01, 99.64, 103.38],
  },
  {
    date: "2024-05-20",
    values: [100.84, 99.18, 98.15, 101.87],
  },
  {
    date: "2024-05-21",
    values: [99.18, 99.74, 97.73, 101.19],
  },
  {
    date: "2024-05-22",
    values: [99.74, 100.04, 99.42, 100.37],
  },
  {
    date: "2024-05-23",
    values: [100.04, 101.57, 98.23, 103.38],
  },
  {
    date: "2024-05-24",
    values: [101.57, 102.97, 100.25, 104.28],
  },
  {
    date: "2024-05-27",
    values: [102.21, 101.12, 99.23, 104.1],
  },
  {
    date: "2024-05-28",
    values: [101.12, 102.62, 101.04, 102.69],
  },
  {
    date: "2024-05-29",
    values: [102.62, 103.61, 102.18, 104.05],
  },
  {
    date: "2024-05-30",
    values: [103.61, 101.66, 100.22, 105.05],
  },
  {
    date: "2024-05-31",
    values: [101.66, 101.13, 100.92, 101.88],
  },
  {
    date: "2024-06-03",
    values: [102.7, 104.57, 100.69, 106.58],
  },
  {
    date: "2024-06-04",
    values: [104.57, 106.38, 104.39, 106.56],
  },
  {
    date: "2024-06-05",
    values: [106.38, 104.56, 103.37, 107.58],
  },
  {
    date: "2024-06-06",
    values: [104.56, 103.06, 102.77, 104.84],
  },
  {
    date: "2024-06-07",
    values: [103.06, 105.14, 102.93, 105.26],
  },
  {
    date: "2024-06-10",
    values: [106.08, 104.31, 102.49, 107.9],
  },
  {
    date: "2024-06-11",
    values: [104.31, 105.45, 102.82, 106.94],
  },
  {
    date: "2024-06-12",
    values: [105.45, 106.6, 105.3, 106.75],
  },
  {
    date: "2024-06-13",
    values: [106.6, 108.74, 106.41, 108.93],
  },
  {
    date: "2024-06-14",
    values: [108.74, 110.36, 108.54, 110.56],
  },
  {
    date: "2024-06-17",
    values: [112.81, 111.72, 109.79, 114.74],
  },
  {
    date: "2024-06-18",
    values: [111.72, 110.1, 109.57, 112.25],
  },
  {
    date: "2024-06-19",
    values: [110.1, 109.7, 109.09, 110.71],
  },
  {
    date: "2024-06-20",
    values: [109.7, 109.89, 108.88, 110.7],
  },
  {
    date: "2024-06-21",
    values: [109.89, 108.91, 107.33, 111.46],
  },
  {
    date: "2024-06-24",
    values: [112.92, 113.85, 112.16, 114.61],
  },
  {
    date: "2024-06-25",
    values: [113.85, 116.2, 112.1, 117.94],
  },
  {
    date: "2024-06-26",
    values: [116.2, 116.59, 115.49, 117.3],
  },
  {
    date: "2024-06-27",
    values: [116.59, 118.55, 116.15, 119],
  },
  {
    date: "2024-06-28",
    values: [118.55, 120.69, 118.22, 121.02],
  },
  {
    date: "2024-07-01",
    values: [121.27, 121.98, 119.78, 123.47],
  },
  {
    date: "2024-07-02",
    values: [121.98, 123.54, 120.05, 125.47],
  },
  {
    date: "2024-07-03",
    values: [123.54, 122.78, 122.2, 124.12],
  },
  {
    date: "2024-07-04",
    values: [122.78, 124.03, 121.34, 125.47],
  },
  {
    date: "2024-07-05",
    values: [124.03, 122.4, 122.4, 124.03],
  },
  {
    date: "2024-07-08",
    values: [124.41, 125.58, 122.42, 127.57],
  },
  {
    date: "2024-07-09",
    values: [125.58, 126.38, 124.02, 127.94],
  },
  {
    date: "2024-07-10",
    values: [126.38, 128.31, 124.2, 130.49],
  },
  {
    date: "2024-07-11",
    values: [128.31, 127.03, 125.11, 130.23],
  },
  {
    date: "2024-07-12",
    values: [127.03, 124.68, 124.16, 127.54],
  },
  {
    date: "2024-07-15",
    values: [122.12, 123.79, 121.11, 124.81],
  },
  {
    date: "2024-07-16",
    values: [123.79, 122.56, 122.26, 124.09],
  },
  {
    date: "2024-07-17",
    values: [122.56, 123.75, 120.91, 125.4],
  },
  {
    date: "2024-07-18",
    values: [123.75, 124.48, 123.11, 125.12],
  },
  {
    date: "2024-07-19",
    values: [124.48, 126.61, 123.97, 127.12],
  },
  {
    date: "2024-07-22",
    values: [123.08, 120.95, 120.2, 123.83],
  },
  {
    date: "2024-07-23",
    values: [120.95, 122, 120.38, 122.57],
  },
  {
    date: "2024-07-24",
    values: [122, 124.06, 120.7, 125.36],
  },
  {
    date: "2024-07-25",
    values: [124.06, 126.02, 122.23, 127.85],
  },
  {
    date: "2024-07-26",
    values: [126.02, 126.95, 123.68, 129.29],
  },
  {
    date: "2024-07-29",
    values: [129.93, 127.72, 126.49, 131.17],
  },
  {
    date: "2024-07-30",
    values: [127.72, 127.98, 127.48, 128.22],
  },
  {
    date: "2024-07-31",
    values: [127.98, 127.87, 127.4, 128.45],
  },
  {
    date: "2024-08-01",
    values: [127.87, 128.64, 127.45, 129.06],
  },
  {
    date: "2024-08-02",
    values: [128.64, 127.33, 125.82, 130.14],
  },
  {
    date: "2024-08-05",
    values: [127.2, 125.5, 123.65, 129.05],
  },
  {
    date: "2024-08-06",
    values: [125.5, 127.14, 124.47, 128.17],
  },
  {
    date: "2024-08-07",
    values: [127.14, 128.54, 125.43, 130.25],
  },
  {
    date: "2024-08-08",
    values: [128.54, 129.93, 126.33, 132.14],
  },
  {
    date: "2024-08-09",
    values: [129.93, 131, 129.59, 131.34],
  },
  {
    date: "2024-08-12",
    values: [131.19, 129.5, 129.15, 131.54],
  },
  {
    date: "2024-08-13",
    values: [129.5, 132.15, 127.03, 134.62],
  },
  {
    date: "2024-08-14",
    values: [132.15, 129.86, 127.33, 134.67],
  },
  {
    date: "2024-08-15",
    values: [129.86, 128.65, 128.26, 130.24],
  },
  {
    date: "2024-08-16",
    values: [128.65, 131.27, 126.88, 133.03],
  },
  {
    date: "2024-08-19",
    values: [130.3, 132.37, 129.06, 133.62],
  },
  {
    date: "2024-08-20",
    values: [132.37, 130.19, 129.63, 132.93],
  },
  {
    date: "2024-08-21",
    values: [130.19, 130.65, 128.54, 132.3],
  },
  {
    date: "2024-08-22",
    values: [130.65, 132, 128.37, 134.28],
  },
  {
    date: "2024-08-23",
    values: [132, 132.86, 130.77, 134.1],
  },
  {
    date: "2024-08-26",
    values: [130.34, 129.27, 127.78, 131.83],
  },
  {
    date: "2024-08-27",
    values: [129.27, 130.92, 127, 133.19],
  },
  {
    date: "2024-08-28",
    values: [130.92, 130.89, 129.8, 132.02],
  },
  {
    date: "2024-08-29",
    values: [130.89, 131.51, 129.38, 133.02],
  },
  {
    date: "2024-08-30",
    values: [131.51, 130.06, 127.71, 133.86],
  },
  {
    date: "2024-09-02",
    values: [129.47, 129.85, 129.03, 130.29],
  },
  {
    date: "2024-09-03",
    values: [129.85, 130.65, 129.65, 130.85],
  },
  {
    date: "2024-09-04",
    values: [130.65, 128.9, 126.94, 132.61],
  },
  {
    date: "2024-09-05",
    values: [128.9, 126.6, 124.56, 130.95],
  },
  {
    date: "2024-09-06",
    values: [126.6, 125.3, 124.73, 127.17],
  },
  {
    date: "2024-09-09",
    values: [122.5, 122.9, 120.1, 125.29],
  },
  {
    date: "2024-09-10",
    values: [122.9, 125.1, 122.1, 125.9],
  },
  {
    date: "2024-09-11",
    values: [125.1, 126.86, 123, 128.96],
  },
  {
    date: "2024-09-12",
    values: [126.86, 125.49, 123.98, 128.37],
  },
  {
    date: "2024-09-13",
    values: [125.49, 126.7, 123.72, 128.47],
  },
  {
    date: "2024-09-16",
    values: [127.78, 128.69, 125.79, 130.68],
  },
  {
    date: "2024-09-17",
    values: [128.69, 126.56, 125.96, 129.29],
  },
  {
    date: "2024-09-18",
    values: [126.56, 124.19, 123.07, 127.67],
  },
  {
    date: "2024-09-19",
    values: [124.19, 124.87, 123.64, 125.42],
  },
  {
    date: "2024-09-20",
    values: [124.87, 127.3, 124.85, 127.32],
  },
  {
    date: "2024-09-23",
    values: [123.1, 124.16, 121.14, 126.13],
  },
  {
    date: "2024-09-24",
    values: [124.16, 125.18, 122.67, 126.67],
  },
  {
    date: "2024-09-25",
    values: [125.18, 127.05, 124.83, 127.41],
  },
  {
    date: "2024-09-26",
    values: [127.05, 124.69, 124.67, 127.07],
  },
  {
    date: "2024-09-27",
    values: [124.69, 123.15, 121.99, 125.85],
  },
  {
    date: "2024-09-30",
    values: [124.93, 123.65, 121.66, 126.91],
  },
  {
    date: "2024-10-01",
    values: [123.65, 125.27, 122.26, 126.66],
  },
  {
    date: "2024-10-02",
    values: [125.27, 126.8, 125.17, 126.9],
  },
  {
    date: "2024-10-03",
    values: [126.8, 126.41, 123.9, 129.31],
  },
  {
    date: "2024-10-04",
    values: [126.41, 128.67, 123.99, 131.09],
  },
  {
    date: "2024-10-07",
    values: [132.26, 134.05, 131.7, 134.6],
  },
  {
    date: "2024-10-08",
    values: [134.05, 135.79, 131.98, 137.85],
  },
  {
    date: "2024-10-09",
    values: [135.79, 138.2, 134.86, 139.13],
  },
  {
    date: "2024-10-10",
    values: [138.2, 139.01, 137.28, 139.94],
  },
  {
    date: "2024-10-11",
    values: [139.01, 138.89, 137.3, 140.61],
  },
  {
    date: "2024-10-14",
    values: [139.49, 138.29, 138.16, 139.62],
  },
  {
    date: "2024-10-15",
    values: [138.29, 135.72, 133.87, 140.15],
  },
  {
    date: "2024-10-16",
    values: [135.72, 135.13, 134.57, 136.28],
  },
  {
    date: "2024-10-17",
    values: [135.13, 137.53, 133.05, 139.6],
  },
  {
    date: "2024-10-18",
    values: [137.53, 135.57, 135.07, 138.04],
  },
  {
    date: "2024-10-21",
    values: [134.24, 133.51, 131.71, 136.04],
  },
  {
    date: "2024-10-22",
    values: [133.51, 135.6, 132.04, 137.07],
  },
  {
    date: "2024-10-23",
    values: [135.6, 136.55, 135.01, 137.15],
  },
  {
    date: "2024-10-24",
    values: [136.55, 134.98, 134.4, 137.13],
  },
  {
    date: "2024-10-25",
    values: [134.98, 136.81, 133.63, 138.16],
  },
  {
    date: "2024-10-28",
    values: [139.15, 139.65, 138.68, 140.13],
  },
  {
    date: "2024-10-29",
    values: [139.65, 142.43, 138.63, 143.45],
  },
  {
    date: "2024-10-30",
    values: [142.43, 143.8, 140.13, 146.1],
  },
  {
    date: "2024-10-31",
    values: [143.8, 144.93, 141.34, 147.39],
  },
  {
    date: "2024-11-01",
    values: [144.93, 144.41, 144.12, 145.21],
  },
  {
    date: "2024-11-04",
    values: [145.75, 145.83, 145.01, 146.58],
  },
  {
    date: "2024-11-05",
    values: [145.83, 146.06, 144.12, 147.77],
  },
  {
    date: "2024-11-06",
    values: [146.06, 148.23, 146.05, 148.24],
  },
  {
    date: "2024-11-07",
    values: [148.23, 150.82, 147.26, 151.79],
  },
  {
    date: "2024-11-08",
    values: [150.82, 152.74, 150.74, 152.82],
  },
];

export default function CandlestickChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // Initialize chart
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Handle window resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    // Set chart options
    const options: echarts.EChartsOption = {
      grid: {
        left: "3%",
        right: "3%",
        bottom: "3%",
        containLabel: true,
      },
      title: {
        show: true,
        text: "GOLD/USD",
        padding: 10,
        top: "2%",
        textStyle: {
          color: "#fff",
        },
      },
      xAxis: {
        type: "category",
        data: chartData.map((item) => item.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return date.toLocaleDateString();
          },
          color: "#fff",
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
        axisLabel: {
          color: "#fff",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: (params: any) => {
          const data = params[0].data;
          return `
            Date: ${params[0].axisValue}<br/>
            Open: ${data[0]}<br/>
            Close: ${data[1]}<br/>
            Low: ${data[2]}<br/>
            High: ${data[3]}
          `;
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        // {
        //   show: true,
        //   type: "slider",
        //   top: "90%",
        //   start: 0,
        //   end: 100,
        // },
      ],
      series: [
        {
          type: "candlestick",
          data: chartData.map((item) => item.values),
          itemStyle: {
            color: "#ef4444", // up color
            color0: "#22c55e", // down color
            borderColor: "#ef4444",
            borderColor0: "#22c55e",
          },
        },
      ],
    };

    // Update chart
    chartInstance.current?.setOption(options);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [chartData]);

  return (
    <Card className="w-full bg-[#282E3A] border-0">
      {/* <CardHeader>
        <CardTitle className="text-grad">Chart</CardTitle>
      </CardHeader> */}
      <CardContent>
        <div
          ref={chartRef}
          className="w-full h-[400px]"
          style={{ minHeight: "400px" }}
        />
      </CardContent>
    </Card>
  );
}
