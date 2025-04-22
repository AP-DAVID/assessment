import { DashboardProvider } from "@/context/dashboard-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsForm } from "@/components/settings/settings-form"

export default function SettingsPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <div className="mx-auto max-w-7xl">
          <SettingsForm />
        </div>
      </DashboardLayout>
    </DashboardProvider>
  )
}
