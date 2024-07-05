import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../interfaces/vehicle';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private url = 'http://localhost:3000/api/vehicles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const user = this.authService.getUser();
    const token = user ? user.token : null;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.url, { headers: this.getAuthHeaders() });
  }

  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.url}/${id}`, { headers: this.getAuthHeaders() });
  }

  addVehicle(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.url, vehicle, { headers: this.getAuthHeaders() });
  }

  updateVehicle(id: string, vehicle: Partial<Vehicle>): Observable<any> {
    return this.http.patch(`${this.url}/${id}`, vehicle, { headers: this.getAuthHeaders() });
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { headers: this.getAuthHeaders() });
  }
}
