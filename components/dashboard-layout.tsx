"use client"

import type React from "react"

import { RouteTransition } from "@/components/route-transition"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/user-context"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Loader2, Menu, Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const { user, isLoading: isUserLoading } = useUser()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  // Check for screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 1023)
    }

    // Initial check
    checkScreenSize()

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    // Focus the search input when opened
    if (!isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  // Close sidebar when route changes on small screens
  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarOpen(false)
      setIsSearchOpen(false)
    }
  }, [pathname, isSmallScreen])

  // Handle keyboard navigation for sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close sidebar with Escape key
      if (e.key === "Escape" && isSidebarOpen && isSmallScreen) {
        setIsSidebarOpen(false)
      }

      // Close search with Escape key
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false)
        searchButtonRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSidebarOpen, isSearchOpen, isSmallScreen])

  // Close sidebar when clicking outside on small screens
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSmallScreen && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSmallScreen, isSidebarOpen])

  // Prevent body scroll when sidebar is open on small screens
  useEffect(() => {
    if (isSmallScreen && isSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isSmallScreen, isSidebarOpen])

  const navItems = [
    { label: "Dashboard", href: "/", imagePath: "/dashboardAssets/home.png?height=24&width=24" },
    { label: "Transactions", href: "/transactions", imagePath: "/dashboardAssets/transaction.png?height=24&width=24" },
    { label: "Accounts", href: "/accounts", imagePath: "/dashboardAssets/accounts.png?height=24&width=24" },
    { label: "Investments", href: "/investments", imagePath: "/dashboardAssets/investment.png?height=24&width=24" },
    { label: "Credit Cards", href: "/cards", imagePath: "/dashboardAssets/credit.png?height=24&width=24" },
    { label: "Loans", href: "/loans", imagePath: "/dashboardAssets/loan.png?height=24&width=24" },
    { label: "Services", href: "/services", imagePath: "/dashboardAssets/service.png?height=24&width=24" },
    { label: "My Privileges", href: "/privileges", imagePath: "/dashboardAssets/privilege.png?height=24&width=24" },
    { label: "Settings", href: "/settings", imagePath: "/dashboardAssets/setting.svg?height=24&width=24" },
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center" role="status" aria-label="Loading dashboard">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading dashboard</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* <SkipToContent /> */}

      {/* Mobile sidebar overlay */}
      {isSmallScreen && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-[200px] flex-col border-r bg-white transition-transform duration-300 lg:relative lg:w-full lg:translate-x-0",
          isSmallScreen && !isSidebarOpen ? "-translate-x-full" : "translate-x-0",
        )}
        aria-label="Main navigation"
        tabIndex={isSmallScreen && !isSidebarOpen ? -1 : undefined}
      >
        <div className="flex h-14 items-center justify-between px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src={"/dashboardAssets/soar.png"}
              alt="soar"
              width={100}
              height={100}
              className="h-6 w-6 object-contain"
              aria-hidden="true"
            />
            <span>Soar Task</span>
          </Link>
          {isSmallScreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
        <nav className="flex-1 overflow-auto py-6">
          <ul className="grid gap-1 px-2">
            {navItems.map((item, index) => (
              <li key={index} className="relative ">
                {pathname === item.href && (
                  <div
                    className="absolute left-0 top-0 h-full w-1.5 bg-[#232323] rounded-tr-[10px] rounded-br-[10px]"
                    aria-hidden="true"
                  />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 h-[50px] py-2 text-sm transition-all hover:bg-muted/60",
                    pathname === item.href
                      ? " font-semibold text-[#232323]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <Image
                    src={
                      pathname === "/settings" && pathname === item.href
                        ? "/dashboardAssets/dark-setting.svg?height=24&width=24"
                        : pathname === "/" && pathname === item.href
                          ? "/dashboardAssets/dark-home.png?height=24&width=24"
                          : item?.imagePath || "/placeholder.svg"
                    }
                    alt=""
                    width={20}
                    height={20}
                    className={cn("h-5 w-5", pathname === item.href ? "opacity-100 text-black" : "opacity-70")}
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-white px-4 lg:h-[60px] lg:px-6">
          {isSmallScreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hover:bg-muted/80 active:scale-95 transition-transform"
              aria-label="Open sidebar"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <h1 className="text-lg font-semibold text-[#343C6A] truncate lg:text-xl">
            {pathname === "/" ? "Overview" : pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(2)}
          </h1>
          <div className="ml-auto flex items-center gap-2 lg:gap-4">
            {/* Mobile search toggle */}
            {isSmallScreen && (
              <Button
                ref={searchButtonRef}
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="hover:bg-muted/80 active:scale-95 transition-transform md:hidden"
                aria-label="Toggle search"
                aria-expanded={isSearchOpen}
                aria-controls="search-form"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Toggle search</span>
              </Button>
            )}

            {/* Search form - desktop */}
            <form
              className={cn("relative hidden md:block", isSearchOpen && isSmallScreen && "!block w-full")}
              id="search-form"
              role="search"
            >
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search for something"
                className="w-full rounded-full bg-muted pl-8 md:w-64 lg:w-72"
                aria-label="Search"
              />
            </form>

            {/* Mobile search form - expanded */}
            {isSearchOpen && isSmallScreen && (
              <div className="absolute inset-x-0 top-0 z-50 flex h-14 items-center gap-2 border-b bg-white px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSearch}
                  className="hover:bg-muted/80 active:scale-95 transition-transform"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Close search</span>
                </Button>
                <form className="relative flex-1" role="search">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search for something"
                    className="w-full rounded-full bg-muted pl-8"
                    aria-label="Search"
                    autoFocus
                  />
                </form>
              </div>
            )}

            {/* Hide settings button on mobile */}
            <Link href="/settings" className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-muted hover:bg-muted/80 active:scale-95 transition-transform"
                aria-label="Settings"
              >
                <Image
                  src={"/dashboardAssets/set.png"}
                  alt="settings icon"
                  width={100}
                  height={100}
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>

            {/* Hide notifications button on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex rounded-full bg-muted hover:bg-muted/80 active:scale-95 transition-transform"
              aria-label="Notifications"
            >
              <Image
                src={"/dashboardAssets/notification.png"}
                alt="notifications icon"
                width={100}
                height={100}
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Profile button - visible on all screens */}
            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted/80 active:scale-95 transition-transform"
                aria-label="Profile"
              >
                <Avatar className="h-12 w-12">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                  )}
                </Avatar>
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          </div>
        </header>
        <main id="main-content" className="flex-1 overflow-auto bg-muted/40 p-3 sm:p-4 md:p-6">
          <RouteTransition>{children}</RouteTransition>
        </main>
      </div>
    </div>
  )
}
