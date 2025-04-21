"use client"

import { useEffect, useRef, useState } from "react"
import { useDashboard } from "@/context/dashboard-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Chart from "chart.js/auto"
import { Loader2 } from "lucide-react"
import { trackComponentRender } from "@/lib/performance"
import { useMobile } from "@/hooks/use-mobile"

export function BalanceHistory() {
  const { balanceHistory, isLoading } = useDashboard()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const isMobile = useMobile()
  const [chartHeight, setChartHeight] = useState(250)

  // Perf tracking (optional)
  useEffect(() => {
    const t = trackComponentRender("BalanceHistory")
    t.start()
    return () => t.end()
  }, [])

  // Responsive height
  useEffect(() => {
    const fn = () => setChartHeight(isMobile ? 200 : 250)
    fn()
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [isMobile])

  // Build / rebuild chart
  useEffect(() => {
    if (isLoading || !chartRef.current || !balanceHistory.length) return
    // kill old chart
    chartInstance.current?.destroy()

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // build a vertical gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, chartRef.current.height)
    gradient.addColorStop(0, "rgba(45, 96, 255, 0.4)")
    gradient.addColorStop(1, "rgba(45, 96, 255, 0.05)")

    const labels = balanceHistory.map((i) => i.month)
    const data = balanceHistory.map((i) => i.balance)

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Balance",
            data,
            borderColor: "#1814F3",
            backgroundColor: gradient,
            borderWidth: 4,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 800,
            ticks: {
              stepSize: 200,
              color: "#718EBF",
              padding: 10,
              font: { size: isMobile ? 10 : 12 },
              callback: (v) => `${v}`,
            },
            grid: {

              color: "#DFE5EE",
              lineWidth: 1,
              tickBorderDash: [4, 4],
            },
          },
          x: {
            ticks: {
              color: "#718EBF",
              padding: 5,
              font: { size: isMobile ? 10 : 12 },
            },
            grid: {
              color: "#DFE5EE",
              lineWidth: 1,
              tickBorderDash: [4, 4],
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "white",
            titleColor: "#343C6A",
            bodyColor: "#343C6A",
            borderColor: "#DFE5EE",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (ctx) => ctx[0].label,
              label: (ctx) => `$${ctx.parsed.y}`,
            },
          },
        },
      },
    })
  }, [isLoading, balanceHistory, isMobile])

  return (
    <div className="w-full space-y-2">
      <div className="text-xl font-semibold text-[#343C6A]">Balance History</div>
      <Card className="">
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <div
              className="h-[200px] sm:h-[250px] w-full flex items-center justify-center"
              role="status"
              aria-label="Loading balance history chart"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="h-[200px] sm:h-[195px] w-full overflow-hidden">
              <canvas
                ref={chartRef}
                height={chartHeight}
                role="img"
                aria-label="Line chart showing balance history over time"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BalanceHistory
