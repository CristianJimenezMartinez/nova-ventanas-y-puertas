import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { NextGenBannerComponent } from './components/nextgen-banner/nextgen-banner.component';
import { ProductShowcaseComponent } from './components/product-showcase/product-showcase.component';
import { ConfiguradorComponent } from './components/configurador/configurador.component';
import { PassivhausTechComponent } from './components/passivhaus-tech/passivhaus-tech.component';
import { ShowroomGalleryComponent } from './components/showroom-gallery/showroom-gallery.component';
import { TestimonialsFaqComponent } from './components/testimonials-faq/testimonials-faq.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    NextGenBannerComponent,
    ProductShowcaseComponent,
    ConfiguradorComponent,
    PassivhausTechComponent,
    ShowroomGalleryComponent,
    TestimonialsFaqComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
