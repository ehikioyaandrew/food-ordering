import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    let isDark = false;
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      isDark = prefersDark;
    }

    this.setTheme(isDark);
  }

  toggleDarkMode(): void {
    const newTheme = !this.isDarkModeSubject.value;
    this.setTheme(newTheme);
  }

  setTheme(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);

    // Update document class for Tailwind dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update Ionic color scheme
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }

  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
