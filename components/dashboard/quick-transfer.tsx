"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight, Send, Loader2 } from "lucide-react"
import { type Contact, useDashboard } from "@/context/dashboard-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useMobile } from "@/hooks/use-mobile"

export function QuickTransfer() {
  const { contacts, isLoading } = useDashboard()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [amount, setAmount] = useState("525.50")
  const [amountError, setAmountError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId === selectedContact ? null : contactId)
  }

  const handleKeyDown = (e: React.KeyboardEvent, contactId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleContactSelect(contactId)
    }
  }

  const validateAmount = (value: string) => {
    if (!value.trim()) {
      return "Amount is required"
    }

    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) {
      return "Please enter a valid number"
    }

    if (numValue <= 0) {
      return "Amount must be greater than zero"
    }

    if (numValue > 10000) {
      return "Amount cannot exceed $10,000"
    }

    return null
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    setAmountError(validateAmount(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate recipient
    if (!selectedContact) {
      toast({
        title: "Error",
        description: "Please select a recipient",
        variant: "destructive",
      })
      return
    }

    // Validate amount
    const error = validateAmount(amount)
    if (error) {
      setAmountError(error)
      return
    }

    // Show confirmation dialog
    setShowConfirmation(true)
  }

  const handleConfirmTransfer = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get selected contact name
      const selectedContactName = contacts.find((c) => c.id === selectedContact)?.name || "recipient"

      // Close dialog
      setShowConfirmation(false)

      // Show success toast
      toast({
        title: "Transfer Successful",
        description: `${Number.parseFloat(amount).toFixed(2)} has been sent to ${selectedContactName}.`,
        variant: "success",
      })

      // Reset form
      setAmount("0.00")
      setSelectedContact(null)
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "There was an error processing your transfer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="w-full space-y-2">
        <div className="text-xl text-[#343C6A]">Quick Transfer</div>
        <Card className="h-full">
          <CardContent>
            <div className="space-y-6" aria-label="Loading contacts">
              <div className="flex justify-between">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2" role="status">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-muted animate-pulse"></div>
                    <div className="h-3 w-12 sm:h-4 sm:w-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-2 w-8 sm:h-3 sm:w-12 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-6">
                <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
                <div className="flex-1 h-10 bg-muted animate-pulse rounded w-full"></div>
                <div className="h-10 w-full sm:w-20 bg-muted animate-pulse rounded mt-2 sm:mt-0"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render contact
  const renderContact = (contact: Contact) => (
    <div
      key={contact.id}
      className="flex flex-col items-center cursor-pointer"
      onClick={() => handleContactSelect(contact.id)}
      onKeyDown={(e) => handleKeyDown(e, contact.id)}
      tabIndex={0}
      role="radio"
      aria-checked={selectedContact === contact.id}
      aria-label={`Select ${contact.name}, ${contact.role}`}
    >
      <div
        className={`relative mb-1 sm:mb-2 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 overflow-hidden rounded-full border-2 transition-all ${selectedContact === contact.id ? "border-primary" : "border-transparent"
          }`}
      >
        <Image src={contact.avatar || "/placeholder.svg"} alt="" fill className="object-cover" />
      </div>
      <p
        className={`text-xs sm:text-sm font-medium ${selectedContact === contact.id ? "text-[#232323]" : "text-[#343C6A]"
          }  text-center`}
      >
        {contact.name}
      </p>
      <p
        className={`text-[10px] sm:text-xs   ${selectedContact === contact.id && "font-semibold"
          } text-[#718EBF] text-center`}
      >
        {contact.role}
      </p>
    </div>
  )

  return (
    <div className="w-full space-y-2">
      <div className="text-xl text-[#343C6A] font-semibold">Quick Transfer</div>
      <Card className="h-full">
        <CardHeader></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <fieldset>
                <legend className="sr-only">Select a contact</legend>
                {isMobile ? (
                  // Mobile carousel view for contacts
                  <Carousel>
                    <CarouselContent>
                      {contacts.map((contact) => (
                        <CarouselItem key={contact.id} className="basis-1/3">
                          {renderContact(contact)}
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                  </Carousel>
                ) : (
                  // Desktop view for contacts
                  <div className="flex justify-between">
                    {contacts.map((contact) => renderContact(contact))}
                    <div className="flex flex-col items-center">
                      <div className="mb-1 sm:mb-2 flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white shadow">
                        <ChevronRight
                          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </fieldset>
              {!selectedContact && <p className="text-xs text-red-500 mt-2 text-center">Please select a recipient</p>}
            </div>

            {/* Improved responsive amount input section */}
            <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-1 xl:grid-cols-[auto_1fr] gap-2 sm:gap-3 lg:gap-1.5 items-center">
                <label
                  htmlFor="transfer-amount"
                  className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium text-[#718EBF] whitespace-nowrap"
                >
                  Write Amount
                </label>
                <div className="relative w-full">
                  <Input
                    id="transfer-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    className={`h-10 sm:h-11 md:h-12 lg:h-10 text-[16px] xl:h-11 bg-gray-100 border-0 rounded-full pr-[80px] sm:pr-[130px] lg:pr-[110px] sm:text-base lg:text-sm ${amountError ? "border border-red-500" : ""
                      }`}
                    placeholder="0.00"
                    aria-label="Transfer amount"
                    aria-invalid={!!amountError}
                    aria-describedby={amountError ? "amount-error" : undefined}
                    required
                  />
                  <Button
                    type="submit"
                    className="absolute right-0 -top-[3px] sm:top-0 h-10 sm:h-11 md:h-12 lg:h-10 xl:h-11 px-3 sm:px-4 md:px-6 lg:px-4 xl:px-5 rounded-full bg-[#232323] hover:bg-[#333333] text-white transition-all active:scale-95 text-xs sm:text-sm lg:text-xs xl:text-sm"
                    disabled={!selectedContact || !!amountError || isSubmitting}
                    aria-label="Send money"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 animate-spin" />
                        <span className="hidden sm:inline lg:hidden xl:inline ml-1">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send</span>
                        <Image
                          src="/dashboardAssets/send.png"
                          alt="send"
                          width={200}
                          height={200}
                          className="ml-1 sm:ml-2 lg:ml-1 xl:ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Button>
                  {amountError && (
                    <p
                      id="amount-error"
                      className="text-[10px] sm:text-xs lg:text-[10px] xl:text-xs text-red-500 mt-1 absolute -bottom-5 left-0"
                    >
                      {amountError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <DialogContent className="sm:max-w-[425px] max-w-[90vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>Confirm Transfer</DialogTitle>
                <DialogDescription>
                  You are about to send ${Number.parseFloat(amount).toFixed(2)} to{" "}
                  {contacts.find((c) => c.id === selectedContact)?.name}. Do you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmTransfer} disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuickTransfer
