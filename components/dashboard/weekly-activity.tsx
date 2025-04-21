"use client"

import { useEffect, useRef, useState } from "react"
import { useDashboard } from "@/context/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Chart from "chart.js/auto"
import { Loader2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function WeeklyActivity() {
  const { weeklyActivity, isLoading } = useDashboard()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const isMobile = useMobile()
  const [chartHeight, setChartHeight] = useState(300)

  // Adjust chart height based on screen size
  useEffect(() => {
    const updateChartHeight = () => {
      if (isMobile) {
        setChartHeight(250)
      } else {
        setChartHeight(300)
      }
    }

    updateChartHeight()
    window.addEventListener("resize", updateChartHeight)
    return () => window.removeEventListener("resize", updateChartHeight)
  }, [isMobile])

  useEffect(() => {
    if (!isLoading && chartRef.current && weeklyActivity.length > 0) {
      // Destroy existing chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Format data for Chart.js
        const labels = weeklyActivity.map((item) => item.day)
        const depositData = weeklyActivity.map((item) => item.deposit)
        const withdrawalData = weeklyActivity.map((item) => item.withdrawal)

        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Deposit",
                data: depositData,
                backgroundColor: "#396AFF",
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false,
                barPercentage: 0.6,
                maxBarThickness: 20,
                categoryPercentage: 0.5,
              },
              {
                label: "Withdrawal",
                data: withdrawalData,
                backgroundColor: "#232323",
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false,
                barPercentage: 0.6,
                maxBarThickness: 20,
                categoryPercentage: 0.5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                border: {
                  display: false,
                },
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#718EBF",
                  padding: 10,
                  font: {
                    size: isMobile ? 10 : 12,
                  },
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#718EBF",
                  font: {
                    size: isMobile ? 10 : 12,
                  },
                },
                border: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                align: "end",
                labels: {
                  boxWidth: 10,
                  boxHeight: 10,
                  usePointStyle: true,
                  pointStyle: "circle",
                  padding: isMobile ? 10 : 20,
                  color: "#718EBF",
                  font: {
                    size: isMobile ? 10 : 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: "white",
                titleColor: "#343C6A",
                bodyColor: "#343C6A",
                borderColor: "#DFE5EE",
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [isLoading, weeklyActivity, isMobile])

  return (
    <div className="w-full space-y-2">
      <div className="text-xl text-[#343C6A] font-semibold">Weekly Activity</div>
      <Card className="h-full">
        {/* <CardHeader>
          <CardTitle className="text-xl text-[#343C6A]">Weekly Activity</CardTitle>
        </CardHeader> */}
        <CardContent>
          {isLoading ? (
            <div
              className="h-[250px] sm:h-[300px] w-full flex items-center justify-center"
              role="status"
              aria-label="Loading weekly activity chart"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">Loading chart</span>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[300px] w-full overflow-hidden">
              <canvas
                ref={chartRef}
                height={chartHeight}
                role="img"
                aria-label="Bar chart showing weekly deposits and withdrawals"
              ></canvas>
              {/* Add accessible table with the same data for screen readers */}
              <div className="sr-only">
                <table>
                  <caption>Weekly Activity - Deposits and Withdrawals</caption>
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Deposits</th>
                      <th scope="col">Withdrawals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyActivity.map((item) => (
                      <tr key={item.day}>
                        <th scope="row">{item.day}</th>
                        <td>${item.deposit}</td>
                        <td>${item.withdrawal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WeeklyActivity
