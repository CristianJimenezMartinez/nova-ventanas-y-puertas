import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { DetailsComponent } from './components/details/details.component';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { SolutionFinderComponent } from './components/solution-finder/solution-finder.component';
import { BrandPillarsComponent } from './components/brand-pillars/brand-pillars.component';
import { ArchitectureComponent } from './components/architecture/architecture.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ShowroomComponent } from './components/showroom/showroom.component';
import { FinalCtaComponent } from './components/final-cta/final-cta.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    DetailsComponent,
    SolutionsComponent,
    MaterialsComponent,
    SolutionFinderComponent,
    BrandPillarsComponent,
    ArchitectureComponent,
    ProjectsComponent,
    ShowroomComponent,
    FinalCtaComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
