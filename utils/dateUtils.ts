export function formatDate(date: Date, format: string): string {
  // Implement date formatting logic here
  // Replace YYYY, MM, DD, etc. with actual date values
  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
    .replace('DD', date.getDate().toString().padStart(2, '0'));
}