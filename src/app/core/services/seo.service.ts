import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoLandingPageData } from './seo-pages.data';
import { SeoLandingEnriched, getEnrichedLandingPages } from './seo-local-content.data';

const BASE_URL = 'https://novaventanasypuertas.com';
const DEFAULT_TITLE = 'NOVA | Ventanas, Puertas y Cerramientos de Diseño Arquitectónico';
const DEFAULT_DESCRIPTION =
  'NOVA Ventanas & Puertas. Diseñamos espacios, creamos confort. Fabricación e instalación de ventanas de PVC Passivhaus, aluminio RPT de hoja oculta, puertas pivotantes RC3 y cerramientos a cota cero en Murcia y Alicante. Grupo Soto.';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  readonly landingPages: SeoLandingEnriched[] = getEnrichedLandingPages();

  getPageBySlug(slug: string): SeoLandingEnriched | undefined {
    return this.landingPages.find(p => p.slug === slug);
  }

  applyRouteSeo(urlPath: string): void {
    const cleanPath = urlPath.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '');

    if (cleanPath === 'portal' || cleanPath.startsWith('portal/')) {
      this.applyPortalNoIndex();
      return;
    }

    if (!cleanPath) {
      this.applyHomeSeo();
      return;
    }

    const landing = this.getPageBySlug(cleanPath);
    if (landing) {
      this.applyLandingSeo(landing);
    } else {
      this.applyHomeSeo();
    }
  }

  applyPortalNoIndex(): void {
    this.title.setTitle('NOVA Portal Profesional | Gestión Interna Grupo Soto');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' });
    this.meta.updateTag({ name: 'googlebot', content: 'noindex, nofollow, noarchive, nosnippet' });
    this.meta.updateTag({ name: 'bingbot', content: 'noindex, nofollow, noarchive, nosnippet' });
    this.removeCanonicalLink();
    this.removeDynamicJsonLd();
  }

  applyHomeSeo(): void {
    const canonicalUrl = `${BASE_URL}/`;
    this.title.setTitle(DEFAULT_TITLE);
    this.meta.updateTag({ name: 'description', content: DEFAULT_DESCRIPTION });
    this.setIndexFollowMeta();
    this.updateOpenGraph(DEFAULT_TITLE, DEFAULT_DESCRIPTION, canonicalUrl, `${BASE_URL}/assets/images/hero-architecture.jpg`);
    this.setCanonicalLink(canonicalUrl);
    this.removeDynamicJsonLd();
  }

  applyLandingSeo(page: SeoLandingPageData): void {
    const canonicalUrl = `${BASE_URL}/${page.slug}`;
    const imageUrl = `${BASE_URL}/${page.heroImage.replace(/^\/+/, '')}`;
    this.title.setTitle(page.metaTitle);
    this.meta.updateTag({ name: 'description', content: page.metaDescription });
    this.setIndexFollowMeta();
    this.updateOpenGraph(page.metaTitle, page.metaDescription, canonicalUrl, imageUrl);
    this.setCanonicalLink(canonicalUrl);
    this.injectLandingJsonLd(page, canonicalUrl, imageUrl);
  }

  private setIndexFollowMeta(): void {
    const content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    this.meta.updateTag({ name: 'robots', content });
    this.meta.updateTag({ name: 'googlebot', content });
    this.meta.updateTag({ name: 'bingbot', content });
  }

  private updateOpenGraph(title: string, description: string, url: string, image: string): void {
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  private setCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private removeCanonicalLink(): void {
    const link = this.doc.querySelector('link[rel="canonical"]');
    if (link) {
      link.remove();
    }
  }

  private injectLandingJsonLd(page: SeoLandingPageData, canonicalUrl: string, imageUrl: string): void {
    this.removeDynamicJsonLd();
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'nova-dynamic-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'NOVA Ventanas y Puertas', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: page.h1, item: canonicalUrl }
          ]
        },
        {
          '@type': 'Service',
          name: page.h1,
          description: page.metaDescription,
          url: canonicalUrl,
          image: imageUrl,
          brand: { '@type': 'Brand', name: 'NOVA Ventanas & Puertas' },
          provider: {
            '@type': 'HomeAndConstructionBusiness',
            name: 'NOVA Ventanas y Puertas — Grupo Soto',
            telephone: '+34613754271',
            url: `${BASE_URL}/`
          },
          areaServed: ['Murcia', 'Molina de Segura', 'Alicante', 'Costa Blanca', 'España']
        },
        {
          '@type': 'FAQPage',
          mainEntity: page.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer }
          }))
        }
      ]
    });
    this.doc.head.appendChild(script);
  }

  private removeDynamicJsonLd(): void {
    const existing = this.doc.getElementById('nova-dynamic-jsonld');
    if (existing) {
      existing.remove();
    }
  }
}
