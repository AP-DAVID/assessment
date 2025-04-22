"use client"

import { useEffect, useRef, useState } from "react"
import { useDashboard } from "@/context/dashboard-context"
import { Card, CardContent } from "@/components/ui/card"
import Chart from "chart.js/auto"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Loader2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function ExpenseStatistics() {
  const { expenseCategories, isLoading } = useDashboard()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const isMobile = useMobile()

  const [chartHeight, setChartHeight] = useState(300)
  const [isLayoutReady, setIsLayoutReady] = useState(false)

  // Handle chart height based on screen width
  useEffect(() => {
    function handleResize() {
      const w = chartRef.current?.parentElement?.clientWidth ?? 0
      setChartHeight(w < 300 ? 200 : w < 400 ? 220 : 300)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Wait for layout to fully stabilize before rendering chart
  useEffect(() => {
    let prevWidth = 0
    const checkInterval = setInterval(() => {
      const currentWidth = chartRef.current?.parentElement?.clientWidth ?? 0
      if (currentWidth && currentWidth === prevWidth) {
        clearInterval(checkInterval)
        setIsLayoutReady(true)
      }
      prevWidth = currentWidth
    }, 100)

    return () => clearInterval(checkInterval)
  }, [])

  // Build pie chart once data and layout are ready
  useEffect(() => {
    if (!isLoading && isLayoutReady && chartRef.current && expenseCategories.length) {
      chartInstance.current?.destroy()

      const ctx = chartRef.current.getContext("2d")
      if (!ctx) return

      const data = expenseCategories.map((c) => c.percentage)
      const labels = expenseCategories.map((c) => c.category)
      const colors = expenseCategories.map((c) => c.color)

      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderColor: "#fff",
              borderWidth: 4,
              spacing: 4,
            },
          ],
        },
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            datalabels: {
              color: "#fff",
              font: { weight: "bold", size: isMobile ? 10 : 12 },
              formatter: (value, ctx) => {
                const idx = ctx.dataIndex
                const cat = ctx.chart.data.labels![idx]
                return `${value}%\n${cat}`
              },
              anchor: "center",
              align: "center",
              offset: -10,
              clamp: true,
              clip: true,
              padding: 20,
            },
          },
        },
      })
    }

    return () => chartInstance.current?.destroy()
  }, [isLoading, isLayoutReady, expenseCategories, isMobile])

  return (
    <div className="w-full space-y-2">
      <div className="text-xl text-[#343C6A] font-semibold">Expense Statistics</div>
      <Card className="w-full h-full bg-white rounded-lg">
        <CardContent>
          {isLoading ? (
            <div
              className="h-[250px] sm:h-[300px] w-full flex items-center justify-center"
              role="status"
              aria-label="Loading expense statistics chart"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative h-[250px] sm:h-[300px] w-full min-w-0">
              <canvas
                ref={chartRef}
                height={chartHeight}
                width="100%"
                className="w-full"
                role="img"
                aria-label="Pie chart showing expense distribution by category"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpenseStatistics
