import { cn } from "@/lib/cn";

export type BrandChannel = "whatsapp" | "instagram" | "email";

export function BrandChannelIcon({ brand, className }: { brand: BrandChannel; className?: string }) {
  if (brand === "instagram") {
    return (
      <svg data-brand="instagram" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("size-5", className)}>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (brand === "email") {
    return (
      <svg data-brand="email" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("size-5", className)}>
        <rect x="2.75" y="4.5" width="18.5" height="15" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="m4.25 7 7.75 6 7.75-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg data-brand="whatsapp" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-5", className)}>
      <path d="M12 2.25a9.7 9.7 0 0 0-8.37 14.6L2.4 21.6l4.9-1.18A9.75 9.75 0 1 0 12 2.25Zm0 17.7a7.92 7.92 0 0 1-4.04-1.1l-.29-.17-2.9.7.72-2.82-.19-.3A7.94 7.94 0 1 1 12 19.95Zm4.35-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.39-1.32-1.63-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.69 2.58 4.1 3.62.57.24 1.02.39 1.37.5.58.18 1.1.15 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
