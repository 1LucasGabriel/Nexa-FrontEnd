import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MovementsResponse } from '../pages/movement-control-page/movement-control-page';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private http = inject(HttpClient)
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api/movements'

  public getMovements(paramsObj?: {
    search?: string;
    types?: number[];
    page?: number;
    pageSize?: number;
  }) {
    let params = new HttpParams();

    if (paramsObj) {
      if (paramsObj.search) {
        params = params.set('search', paramsObj.search);
      }
      if (paramsObj.types && paramsObj.types.length > 0) {
        paramsObj.types.forEach(t => {
          params = params.append('types', t.toString());
        });
      }
      if (paramsObj.page !== undefined) {
        params = params.set('page', paramsObj.page.toString());
      }
      if (paramsObj.pageSize !== undefined) {
        params = params.set('pageSize', paramsObj.pageSize.toString());
      }
    }

    return this.http.get<MovementsResponse>(this.urlAPI, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
