import { Suspense, lazy } from "react"
import { DashboardProvider } from "@/context/dashboard-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ErrorBoundary } from "@/components/error-boundary"

// Lazy load components
const MyCards = lazy(() => import("@/components/dashboard/my-cards").then((mod) => ({ default: mod.MyCards })))
const RecentTransactions = lazy(() =>
  import("@/components/dashboard/recent-transactions").then((mod) => ({ default: mod.RecentTransactions })),
)
const WeeklyActivity = lazy(() =>
  import("@/components/dashboard/weekly-activity").then((mod) => ({ default: mod.WeeklyActivity })),
)
const ExpenseStatistics = lazy(() =>
  import("@/components/dashboard/expense-statistics").then((mod) => ({ default: mod.ExpenseStatistics })),
)
const QuickTransfer = lazy(() =>
  import("@/components/dashboard/quick-transfer").then((mod) => ({ default: mod.QuickTransfer })),
)
const BalanceHistory = lazy(() =>
  import("@/components/dashboard/balance-history").then((mod) => ({ default: mod.BalanceHistory })),
)

// Skeleton loaders for each component
const CardsSkeleton = () => <div className="h-[300px] rounded-xl bg-card border animate-pulse"></div>

const ChartSkeleton = () => (
  <div className="h-[300px] rounded-xl bg-card border p-6">
    <div className="h-6 w-32 bg-muted rounded mb-6 animate-pulse"></div>
    <div className="h-[calc(100%-2rem)] w-full bg-muted rounded animate-pulse"></div>
  </div>
)

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <ErrorBoundary
          fallback={
            <div className="p-4 bg-red-50 text-red-500 rounded-md" role="alert">
              Something went wrong loading the dashboard.
            </div>
          }
        >
          <div className="grid gap-4 sm:gap-6">
            {/* First row */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Suspense fallback={<CardsSkeleton />}>
                  <MyCards />
                </Suspense>
              </div>
              <div>
                <Suspense fallback={<CardsSkeleton />}>
                  <RecentTransactions />
                </Suspense>
              </div>
            </div>

            {/* Second row */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Suspense fallback={<ChartSkeleton />}>
                  <WeeklyActivity />
                </Suspense>
              </div>
              <div>
                <Suspense fallback={<ChartSkeleton />}>
                  <ExpenseStatistics />
                </Suspense>
              </div>
            </div>

            {/* Third row */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
              <div>
                <Suspense fallback={<CardsSkeleton />}>
                  <QuickTransfer />
                </Suspense>
              </div>
              <div className="lg:col-span-2">
                <Suspense fallback={<ChartSkeleton />}>
                  <BalanceHistory />
                </Suspense>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </DashboardLayout>
    </DashboardProvider>
  )
}
