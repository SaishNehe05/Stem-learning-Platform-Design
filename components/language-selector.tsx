"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation, type Language } from "@/lib/i18n"

const Globe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="m12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

export function LanguageSelector() {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation()

  const handleLanguageChange = (language: Language) => {
    setLanguage(language)
  }

  const currentLangData = availableLanguages?.find((lang) => lang.code === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm px-2 md:px-3">
          <Globe className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline text-xs md:text-sm">{currentLangData?.nativeName || "English"}</span>
          <span className="sm:hidden text-sm">{currentLangData?.flag || "🌐"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 md:w-56">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center justify-between ${currentLanguage === language.code ? "bg-muted" : ""}`}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-base md:text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium text-sm md:text-base">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">{language.name}</span>
              </div>
            </div>
            {currentLanguage === language.code && <Check className="w-3 h-3 md:w-4 md:h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
