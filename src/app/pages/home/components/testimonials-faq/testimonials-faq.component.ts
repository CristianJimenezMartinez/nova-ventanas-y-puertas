import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-testimonials-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-faq.component.html',
  styleUrls: ['./testimonials-faq.component.scss']
})
export class TestimonialsFaqComponent {
  readonly faqs = signal<FaqItem[]>([
    {
      question: '¿Es necesario hacer obra invasiva o romper paredes para cambiar las ventanas?',
      answer: 'No. En el 95% de los casos empleamos sistemas de solape y perfiles de renovación rápida. Retiramos las hojas y marcos antiguos con sumo cuidado y fijamos la nueva carpintería con anclajes mecánicos y espuma de poliuretano de alta densidad, rematando con tapajuntas sellados. El proceso se completa en el mismo día sin escombros ni polvo molesto.',
      isOpen: true
    },
    {
      question: '¿Qué diferencia real existe entre el PVC y el Aluminio con Rotura de Puente Térmico (RPT)?',
      answer: 'El PVC es un material no conductor por naturaleza, lo que le otorga valores térmicos excepcionales (Uw desde 0.72 W/m²K) a un coste muy competitivo. El Aluminio con RPT permite perfiles extremadamente esbeltos (hoja oculta de solo 50 mm) y grandes dimensiones panorámicas, ideal para estética minimalista moderna. En Nova trabajamos ambos con la máxima calidad europea.',
      isOpen: false
    },
    {
      question: '¿Cómo me gestiona Grupo Soto las ayudas europeas Next Generation?',
      answer: 'Contamos con un departamento técnico dedicado. Realizamos el certificado de eficiencia energética previo y posterior de la vivienda, preparamos la memoria técnica y presentamos el expediente ante la administración. Conseguimos subvenciones de hasta el 40-60% del importe total y te facilitamos la documentación para la deducción en tu IRPF.',
      isOpen: false
    },
    {
      question: '¿Cuánto tiempo tardan en fabricar mis ventanas a medida?',
      answer: 'Al fabricar de forma personalizada en nuestras instalaciones, el plazo habitual desde la toma definitiva de medidas hasta la instalación en tu domicilio oscila entre 3 y 4 semanas para colores estándar (blanco y gris antracita), y entre 4 y 5 semanas para foliados especiales y bicolores.',
      isOpen: false
    },
    {
      question: '¿Qué garantía incluye mi instalación?',
      answer: 'Ofrecemos 10 años de garantía oficial por escrito en perfiles de PVC y aluminio contra deformación y decoloración por rayos UV, 5 años en vidrios con cámara aislante frente a condensación interna y 2 años de garantía total en mano de obra y herrajes perimetrales.',
      isOpen: false
    }
  ]);

  toggleFaq(index: number): void {
    this.faqs.update(items =>
      items.map((item, i) => (i === index ? { ...item, isOpen: !item.isOpen } : item))
    );
  }
}
