"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { type Card as CardType, useDashboard } from "@/context/dashboard-context"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"

export function MyCards() {
  const { cards, isLoading } = useDashboard()
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useMobile()

  // Initialize embla carousel with proper options for touch/swipe
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  })

  // Update active index when carousel slides
  useEffect(() => {
    if (!emblaApi) return undefined;

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Render card component
  const renderCard = (card: CardType, index: number) => (
    <div
      key={card.id}
      className={cn(
        "relative overflow-hidden space-y-9 rounded-xl p-4 sm:p-6 transition-all hover:shadow-md h-full",
        index === 0 ? "bg-gradient-to-br from-[#5B5A6F] to-black text-white" : "bg-white border text-[#343C6A]",
      )}
      role="listitem"
      aria-label={`${card.cardHolder}'s card ending in ${card.cardNumber.slice(-4)}`}
      tabIndex={0}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className={`text-xs ${index !== 0 && "text-[#718EBF]"} opacity-70`} id={`balance-label-${card.id}`}>
            Balance
          </p>
          <p className="text-lg sm:text-xl font-semibold" aria-labelledby={`balance-label-${card.id}`}>
            ${card.balance.toLocaleString()}
          </p>
        </div>
        {/* the card image */}
        {index === 0 ? (
          <Image
            width={500}
            height={500}
            src="/dashboardAssets/chipCard.png"
            alt="card icon"
            className="h-[34.77px] w-[34.77px]"
          />
        ) : (
          <Image
            width={500}
            height={500}
            src="/dashboardAssets/darkCard.png"
            alt="card icon"
            className="h-[34.77px] w-[34.77px]"
          />
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <p
            className={`text-[10px] ${index !== 0 && "text-[#718EBF]"} sm:text-xs opacity-70`}
            id={`cardholder-label-${card.id}`}
          >
            CARD HOLDER
          </p>
          <p className="text-xs sm:text-sm font-semibold" aria-labelledby={`cardholder-label-${card.id}`}>
            {card.cardHolder}
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] ${index !== 0 && " text-[#718EBF]"} sm:text-xs opacity-70`}
            id={`valid-thru-label-${card.id}`}
          >
            VALID THRU
          </p>
          <p className="text-xs sm:text-sm font-semibold" aria-labelledby={`valid-thru-label-${card.id}`}>
            {card.validThru}
          </p>
        </div>
      </div>
      {/* the bottom */}
      <div className="mt-auto">
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
  )

  // Custom mobile carousel implementation with direct touch handling
  const renderMobileCarousel = () => {
    if (!cards || cards.length === 0) return null

    return (
      <div className="md:hidden overflow-hidden touch-pan-y" ref={emblaRef}>
        <div className="flex pl-4">
          {cards.slice(0, 3).map((card, index) => (
            <div key={card.id} className="min-w-[85%] flex-shrink-0 pl-0 pr-4">
              {renderCard(card, index)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-[#343C6A] font-semibold">My Cards</h1>
        <Link href="/cards">
          <Button
            variant="ghost"
            className="flex items-center text-sm font-medium text-[#343C6A] hover:bg-primary/10 transition-colors active:scale-95 p-0"
            aria-label="See all cards"
          >
            See All
            <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
      <Card className="h-full border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2" aria-label="Loading cards">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" role="status"></div>
              ))}
            </div>
          ) : isMobile ? (
            // Mobile carousel view with direct embla implementation
            renderMobileCarousel()
          ) : (
            // Desktop grid view
            <div className="hidden md:grid gap-4 md:grid-cols-2" role="list" aria-label="Credit cards">
              {cards.slice(0, 2).map((card, index) => renderCard(card, index))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MyCards
