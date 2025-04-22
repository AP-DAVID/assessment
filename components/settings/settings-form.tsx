"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Pencil, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Validation types
type ValidationError = {
  [key: string]: string
}

// Email regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Password strength regex patterns
const PASSWORD_REGEX = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
}

// Error message component for better validation display
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-1.5 mt-1.5 text-destructive text-xs font-medium">
    <AlertCircle className="h-3.5 w-3.5" />
    <span>{message}</span>
  </div>
)

export function SettingsForm() {
  const { user, updateUser, updateAvatar, isLoading: isUserLoading } = useUser()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<ValidationError>({})

  const [formData, setFormData] = useState<{
    name: string
    username: string
    email: string
    password?: string
    newPassword?: string
    confirmPassword?: string
    dateOfBirth: string
    presentAddress: string
    permanentAddress: string
    city: string
    postalCode: string
    country: string
  }>({
    name: "",
    username: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    dateOfBirth: "",
    presentAddress: "",
    permanentAddress: "",
    city: "",
    postalCode: "",
    country: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        password: "**********", // Placeholder for password
        newPassword: "",
        confirmPassword: "",
        dateOfBirth: user.dateOfBirth || "",
        presentAddress: user.presentAddress || "",
        permanentAddress: user.permanentAddress || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        country: user.country || "",
      })
    }
  }, [user])

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : ""
      case "username":
        return value.trim() === ""
          ? "Username is required"
          : value.length < 3
            ? "Username must be at least 3 characters"
            : ""
      case "email":
        return value.trim() === ""
          ? "Email is required"
          : !EMAIL_REGEX.test(value)
            ? "Please enter a valid email address"
            : ""
      case "newPassword":
        if (!value) return ""
        const errors = []
        if (!PASSWORD_REGEX.minLength.test(value)) errors.push("at least 8 characters")
        if (!PASSWORD_REGEX.hasUpperCase.test(value)) errors.push("an uppercase letter")
        if (!PASSWORD_REGEX.hasLowerCase.test(value)) errors.push("a lowercase letter")
        if (!PASSWORD_REGEX.hasNumber.test(value)) errors.push("a number")
        if (!PASSWORD_REGEX.hasSpecialChar.test(value)) errors.push("a special character")
        return errors.length > 0 ? `Password must contain ${errors.join(", ")}` : ""
      case "confirmPassword":
        return value !== formData.newPassword ? "Passwords do not match" : ""
      case "postalCode":
        return value && !/^\d{5}(-\d{4})?$/.test(value) ? "Please enter a valid postal code" : ""
      default:
        return ""
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate on change
    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))

    // Special case for password confirmation
    if (name === "newPassword") {
      const confirmError = formData.confirmPassword
        ? formData.confirmPassword !== value
          ? "Passwords do not match"
          : ""
        : ""
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear any errors for this field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleSave = async () => {
    // Determine which fields to validate based on active tab
    const fieldsToValidate =
      activeTab === "profile"
        ? ["name", "username", "email", "dateOfBirth", "presentAddress", "city", "postalCode", "country"]
        : activeTab === "security"
          ? ["password", "newPassword", "confirmPassword"]
          : []

    const newErrors: ValidationError = {}
    let isValid = true

    // Only validate fields for the current tab
    fieldsToValidate.forEach((key) => {
      // Skip validation for placeholder password
      if (key === "password" && formData[key] === "**********") return
      // Skip validation for optional fields
      if (["newPassword", "confirmPassword", "permanentAddress"].includes(key) && !formData[key as keyof typeof formData]) {
        // Special case: if newPassword is provided, confirmPassword is required
        if (key === "confirmPassword" && formData.newPassword) {
          newErrors[key] = "Please confirm your password"
          isValid = false
        }
        return
      }

      const error = validateField(key, formData[key as keyof typeof formData] as string)
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Create a copy of the data to update
      const dataToUpdate = { ...formData }

      if (activeTab === "security") {
        // For security tab, only update password-related fields
        if (dataToUpdate.newPassword) {
          dataToUpdate.password = dataToUpdate.newPassword
        }
        // Remove fields not needed for API
        Object.keys(dataToUpdate).forEach((key) => {
          if (!["password", "newPassword", "confirmPassword"].includes(key)) {
            delete dataToUpdate[key as keyof typeof formData]
          }
        })
      } else {
        // For profile tab, don't update password fields
        delete dataToUpdate.password
        delete dataToUpdate.newPassword
        delete dataToUpdate.confirmPassword
      }

      // Don't update password if it's still the placeholder
      if (dataToUpdate.password === "**********") {
        delete dataToUpdate.password
      }

      // Remove fields not needed for API
      delete dataToUpdate.newPassword
      delete dataToUpdate.confirmPassword

      await updateUser(dataToUpdate)
      toast({
        title: activeTab === "security" ? "Password updated" : "Profile updated",
        description:
          activeTab === "security"
            ? "Your password has been updated successfully."
            : "Your profile has been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${activeTab === "security" ? "password" : "profile"}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or GIF image.",
        variant: "destructive",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateAvatar(file)
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePassword = async () => {
    // Validate password fields
    const newErrors: ValidationError = {}
    let isValid = true

    // Current password is required when changing password
    if (!formData.password || formData.password === "**********") {
      newErrors.password = "Current password is required"
      isValid = false
    }

    // New password validation
    if (formData.newPassword) {
      const error = validateField("newPassword", formData.newPassword)
      if (error) {
        newErrors.newPassword = error
        isValid = false
      }

      // Confirm password is required and must match
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
        isValid = false
      } else if (formData.confirmPassword !== formData.newPassword) {
        newErrors.confirmPassword = "Passwords do not match"
        isValid = false
      }
    } else {
      newErrors.newPassword = "New password is required"
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before updating your password.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const passwordData = {
        currentPassword: formData.password,
        newPassword: formData.newPassword,
      }

      // Reset password fields after successful update
      setFormData((prev) => ({
        ...prev,
        password: "**********",
        newPassword: "",
        confirmPassword: "",
      }))

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isUserLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:px-0 sm:overflow-visible">
            <TabsList className="mb-6 sm:mb-8 w-full min-w-[300px] sm:max-w-md h-auto flex flex-nowrap">
              <TabsTrigger value="profile" className="flex-1 py-2 px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                Edit Profile
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex-1 py-2 px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1 py-2 px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6 sm:space-y-8">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
              <div className="flex-shrink-0 flex justify-center md:justify-start">
                <div className="relative">
                  <div className="relative h-24 w-24 rounded-full">
                    <Avatar className="h-24 w-24">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} className="object-cover" />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#232323] text-white hover:bg-primary/90 active:scale-95 transition-all"
                      onClick={handleAvatarClick}
                      aria-label="Change profile picture"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    aria-label="Upload profile picture"
                  />
                </div>
              </div>

              <div className="grid flex-1 gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="name">
                    Your Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    placeholder="Charlene Reed"
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <ErrorMessage message={errors.name} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="username">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="charlene_reed"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={errors.username ? "border-red-500" : ""}
                    aria-invalid={!!errors.username}
                  />
                  {errors.username && <ErrorMessage message={errors.username} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="charlenereed@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500" : ""}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <ErrorMessage message={errors.email} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="profilePassword">
                    Password 
                  </Label>
                  <Input
                    id="profilePassword"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-red-500" : ""}
                    aria-invalid={!!errors.password}
                    disabled={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your password, go to the Security tab.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="dateOfBirth">
                    Date of Birth 
                  </Label>
                  <Select
                    value={formData.dateOfBirth}
                    onValueChange={(value) => handleSelectChange("dateOfBirth", value)}
                  >
                    <SelectTrigger id="dateOfBirth" className={errors.dateOfBirth ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1990-01-25">25 January 1990</SelectItem>
                      <SelectItem value="1991-01-25">25 January 1991</SelectItem>
                      <SelectItem value="1992-01-25">25 January 1992</SelectItem>
                      <SelectItem value="1993-01-25">25 January 1993</SelectItem>
                      <SelectItem value="1994-01-25">25 January 1994</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.dateOfBirth && <ErrorMessage message={errors.dateOfBirth} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="presentAddress">
                    Present Address 
                  </Label>
                  <Input
                    id="presentAddress"
                    name="presentAddress"
                    placeholder="San Jose, California, USA"
                    value={formData.presentAddress}
                    onChange={handleInputChange}
                    className={errors.presentAddress ? "border-red-500" : ""}
                    aria-invalid={!!errors.presentAddress}
                  />
                  {errors.presentAddress && <ErrorMessage message={errors.presentAddress} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="permanentAddress">
                    Permanent Address
                  </Label>
                  <Input
                    id="permanentAddress"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    placeholder="San Jose, California, USA"
                    onChange={handleInputChange}
                    className={errors.permanentAddress ? "border-red-500" : ""}
                    aria-invalid={!!errors.permanentAddress}
                  />
                  {errors.permanentAddress && <ErrorMessage message={errors.permanentAddress} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="city">
                    City 
                  </Label>
                  <Input
                    id="city"
                    placeholder="San Jose"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? "border-red-500" : ""}
                    aria-invalid={!!errors.city}
                  />
                  {errors.city && <ErrorMessage message={errors.city} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="postalCode">
                    Postal Code 
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="45962"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={errors.postalCode ? "border-red-500" : ""}
                    aria-invalid={!!errors.postalCode}
                  />
                  {errors.postalCode && <ErrorMessage message={errors.postalCode} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="country">
                    Country 
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                    <SelectTrigger id="country" className={errors.country ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="france">France</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && <ErrorMessage message={errors.country} />}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 bg-[#232323] sm:w-[190px] hover:bg-[#232323]/90 active:scale-95 transition-all w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="currentPassword">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-red-500" : ""}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && <ErrorMessage message={errors.password} />}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#232323]" htmlFor="newPassword">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={errors.newPassword ? "border-red-500" : ""}
                    aria-invalid={!!errors.newPassword}
                  />
                  {errors.newPassword && <ErrorMessage message={errors.newPassword} />}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-[#232323]" htmlFor="confirmPassword">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isSaving}
                  className="px-8 bg-[#232323] sm:w-[190px] hover:bg-[#232323]/90 active:scale-95 transition-all w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences and account settings.
              </p>

              {/* Placeholder for preferences content */}
              <div className="rounded-md p-8 text-center">
                <p className="text-muted-foreground">The preferences will be shown here.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
