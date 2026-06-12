import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private http = inject(HttpClient);
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api/addresses';

  public getAddresses() {
    return this.http.get<any[]>(this.urlAPI, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public postAddress(address: any) {
    return this.http.post<any>(this.urlAPI, address, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public putAddress(id: number, address: any) {
    return this.http.put(`${this.urlAPI}/${id}`, address, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public deleteAddress(id: number) {
    return this.http.delete(`${this.urlAPI}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
