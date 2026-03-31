import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

const MyPreset = definePreset(Aura, {
  components: {
    dialog: {
      root: {
        background: 'rgba(45, 47, 60, 0.82)',
        borderColor: 'transparent',
        borderRadius: '20px',
      }
    }
  }
});



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({ theme: { preset: MyPreset } }),
    provideAnimations(),
    provideHttpClient()
  ]
};