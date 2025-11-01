"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    let commandBuffer = ""
    let commandTimeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Global search shortcut: /
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>("[data-search-input]")
        searchInput?.focus()
        return
      }

      // Command mode: g + key
      if (e.key === "g" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        commandBuffer = "g"
        clearTimeout(commandTimeout)
        commandTimeout = setTimeout(() => {
          commandBuffer = ""
        }, 1000)
        return
      }

      if (commandBuffer === "g") {
        switch (e.key) {
          case "o":
            router.push("/")
            break
          case "m":
            router.push("/monitoring")
            break
          case "k":
            router.push("/kyc")
            break
          case "i":
            router.push("/investigations")
            break
          case "p":
            router.push("/policies")
            break
          case "a":
            router.push("/audit")
            break
        }
        commandBuffer = ""
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      clearTimeout(commandTimeout)
    }
  }, [router])
}
