import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('nova_theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.isDark.set(initialDark);
      this.applyTheme(initialDark);

      // Efecto reactivo para persistir y alternar la clase dark-theme
      effect(() => {
        const dark = this.isDark();
        this.applyTheme(dark);
        localStorage.setItem('nova_theme', dark ? 'dark' : 'light');
      });
    }
  }

  toggleTheme(): void {
    this.isDark.update(current => !current);
  }

  private applyTheme(dark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (dark) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }
}
