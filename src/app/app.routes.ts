import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { EmployeeManagementPage } from './pages/employee-management-page/employee-management-page';

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
        path: 'employee-management',
        title: 'Nexa - Gerenciamento de Funcionários',
        loadComponent: () => import('./pages/employee-management-page/employee-management-page').then(m => m.EmployeeManagementPage)
    },
    {
        path: 'employee-vehicle-allocation',
        title: 'Nexa - Alocação de Veículos',
        loadComponent: () => import('./pages/employee-vehicle-allocation-page/employee-vehicle-allocation-page').then(m => m.EmployeeVehicleAllocationPage)
    },
    { 
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    }
];
