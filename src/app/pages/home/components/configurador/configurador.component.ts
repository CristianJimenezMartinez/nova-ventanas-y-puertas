import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCategory, QuoteRequest } from '../../../../core/models/product.model';

@Component({
  selector: 'app-configurador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurador.component.html',
  styleUrls: ['./configurador.component.scss']
})
export class ConfiguradorComponent {
  private readonly productService = inject(ProductService);

  readonly currentStep = signal<number>(1);
  readonly isSubmitted = signal<boolean>(false);

  // Estado del formulario reactivo
  quoteData: QuoteRequest = {
    propertyType: 'piso',
    serviceType: 'pvc',
    material: 'pvc',
    approximateUnits: '3-5 ventanas',
    includeInstallation: true,
    needsNextGenHelp: true,
    clientName: '',
    clientPhone: '',
    clientCity: 'Murcia',
    notes: ''
  };

  setServiceType(type: ProductCategory): void {
    this.quoteData.serviceType = type;
  }

  setMaterial(mat: 'pvc' | 'aluminio' | 'mixto' | 'madera' | 'indiferente'): void {
    this.quoteData.material = mat;
  }

  setOpeningType(opening: 'corredera' | 'abatible' | 'oscilobatiente' | 'puerta' | 'indiferente'): void {
    this.quoteData.openingType = opening;
  }

  setPropertyType(type: 'piso' | 'chalet' | 'comercial'): void {
    this.quoteData.propertyType = type;
  }

  setUnits(units: string): void {
    this.quoteData.approximateUnits = units;
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  sendToWhatsApp(): void {
    const url = this.productService.generateWhatsAppUrl(this.quoteData);
    window.open(url, '_blank');
    this.isSubmitted.set(true);
  }
}
