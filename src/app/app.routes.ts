import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';

export const routes: Routes = [   
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    { 
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage),
        title: 'Nexa - Login'
    }
];
