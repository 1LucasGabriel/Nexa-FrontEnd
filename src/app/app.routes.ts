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
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    }
];
