import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../home/components/header/header.component';
import { SolutionFinderComponent } from '../home/components/solution-finder/solution-finder.component';
import { FooterComponent } from '../home/components/footer/footer.component';
import { SeoService } from '../../core/services/seo.service';
import { SeoLandingPageData } from '../../core/services/seo-pages.data';

@Component({
  selector: 'app-seo-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SolutionFinderComponent,
    FooterComponent
  ],
  templateUrl: './seo-landing.component.html',
  styleUrls: ['./seo-landing.component.scss']
})
export class SeoLandingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  readonly pageData = signal<SeoLandingPageData | null>(null);
  readonly openFaqIndex = signal<number>(0);

  readonly relatedPages = computed<SeoLandingPageData[]>(() => {
    const current = this.pageData();
    if (!current) {
      return [];
    }
    return this.seoService.landingPages.filter(p => p.slug !== current.slug);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('seoSlug') || '';
      const found = this.seoService.getPageBySlug(slug);
      if (!found) {
        this.router.navigate(['/'], { replaceUrl: true });
        return;
      }
      this.pageData.set(found);
      this.openFaqIndex.set(0);
      this.seoService.applyLandingSeo(found);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    });
  }

  toggleFaq(idx: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === idx ? -1 : idx);
  }

  scrollToConfigurator(): void {
    const el = document.getElementById('configurador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openWhatsAppDirect(page: SeoLandingPageData): void {
    const text =
      `Hola NOVA Ventanas & Puertas,\n\n` +
      `Estoy consultando la ficha técnica "${page.h1}" (${page.recommendedSeriesName}) y me gustaría solicitar asesoramiento técnico y presupuesto para mi proyecto.`;
    window.open(`https://wa.me/34613754271?text=${encodeURIComponent(text)}`, '_blank');
  }
}
