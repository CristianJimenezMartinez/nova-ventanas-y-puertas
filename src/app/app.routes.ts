import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { PortalStoreService } from './portal/services/portal-store.service';
import { PortalModuleKey } from './portal/models/portal.models';

const requirePortalModule = (moduleKey: PortalModuleKey): CanActivateFn => {
  return () => {
    const store = inject(PortalStoreService);
    const router = inject(Router);
    if (!store.isAuthenticated()) {
      return router.createUrlTree(['/portal/login']);
    }
    const role = store.currentUser().role;
    if (store.security.canAccessModule(role, moduleKey)) {
      return true;
    }
    return router.createUrlTree([role === 'ALMACEN_OBRA' ? '/portal/almacen' : '/portal/dashboard']);
  };
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'portal/login',
    loadComponent: () =>
      import('./portal/pages/login/portal-login.component').then(m => m.PortalLoginComponent)
  },
  {
    path: 'portal',
    loadComponent: () =>
      import('./portal/layout/portal-shell.component').then(m => m.PortalShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        canActivate: [requirePortalModule('dashboard')],
        loadComponent: () =>
          import('./portal/pages/dashboard/portal-dashboard.component').then(
            m => m.PortalDashboardComponent
          )
      },
      {
        path: 'catalogo',
        canActivate: [requirePortalModule('catalogo')],
        loadComponent: () =>
          import('./portal/pages/catalog/portal-catalog.component').then(
            m => m.PortalCatalogComponent
          )
      },
      {
        path: 'presupuestos',
        canActivate: [requirePortalModule('presupuestos')],
        loadComponent: () =>
          import('./portal/pages/quotes/portal-quotes.component').then(
            m => m.PortalQuotesComponent
          )
      },
      {
        path: 'almacen',
        canActivate: [requirePortalModule('almacen')],
        loadComponent: () =>
          import('./portal/pages/warehouse/portal-warehouse.component').then(
            m => m.PortalWarehouseComponent
          )
      },
      {
        path: 'facturacion',
        canActivate: [requirePortalModule('facturacion')],
        loadComponent: () =>
          import('./portal/pages/invoicing/portal-invoicing.component').then(
            m => m.PortalInvoicingComponent
          )
      },
      {
        path: 'correos',
        canActivate: [requirePortalModule('correos')],
        loadComponent: () =>
          import('./portal/pages/emails/portal-emails.component').then(
            m => m.PortalEmailsComponent
          )
      },
      {
        path: 'empresas',
        canActivate: [requirePortalModule('empresas')],
        loadComponent: () =>
          import('./portal/pages/tenants/portal-tenants.component').then(
            m => m.PortalTenantsComponent
          )
      },
      {
        path: 'documentacion',
        loadComponent: () =>
          import('./portal/pages/docs/portal-docs.component').then(
            m => m.PortalDocsComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
