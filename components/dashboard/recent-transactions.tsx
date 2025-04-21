"use client"

import { useDashboard } from "@/context/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, User, Wallet } from "lucide-react"
import Image from "next/image"

export function RecentTransactions() {
  const { transactions, isLoading } = useDashboard()

  // Function to get the appropriate icon
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "card":
        return <Image src={"/dashboardAssets/finance.png"} alt="finance" width={200} height={200} className=" h-[22px]  w-[22px] object-contain sm:h-[25px] sm:w-[25px]" aria-hidden="true" />
      case "paypal":
        return <Image src={"/dashboardAssets/paypal.png"} alt="paypal" width={200} height={200} className=" h-[22px]  w-[22px] object-contain sm:h-[25px] sm:w-[25px]" aria-hidden="true" />
      case "user":
        return <Image src={"/dashboardAssets/iconfinder.png"} alt="iconfinder" width={200} height={200} className=" h-[22px]  w-[22px] object-contain sm:h-[25px] sm:w-[25px]" aria-hidden="true" />
      default:
        return <Image src={"/dashboardAssets/paypal.png"} alt="paypal" width={200} height={200} className=" h-[22px]  w-[22px] object-contain sm:h-[25px] sm:w-[25px]" aria-hidden="true" />
    }
  }

  return (
    <div className="w-full space-y-4 pt-[6px]">
      <div className="text-xl text-[#343C6A] font-semibold">Recent Transaction</div>
      <Card className="h-full pt-5 ">
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-4" aria-label="Loading transactions">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse" role="status">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-16 bg-muted rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-muted rounded flex-shrink-0"></div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-4 sm:space-y-6 min-w-[300px]" aria-label="Recent transactions">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="flex items-center gap-3 sm:gap-4" tabIndex={0}>
                  <div
                    style={{
                      backgroundColor: transaction.iconBg
                    }}
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full flex-shrink-0`}
                    aria-hidden="true"
                  >
                    {getIcon(transaction.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{transaction.description}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${transaction.type === "deposit" ? "text-green-500" : "text-red-500"
                      }`}
                    aria-label={`${transaction.type === "deposit" ? "Deposit" : "Withdrawal"} of $${transaction.amount}`}
                  >
                    {transaction.type === "deposit" ? "+" : "-"}${transaction.amount}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card></div>
  )
}

export default RecentTransactions
