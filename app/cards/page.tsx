import { DashboardProvider } from "@/context/dashboard-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AllCards } from "@/components/cards/all-cards"

export default function CardsPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <div className="mx-auto max-w-5xl">
          <AllCards />
        </div>
      </DashboardLayout>
    </DashboardProvider>
  )
}
