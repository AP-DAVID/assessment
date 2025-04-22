"use client"

import { useDashboard } from "@/context/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export function AllCards() {
  const { cards, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#343C6A]">All Cards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={cn(
                "relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-md",
                index % 3 === 0 ? "bg-gradient-to-br from-gray-700 to-black text-white" : "bg-white border text-[#343C6A]",
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className={`text-xs ${index % 3 === 0 && "text-[#718EBF]"} opacity-70`} id={`balance-label-${card.id}`}>
                    Balance
                  </p>
                  <p className="text-lg sm:text-xl font-semibold" aria-labelledby={`balance-label-${card.id}`}>
                    ${card.balance.toLocaleString()}
                  </p>
                </div>
                {/* the card image */}
                {
                  index % 3 === 0 ?
                    <Image width={500} height={500} src="/dashboardAssets/chipCard.png" alt="card icon" className="h-[34.77px] w-[34.77px]" />
                    :
                    <Image width={500} height={500} src="/dashboardAssets/darkCard.png" alt="card icon" className="h-[34.77px] w-[34.77px]" />
                }
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-70">CARD HOLDER</p>
                  <p className="text-sm font-semibold">{card.cardHolder}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">VALID THRU</p>
                  <p className="text-sm font-semibold">{card.validThru}</p>
                </div>
              </div>
              {/* the bottom */}
              <div className="mt-auto ">
                <div
                  className={cn(
                    "flex items-center justify-between rounded-b-xl py-[20px] px-2 sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6",
                    index === 0 ? "bg-white/10" : "bg-gray-100",
                  )}
                >
                  <p className="text-base sm:text-sm leading-[100%] font-semibold">{card.cardNumber}</p>
                  <div className="flex -space-x-2" aria-hidden="true">
                    <div className={cn("h-4 w-4 sm:h-6 sm:w-6 rounded-full", index === 0 ? "bg-white/50" : "bg-gray-400/50")} />
                    <div className={cn("h-4 w-4 sm:h-6 sm:w-6 rounded-full", index === 0 ? "bg-white/50" : "bg-gray-400/50")} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
