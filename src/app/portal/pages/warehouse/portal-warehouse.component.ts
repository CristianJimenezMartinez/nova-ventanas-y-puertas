import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PortalStoreService } from '../../services/portal-store.service';
import { PortalPdfGeneratorService } from '../../services/portal-pdf-generator.service';
import {
  WarehouseCircuitType,
  WarehouseOperationalStatus,
  WarehouseOrder
} from '../../models/portal.models';

@Component({
  selector: 'app-portal-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-warehouse.component.html',
  styleUrls: ['./portal-warehouse.component.scss']
})
export class PortalWarehouseComponent {
  readonly store = inject(PortalStoreService);
  private readonly pdfGenerator = inject(PortalPdfGeneratorService);
  private readonly router = inject(Router);

  readonly selectedCircuit = signal<'TODOS' | WarehouseCircuitType>('TODOS');
  readonly diasPagoDirectInvoice = signal<number>(0);
  readonly lastGeneratedInvoiceMsg = signal<string>('');
  readonly showNewOrderModal = signal<boolean>(false);

  // Campos limpios para dar de alta un pedido manual en almacén
  readonly newClientName = signal<string>('');
  readonly newClientNif = signal<string>('');
  readonly newWorkAddress = signal<string>('');
  readonly newCircuitType = signal<WarehouseCircuitType>('FABRICA_TERMINADA');
  readonly newCaballete = signal<string>('CABALLETE A-01');
  readonly newUnitsCount = signal<number>(1);
  readonly newTotalAmountEur = signal<number>(0);

  readonly filteredOrders = computed<WarehouseOrder[]>(() => {
    const c = this.selectedCircuit();
    if (c === 'TODOS') return this.store.warehouseOrders();
    return this.store.warehouseOrders().filter(o => o.circuitType === c);
  });

  setCircuit(c: 'TODOS' | WarehouseCircuitType): void {
    this.selectedCircuit.set(c);
  }

  selectSavedClientForOrder(clientId: string): void {
    const c = this.store.leads().find(l => l.id === clientId);
    if (!c) return;
    this.newClientName.set(c.fullName);
    this.newClientNif.set(c.nif || '');
    this.newWorkAddress.set(c.city);
  }

  createManualOrder(): void {
    const name = this.newClientName().trim();
    if (!name) return;
    const seq = 1 + this.store.warehouseOrders().length;
    const ord: WarehouseOrder = {
      id: `ord-${Date.now()}`,
      orderCode: `PED-2026-${String(seq).padStart(3, '0')}`,
      quoteCode: 'DIRECTO',
      clientName: name,
      clientNif: this.newClientNif().trim(),
      workAddress: this.newWorkAddress().trim() || 'Recogida / Obra',
      circuitType: this.newCircuitType(),
      assignedCaballete: this.newCaballete().trim() || `CABALLETE A-${String(seq).padStart(2, '0')}`,
      unitsCount: Math.max(1, this.newUnitsCount()),
      totalAmountEur: Math.max(0, this.newTotalAmountEur()),
      carpentryReceived: false,
      glassReceived: false,
      shutterMotorReceived: false,
      accessoriesReceived: false,
      operationalStatus: 'EN_FABRICACION',
      financialStatus: 'PENDIENTE_FACTURAR',
      deliveryNoteCode: `ALB-2026-${String(seq).padStart(3, '0')}`,
      updatedAtIso: new Date().toISOString()
    };
    this.store.addManualWarehouseOrder(ord);
    this.newClientName.set('');
    this.newClientNif.set('');
    this.newWorkAddress.set('');
    this.newTotalAmountEur.set(0);
    this.showNewOrderModal.set(false);
    this.lastGeneratedInvoiceMsg.set(`✓ Pedido ${ord.orderCode} (${ord.clientName}) registrado en almacén.`);
  }

  deleteOrder(id: string): void {
    this.store.removeWarehouseOrder(id);
  }

  togglePart(
    orderId: string,
    part: 'carpentryReceived' | 'glassReceived' | 'shutterMotorReceived' | 'accessoriesReceived'
  ): void {
    this.store.toggleWarehouseComponentReception(orderId, part);
  }

  changeStatus(orderId: string, status: WarehouseOperationalStatus): void {
    this.store.updateWarehouseStatus(orderId, status);
  }

  /**
   * REGLA CRÍTICA 5: Jamás ocultar ni bloquear el botón de Emitir Factura desde Almacén.
   * Permite facturar tanto suministros sin montaje (recogida en almacén) como pedidos en curso.
   */
  emitInvoiceFromWarehouse(order: WarehouseOrder): void {
    const safeDias = this.diasPagoDirectInvoice() ?? 0;
    const inv = this.store.issueInvoiceDirectlyFromWarehouse(order, safeDias);
    this.lastGeneratedInvoiceMsg.set(
      `✓ Factura Oficial VeriFactu ${inv.seriesAndNumber} generada desde Almacén (${order.assignedCaballete}) · Huella SHA-256: ${inv.currentHash64.slice(0, 16)}...`
    );
  }

  downloadDeliveryNotePdf(order: WarehouseOrder): void {
    this.pdfGenerator.generateWarehouseDeliveryNotePdf(order);
  }
}
