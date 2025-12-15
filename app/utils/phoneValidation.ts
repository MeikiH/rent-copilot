// Phone validation utility using Zod
import { z } from 'zod'

// French mobile phone number schema
const mobilePhoneSchema = z.string().refine((phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // French mobile phone patterns
  // Mobile numbers start with 06 or 07 and have 10 digits total
  const frenchMobilePattern = /^(06|07)\d{8}$/
  
  // Check if it matches French mobile pattern
  if (cleaned.length === 10 && frenchMobilePattern.test(cleaned)) {
    return true
  }
  
  // Check international format (+33 6 or +33 7)
  if (cleaned.length === 11 && cleaned.startsWith('33')) {
    const withoutCountryCode = cleaned.substring(2)
    return frenchMobilePattern.test('0' + withoutCountryCode)
  }
  
  return false
}, "Invalid mobile phone number")

export function isMobilePhone(phoneNumber: string): boolean {
  return mobilePhoneSchema.safeParse(phoneNumber).success
}