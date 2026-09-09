import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCategory, ProductItem } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-showcase.component.html',
  styleUrls: ['./product-showcase.component.scss']
})
export class ProductShowcaseComponent {
  readonly productService = inject(ProductService);

  readonly categories: { key: ProductCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: 'Todas las Soluciones', icon: '✦' },
    { key: 'pvc', label: 'PVC Alta Eficiencia', icon: '🪟' },
    { key: 'aluminio', label: 'Aluminio RPT', icon: '📐' },
    { key: 'mixto', label: 'Mixto Alu-Madera', icon: '🌲' },
    { key: 'madera', label: 'Madera Noble', icon: '🪵' },
    { key: 'puertas', label: 'Puertas de Entrada', icon: '🚪' },
    { key: 'cortinas', label: 'Cortinas de Cristal', icon: '💎' },
    { key: 'techos', label: 'Techos Móviles', icon: '☀️' },
    { key: 'persianas', label: 'Persianas & Motores', icon: '⚙️' }
  ];

  selectCategory(category: ProductCategory | 'all'): void {
    this.productService.filterCategory(category);
  }

  quoteProduct(product: ProductItem): void {
    const configuradorElement = document.getElementById('configurador');
    if (configuradorElement) {
      configuradorElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openWhatsAppProduct(product: ProductItem): void {
    const text = `Hola Grupo Soto / Nova Ventanas, me interesa el modelo *${product.name}* (${product.series}). ¿Podrían darme más información y precio aproximado?`;
    window.open(`https://wa.me/34613754271?text=${encodeURIComponent(text)}`, '_blank');
  }
}
