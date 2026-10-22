import { Component, ElementRef, HostListener, Output, EventEmitter, ViewChild, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmLeadItem } from '../../models/portal.models';
import { PortalStoreService } from '../../services/portal-store.service';

@Component({
  selector: 'app-client-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cs-root" #triggerWrap>
      <div class="cs-input-wrap" (click)="openDropdown()">
        <span class="cs-icon" aria-hidden="true">🔍</span>
        <input
          #searchInput
          type="text"
          class="cs-input"
          [placeholder]="placeholder()"
          [ngModel]="query()"
          (ngModelChange)="onQueryChange($event)"
          (focus)="openDropdown()"
          aria-label="Buscar cliente por nombre, NIF, teléfono o dirección" />
        @if (query()) {
          <button type="button" class="cs-clear" (click)="clearSearch($event)" title="Limpiar búsqueda">✕</button>
        }
        <span class="cs-count tabular-nums">{{ store.leads().length }} clientes</span>
      </div>

      @if (isOpen()) {
        <div class="cs-backdrop" (click)="closeDropdown()"></div>
        <div
          class="cs-floating-panel tabular-nums"
          [style.top.px]="panelTop()"
          [style.left.px]="panelLeft()"
          [style.width.px]="panelWidth()">
          <div class="cs-panel-head">
            <span>Resultados ({{ filteredClients().length }})</span>
            <button type="button" class="cs-close-btn" (click)="closeDropdown()">Cerrar ✕</button>
          </div>

          <div class="cs-results-list">
            @if (filteredClients().length === 0) {
              <div class="cs-empty">
                No se encontraron clientes con «{{ query() }}». Puedes escribir los datos manualmente abajo y pulsar «+ Guardar en mis clientes».
              </div>
            }
            @for (c of filteredClients(); track c.id) {
              <button type="button" class="cs-result-item" (click)="chooseClient(c)">
                <div class="cs-item-main">
                  <strong>{{ c.fullName }}</strong>
                  @if (c.nif) {
                    <span class="cs-nif">{{ c.nif }}</span>
                  }
                </div>
                <div class="cs-item-sub">
                  <span>{{ c.phone || 'Sin teléfono' }}</span>
                  <span>·</span>
                  <span>{{ c.email || 'Sin correo' }}</span>
                  <span>·</span>
                  <span>{{ c.city }}</span>
                </div>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cs-root {
      position: relative;
      width: 100%;
      min-width: 280px;
    }
    .cs-input-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 40px;
      padding: 0 0.75rem;
      background: var(--p-input-bg, #FFFFFF);
      border: 1px solid var(--p-accent, #8C6D3B);
      cursor: text;
    }
    .cs-icon {
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .cs-input {
      flex: 1;
      min-width: 0;
      border: none !important;
      outline: none !important;
      background: transparent !important;
      color: var(--p-text, #141413) !important;
      font-size: 0.875rem !important;
      padding: 0 !important;
    }
    .cs-clear {
      background: none;
      border: none;
      color: var(--p-text-sec, #4A4843);
      cursor: pointer;
      padding: 0 0.25rem;
      font-size: 0.8rem;
    }
    .cs-count {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      background: var(--p-card, #F9F8F6);
      border: 1px solid var(--p-border, #D6D3CD);
      color: var(--p-text-sec, #4A4843);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .cs-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99998;
      background: transparent;
    }
    .cs-floating-panel {
      position: fixed;
      z-index: 99999;
      background: var(--p-surface, #FFFFFF);
      border: 2px solid #141413;
      box-shadow: 0 22px 48px rgba(0, 0, 0, 0.32);
      display: flex;
      flex-direction: column;
      max-height: 340px;
      overflow: hidden;
    }
    .cs-panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.85rem;
      background: #141413;
      color: #FFFFFF;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .cs-close-btn {
      background: none;
      border: 1px solid #444;
      color: #FFFFFF;
      font-size: 0.75rem;
      padding: 0.15rem 0.45rem;
      cursor: pointer;
    }
    .cs-results-list {
      overflow-y: auto;
      max-height: 290px;
      display: flex;
      flex-direction: column;
    }
    .cs-empty {
      padding: 1rem 0.9rem;
      font-size: 0.84rem;
      color: var(--p-text-sec, #4A4843);
    }
    .cs-result-item {
      width: 100%;
      text-align: left;
      background: var(--p-surface, #FFFFFF);
      border: none;
      border-bottom: 1px solid var(--p-border, #D6D3CD);
      padding: 0.65rem 0.9rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .cs-result-item:hover {
      background: rgba(198, 173, 130, 0.18);
    }
    .cs-item-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .cs-item-main strong {
      font-size: 0.88rem;
      color: var(--p-text, #141413);
    }
    .cs-nif {
      font-size: 0.76rem;
      font-weight: 600;
      padding: 0.1rem 0.4rem;
      background: var(--p-card, #F9F8F6);
      border: 1px solid var(--p-border, #D6D3CD);
      color: var(--p-accent, #8C6D3B);
    }
    .cs-item-sub {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      font-size: 0.78rem;
      color: var(--p-text-sec, #4A4843);
    }
  `]
})
export class ClientSearchComponent {
  readonly store = inject(PortalStoreService);
  readonly placeholder = input<string>('Buscar cliente por nombre, NIF, teléfono o dirección...');
  @Output() readonly clientSelected = new EventEmitter<CrmLeadItem>();

  @ViewChild('triggerWrap') triggerWrap?: ElementRef<HTMLElement>;

  readonly query = signal<string>('');
  readonly isOpen = signal<boolean>(false);
  readonly panelTop = signal<number>(120);
  readonly panelLeft = signal<number>(120);
  readonly panelWidth = signal<number>(420);

  readonly filteredClients = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.store.leads();
    if (!q) return all;
    return all.filter(
      c =>
        c.fullName.toLowerCase().includes(q) ||
        (c.nif && c.nif.toLowerCase().includes(q)) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  });

  openDropdown(): void {
    this.updateFloatingPosition();
    this.isOpen.set(true);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  onQueryChange(val: string): void {
    this.query.set(val);
    if (!this.isOpen()) {
      this.openDropdown();
    } else {
      this.updateFloatingPosition();
    }
  }

  clearSearch(event: Event): void {
    event.stopPropagation();
    this.query.set('');
  }

  chooseClient(client: CrmLeadItem): void {
    this.query.set(`${client.fullName}${client.nif ? ' (' + client.nif + ')' : ''}`);
    this.isOpen.set(false);
    this.clientSelected.emit(client);
  }

  @HostListener('window:resize')
  @HostListener('window:scroll', ['$event'])
  updateFloatingPosition(): void {
    const el = this.triggerWrap?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const desiredW = Math.min(Math.max(rect.width, 380), viewportW - 24);
    const left = Math.min(Math.max(12, rect.left), viewportW - desiredW - 12);
    const spaceBelow = viewportH - rect.bottom;
    const top = spaceBelow < 240 && rect.top > 280 ? Math.max(12, rect.top - 280) : rect.bottom + 4;

    this.panelTop.set(top);
    this.panelLeft.set(left);
    this.panelWidth.set(desiredW);
  }
}
