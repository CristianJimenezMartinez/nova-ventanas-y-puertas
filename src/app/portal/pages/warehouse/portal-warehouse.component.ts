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

  readonly filteredOrders = computed<WarehouseOrder[]>(() => {
    const c = this.selectedCircuit();
    if (c === 'TODOS') return this.store.warehouseOrders();
    return this.store.warehouseOrders().filter(o => o.circuitType === c);
  });

  setCircuit(c: 'TODOS' | WarehouseCircuitType): void {
    this.selectedCircuit.set(c);
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

  notifyClientWarehouseReady(order: WarehouseOrder): void {
    this.store.security.pendingEmailDraft.set({
      recipientName: order.clientName,
      recipientEmail: 'cliente@obra.es',
      linkedDocCode: order.orderCode,
      subject: `Aviso de material en almacén · Pedido ${order.orderCode} (${order.assignedCaballete})`,
      messageBody: `Estimado/a ${order.clientName},\n\nSu pedido ${order.orderCode} (${order.unitsCount} unidades) se encuentra en ${order.assignedCaballete}, listo para recogida o coordinación de montaje.`
    });
    this.router.navigate(['/portal/correos']);
  }
}
