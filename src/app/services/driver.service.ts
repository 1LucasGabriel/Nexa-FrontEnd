import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Driver } from '../models/driver';
import { CreateDriverDto } from '../dtos/create-driver-dto';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private http = inject(HttpClient);
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api/drivers';

  private get authHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

  public getDrivers() {
    return this.http.get<Driver[]>(this.urlAPI, {
      headers: this.authHeaders
    });
  }

  public postDriver(dto: CreateDriverDto) {
    return this.http.post<Driver>(this.urlAPI, dto, {
      headers: this.authHeaders
    });
  }

  public putDriver(id: number, dto: Partial<CreateDriverDto>) {
    return this.http.put<Driver>(`${this.urlAPI}/${id}`, dto, {
      headers: this.authHeaders
    });
  }

  public deleteDriver(id: number) {
    return this.http.delete(`${this.urlAPI}/${id}`, {
      headers: this.authHeaders
    });
  }
}
