export interface ThemePalette {
  background: string
  foreground: string
  primary: string
  muted: string
  isDark: boolean
}

export class ThemeReader {
  private sentinel: HTMLElement
  private cache: ThemePalette | null = null
  private observer: MutationObserver

  constructor() {
    this.sentinel = document.createElement("div")
    this.sentinel.style.display = "none"
    document.body.appendChild(this.sentinel)

    this.observer = new MutationObserver(() => {
      this.cache = null
    })
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
  }

  get palette(): ThemePalette {
    if (!this.cache) this.cache = this.buildPalette()
    return this.cache
  }

  private resolve(varName: string): string {
    this.sentinel.style.color = `var(${varName})`
    return getComputedStyle(this.sentinel).color
  }

  private buildPalette(): ThemePalette {
    return {
      background: this.resolve("--background"),
      foreground: this.resolve("--foreground"),
      primary: this.resolve("--primary"),
      muted: this.resolve("--muted-foreground"),
      isDark: document.documentElement.classList.contains("dark"),
    }
  }

  destroy() {
    this.observer.disconnect()
    this.sentinel.remove()
  }
}
