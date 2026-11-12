import { Component, input } from '@angular/core';
import { SeoLocalContent } from '../../../core/services/seo-local-content.data';

@Component({
  selector: 'app-seo-local-section',
  standalone: true,
  templateUrl: './seo-local-section.component.html',
  styleUrls: ['./seo-local-section.component.scss']
})
export class SeoLocalSectionComponent {
  readonly local = input.required<SeoLocalContent>();
}