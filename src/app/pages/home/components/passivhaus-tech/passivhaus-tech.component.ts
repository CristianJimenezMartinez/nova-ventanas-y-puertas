import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passivhaus-tech',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passivhaus-tech.component.html',
  styleUrls: ['./passivhaus-tech.component.scss']
})
export class PassivhausTechComponent {
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
