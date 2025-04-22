import { DashboardProvider } from "@/context/dashboard-context"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function NotFoundPage() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-6xl font-bold text-gray-300">404</h2>
          <h3 className="text-2xl font-semibold mt-4">Page Not Found</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <a
            href="/"
            className="mt-8 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </DashboardLayout>
    </DashboardProvider>
  )
}
