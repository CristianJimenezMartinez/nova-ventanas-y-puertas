import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type LegalDocType = 'aviso' | 'privacidad' | 'cookies' | null;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly activeLegalModal = signal<LegalDocType>(null);

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openLegal(type: LegalDocType): void {
    this.activeLegalModal.set(type);
  }

  closeLegal(): void {
    this.activeLegalModal.set(null);
  }
}
