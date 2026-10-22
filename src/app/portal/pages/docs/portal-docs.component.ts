import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface DocGuideSection {
  id: string;
  category: string;
  title: string;
  summary: string;
  routeLink: string;
  routeLabel: string;
  steps: {
    stepNumber: number;
    heading: string;
    detail: string;
  }[];
  tips: string[];
}

@Component({
  selector: 'app-portal-docs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './portal-docs.component.html',
  styleUrls: ['./portal-docs.component.scss']
})
export class PortalDocsComponent {
  readonly searchQuery = signal<string>('');
  readonly activeSectionId = signal<string>('TODOS');

  readonly sections: DocGuideSection[] = [
    {
      id: 'flujo-general',
      category: '1. Visión General',
      title: 'Cómo funciona el flujo completo (De la solicitud a la factura)',
      summary:
        'Orden recomendado de trabajo desde que un cliente pide precio hasta que se entrega el material y se cobra la factura.',
      routeLink: '/portal/dashboard',
      routeLabel: 'Ir a Inicio',
      steps: [
        {
          stepNumber: 1,
          heading: 'Entrada del cliente o solicitud web',
          detail:
            'En la pantalla de Inicio ves las solicitudes que entran desde el recomendador de la web pública (con teléfono, correo y sistema recomendado) junto al resumen de pedidos en almacén.'
        },
        {
          stepNumber: 2,
          heading: 'Creación del presupuesto por medidas',
          detail:
            'En Presupuestos introduces cada ventana o puerta (ancho, alto, serie, vidrio y persiana). El sistema calcula el precio automáticamente y dibuja el croquis visto desde el interior.'
        },
        {
          stepNumber: 3,
          heading: 'Pedido a fábrica y recepción en almacén',
          detail:
            'Al pulsar "Enviar a Almacén", el presupuesto pasa a Almacén asignado a un caballete. Desde ahí puedes imprimir la Orden de Taller (sin precios de venta) y marcar qué piezas han llegado.'
        },
        {
          stepNumber: 4,
          heading: 'Albarán de entrega y emisión de factura',
          detail:
            'Cuando el pedido se entrega o se instala (o directamente desde Almacén si es venta de solo suministro sin montaje), pulsas "Pasar a Factura" y queda emitida en Facturas lista para cobrar y descargar en PDF.'
        }
      ],
      tips: [
        'Puedes cambiar entre Modo Claro y Modo Oscuro en cualquier momento desde el botón superior derecho.',
        'Pulsando Ctrl + K en el teclado abres el buscador rápido para saltar a cualquier sección.'
      ]
    },
    {
      id: 'catalogo-precios',
      category: '2. Catálogo y Tarifas',
      title: 'Cómo añadir series, pegar tarifas desde Excel y actualizar precios',
      summary:
        'Gestión de las tablas de precios por medidas (Ancho × Alto), suplementos de color y precios de vidrio por metro cuadrado.',
      routeLink: '/portal/catalogo',
      routeLabel: 'Ir a Catálogo y Tarifas',
      steps: [
        {
          stepNumber: 1,
          heading: 'Añadir una serie nueva al catálogo',
          detail:
            'Pulsa el botón "+ Añadir serie" arriba a la derecha. Indica el código, el nombre comercial, el material (PVC, Aluminio, Mixto o Puertas) y si la tabla del proveedor incluye vidrio base o es solo carpintería.'
        },
        {
          stepNumber: 2,
          heading: 'Pegar una tabla de precios desde Excel',
          detail:
            'Selecciona la serie, copia el bloque de precios directamente en tu archivo de Excel y pégalo en el recuadro "Pegar tabla desde Excel". Al pulsar "Importar tabla", la cuadrícula de precios se actualiza al instante.'
        },
        {
          stepNumber: 3,
          heading: 'Fijar tu Ganancia por Porcentaje (%) o Sumar/Restar en Euros (€)',
          detail:
            'En Catálogo puedes fijar tu "Ganancia (%)" comercial por defecto sobre el coste base y también modificar toda una tabla por porcentaje (%) o sumando/restando un importe fijo en euros (€).'
        },
        {
          stepNumber: 4,
          heading: 'Alternar entre tarifa con o sin vidrio base',
          detail:
            'En la cabecera de cada serie puedes pulsar el botón "Solo carpintería / Incluye vidrio base" para que el presupuestador sume el vidrio completo o descuente el abono del vidrio base.'
        }
      ],
      tips: [
        'Cuando metes una medida intermedia en un presupuesto (por ejemplo, 1120 × 1340 mm), el sistema busca automáticamente el escalón inmediatamente superior en la tabla (1200 × 1400 mm).'
      ]
    },
    {
      id: 'presupuestos-croquis',
      category: '3. Presupuestos',
      title: 'Cómo seleccionar clientes, ajustar ganancia (% o €) y generar PDF / Orden de Taller',
      summary:
        'Selector de clientes guardados, configuración ventana por ventana con margen en % y €, cálculo de IVA y paso directo a Almacén.',
      routeLink: '/portal/presupuestos',
      routeLabel: 'Ir a Presupuestos',
      steps: [
        {
          stepNumber: 1,
          heading: 'Seleccionar un cliente guardado o guardar uno nuevo',
          detail:
            'Arriba en "Datos del cliente y obra" puedes desplegar "-- Seleccionar cliente guardado --" para autorrellenar Nombre, NIF/CIF, Teléfono, Correo y Dirección en un clic, o escribir uno nuevo y pulsar "+ Guardar en mis clientes".'
        },
        {
          stepNumber: 2,
          heading: 'Configurar medidas y ajustar ganancia en % o en €',
          detail:
            'Introduce estancia, serie, ancho, alto, vidrio y persiana. Puedes ajustar tu "Ganancia (%)", "Sumar / Restar (€)" o escribir directamente el "Precio final / ud (€)". También puedes editar el precio o unidades en las filas ya añadidas y aplicar un ajuste al total en % o €.'
        },
        {
          stepNumber: 3,
          heading: 'Añadir posiciones y configurar el tipo de IVA',
          detail:
            'Pulsa "+ Añadir al presupuesto" para sumar cada ventana al listado inferior. Abajo puedes elegir "Reforma con instalación", "Obra nueva" o "Solo suministro (21%)" e indicar el importe de montaje.'
        },
        {
          stepNumber: 4,
          heading: 'Descargar PDFs o enviar a Almacén',
          detail:
            'Usa "↓ Presupuesto PDF" para entregar al cliente (incluye dibujos y precios), "↓ Orden Taller PDF" para entregar a fábrica/montadores (oculta todos los precios de venta) o "Enviar a Almacén" cuando el presupuesto sea aceptado.'
        }
      ],
      tips: [
        'Todos los vidrios aplican automáticamente el mínimo de facturación de fábrica de 0,50 m² por hoja.'
      ]
    },
    {
      id: 'almacen-pedidos',
      category: '4. Almacén y Pedidos',
      title: 'Cómo controlar la llegada de material y facturar desde almacén',
      summary:
        'Control de recepción de carpintería, vidrios, persianas y herrajes por caballete, albaranes y paso directo a factura.',
      routeLink: '/portal/almacen',
      routeLabel: 'Ir a Almacén',
      steps: [
        {
          stepNumber: 1,
          heading: 'Filtrar pedidos por tipo de circuito',
          detail:
            'En la parte superior puedes filtrar entre Todos, Fábrica terminada, Solo suministro (clientes o profesionales que recogen en nave sin montaje), Multiproveedor o Taller.'
        },
        {
          stepNumber: 2,
          heading: 'Marcar las piezas recibidas en nave',
          detail:
            'Cada pedido tiene 4 botones: Carpintería, Vidrios, Persiana / Motor y Herrajes. Haz clic sobre cada uno conforme llegue el material. Cuando los 4 están marcados (✓), el estado pasa automáticamente a "Completo en almacén" o "Listo para entregar".'
        },
        {
          stepNumber: 3,
          heading: 'Descargar el Albarán de entrega',
          detail:
            'Pulsa "↓ Albarán PDF" para generar el documento con el código de caballete, el estado de las partidas y el recuadro para la firma del cliente o jefe de equipo instalador.'
        },
        {
          stepNumber: 4,
          heading: 'Emitir factura directamente desde Almacén',
          detail:
            'Arriba a la derecha puedes indicar los días de pago (0 = al contado). En cualquier pedido puedes pulsar "Pasar a Factura" para generar la factura al instante sin tener que esperar a que haya montaje en obra.'
        }
      ],
      tips: [
        'El estado de almacén/obra y el estado de facturación son independientes: nunca se bloquea la opción de facturar un pedido.'
      ]
    },
    {
      id: 'facturacion-cobros',
      category: '5. Facturas y Cobros',
      title: 'Cómo emitir facturas, registrar cobros y exportar para la gestoría',
      summary:
        'Emisión de facturas ordinarias, anticipos, certificaciones y rectificativas con código QR, XML y exportación CSV.',
      routeLink: '/portal/facturacion',
      routeLabel: 'Ir a Facturas',
      steps: [
        {
          stepNumber: 1,
          heading: 'Emitir una nueva factura manual',
          detail:
            'Pulsa "+ Nueva factura", elige el tipo (Ordinaria, Anticipo, Certificación o Rectificativa), indica los días de pago (por defecto 0 días), los datos del cliente, la base imponible y el tipo de IVA (10%, 21% o 0% Inversión del sujeto pasivo).'
        },
        {
          stepNumber: 2,
          heading: 'Registrar el cobro de una factura',
          detail:
            'En la columna de acciones de cualquier factura pendiente, pulsa el botón verde "✓ Cobrar". El estado cambiará inmediatamente a "Cobrada" en verde y se sumará al total cobrado en Inicio.'
        },
        {
          stepNumber: 3,
          heading: 'Descargar Factura PDF con QR o archivo XML',
          detail:
            'Pulsa "↓ PDF" para obtener la factura lista para enviar al cliente (con su código QR y huella encadenada) o "↓ XML" si necesitas el fichero estructurado.'
        },
        {
          stepNumber: 4,
          heading: 'Exportar el listado para la gestoría o cargar certificado',
          detail:
            'Pulsa "↓ Exportar Gestoría (.CSV)" para descargar el libro completo de facturas compatible con Excel. Cuando tengas el certificado digital (.p12 / .pfx), puedes dejarlo configurado en el botón "Certificado digital".'
        }
      ],
      tips: [
        'Las fechas de vencimiento se calculan siempre hasta el final del día (23:59) para que una factura al contado (0 días) nunca aparezca como vencida el mismo día que se emite.'
      ]
    },
    {
      id: 'correos-smtp',
      category: '6. Correos',
      title: 'Cómo gestionar las cuentas de correo corporativas de tu sede',
      summary:
        'Directorio de buzones corporativos exclusivos de la empresa activa con aislamiento total entre sedes.',
      routeLink: '/portal/correos',
      routeLabel: 'Ir a Correos',
      steps: [
        {
          stepNumber: 1,
          heading: 'Añadir una cuenta de correo de tu empresa',
          detail:
            'Pulsa "+ Añadir cuenta" arriba a la derecha. Introduce el nombre o alias, la dirección de correo de tu sede, el departamento y el servidor de correo.'
        },
        {
          stepNumber: 2,
          heading: 'Privacidad estricta por sede',
          detail:
            'Cada empresa o franquicia ve únicamente sus propias cuentas de correo corporativas y nunca los buzones de Central ni de otras delegaciones.'
        }
      ],
      tips: [
        'Puedes eliminar o añadir cuentas de correo de tu propia sede en cualquier momento.'
      ]
    },
    {
      id: 'empresas-seguridad',
      category: '7. Empresas, Usuarios y Seguridad',
      title: 'Cómo gestionar los usuarios de tu empresa o dar de alta nuevas franquicias',
      summary:
        'Autogestión de empleados para cada empresa (Gerencia) y control global de sedes para Central (Superadmin).',
      routeLink: '/portal/empresas',
      routeLabel: 'Ir a Usuarios / Empresas',
      steps: [
        {
          stepNumber: 1,
          heading: 'Cómo añade una empresa a sus propios trabajadores (Gerencia)',
          detail:
            'El responsable de cada empresa entra en "Usuarios de mi empresa" en el menú lateral y pulsa "+ Añadir usuario". Solo tiene que indicar Nombre, Correo, Contraseña y Puesto (Comercial y Presupuestos, Almacén y Obra, Administración y Facturas o Gerente de Sede).'
        },
        {
          stepNumber: 2,
          heading: 'Activar, suspender o eliminar empleados al instante',
          detail:
            'En la tabla de usuarios de su empresa, el gerente puede pausar el acceso de un trabajador ("Suspender" / "Activar") o eliminarlo ("✕") sin ver nunca a otras empresas del grupo.'
        },
        {
          stepNumber: 3,
          heading: 'Alta de nuevas Empresas / Franquicias (exclusivo Central Grupo Soto)',
          detail:
            'Entrando con la cuenta maestra gerencia@gruposoto.es puedes crear nuevas sedes/franquicias (que reciben automáticamente su primer usuario Gerente y el Catálogo Maestro) y cambiar de sede en vivo desde la barra superior.'
        }
      ],
      tips: [
        'Cada empresa tiene sus propios clientes, presupuestos, almacén, correos, usuarios y serie de facturación VeriFactu 100% separados en PostgreSQL.'
      ]
    }
  ];

  readonly filteredSections = computed(() => {
    const activeId = this.activeSectionId();
    const q = this.searchQuery().trim().toLowerCase();

    return this.sections.filter(sec => {
      const matchesTab = activeId === 'TODOS' || sec.id === activeId;
      if (!matchesTab) return false;
      if (!q) return true;
      const inTitle = sec.title.toLowerCase().includes(q) || sec.summary.toLowerCase().includes(q);
      const inSteps = sec.steps.some(
        s => s.heading.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)
      );
      return inTitle || inSteps;
    });
  });

  selectSection(id: string): void {
    this.activeSectionId.set(id);
  }

  printManual(): void {
    window.print();
  }
}
