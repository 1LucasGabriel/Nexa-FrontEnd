import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Nexa - Login',
        loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage)
    },
    {
        path: 'home',
        title: 'Nexa - Home',
        loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage)
    },
    {
        path: 'employee-management',
        title: 'Nexa - Gerenciamento de Funcionários',
        loadComponent: () => import('./pages/employee-management-page/employee-management-page').then(m => m.EmployeeManagementPage)
    },
    {
        path: 'alojamentos',
        title: 'Nexa - Gerenciamento de Alojamentos',
        loadComponent: () => import('./pages/alojamentos/alojamentos').then(m => m.Alojamento)
    },
    {
        path: 'fleet-management',
        title: 'Nexa - Gestão de Frotas',
        loadComponent: () => import('./pages/fleet-management-page/fleet-management-page').then(m => m.FleetManagementPage)
    },
    {
        path: 'employee-vehicle-allocation',
        title: 'Nexa - Alocação de Veículos',
        loadComponent: () => import('./pages/employee-vehicle-allocation-page/employee-vehicle-allocation-page').then(m => m.EmployeeVehicleAllocationPage)
    },
    {
        path: 'movement-control',
        title: 'Nexa - Controle de Movimentações',
        loadComponent: () => import('./pages/movement-control-page/movement-control-page').then(m => m.MovementControlPage)
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
