import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, handling conditional classes
 * @param inputs - Class values that can be strings, objects, or arrays
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to DD/MM/YYYY format
 * @param dateString - Date string in any format that Date constructor accepts
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Format a CPF string to XXX.XXX.XXX-XX format
 * @param cpf - Raw CPF string (should be 11 digits)
 * @returns Formatted CPF string in XXX.XXX.XXX-XX format
 */
export function formatCPF(cpf: string | null): string {
  if (!cpf) return "";
  // Remove any non-digit characters
  const cleanedCpf = cpf.replace(/\D/g, '');

  // Check if it's exactly 11 digits
  if (cleanedCpf.length !== 11) {
    return cpf; // Return original if not valid length
  }

  // Format as XXX.XXX.XXX-XX
  return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Format a phone number to Brazilian format (XX) XXXXX-XXXX
 * @param phoneNumber - Raw phone number string (can be in international format starting with +)
 * @returns Formatted phone number string in (XX) XXXXX-XXXX format
 */
export function formatPhoneNumber(phoneNumber: string | null): string {
  if (!phoneNumber) return "";

  // Count only digits in the phone number
  const digitCount = (phoneNumber.match(/\d/g) || []).length;

  // Only format if we have at least 11 digits
  if (digitCount < 11) {
    return phoneNumber; // Return original if not enough digits
  }

  // Remove any non-digit characters
  let cleanedPhone = phoneNumber.replace(/\D/g, '');

  // Case: Number has exactly 11 digits - format as (XX) XXXXX-XXXX
  if (cleanedPhone.length === 11) {
    return cleanedPhone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
  }
  // Case: Number has 12 digits and starts with + - ignore the + and format the remaining 11 digits
  else if (cleanedPhone.length === 12 && phoneNumber.startsWith('+')) {
    // Remove the first digit (which represents the + sign)
    cleanedPhone = cleanedPhone.substring(1);
    return cleanedPhone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
  }
  // Case: Number starts with +55 and followed by 11 digits (total 13 digits) - ignore +55 and format the 11 digits
  else if (phoneNumber.startsWith('+55') && cleanedPhone.length === 13) {
    // Remove the '55' country code, leaving 11 digits
    cleanedPhone = cleanedPhone.substring(2);
    return cleanedPhone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
  }
  // Case: Number has exactly 10 digits - format as (XX) XXXX-XXXX (but this won't happen due to the 11-digit minimum check)
  else {
    return phoneNumber; // Return original if doesn't match any of the expected formats
  }
}