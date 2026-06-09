import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MovementLog } from '../pages/movement-control-page/movement-control-page';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private http = inject(HttpClient)
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api/movements'

  public getMovements() {
    return this.http.get<MovementLog[]>(this.urlAPI, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
