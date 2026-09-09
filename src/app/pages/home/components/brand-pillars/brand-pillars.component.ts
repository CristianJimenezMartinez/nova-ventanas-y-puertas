import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovaService } from '../../../../core/services/nova.service';
import { BrandValue } from '../../../../core/models/nova.model';

@Component({
  selector: 'app-brand-pillars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-pillars.component.html',
  styleUrls: ['./brand-pillars.component.scss']
})
export class BrandPillarsComponent {
  readonly novaService = inject(NovaService);
  readonly values: BrandValue[] = this.novaService.values;
}
