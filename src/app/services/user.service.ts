import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:3000/api/users/all'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.user?.token}`,
    });
    return this.http.get<User[]>(this.url, { headers });
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${userId}`);
  }

  updateUser(userId: string, userData: any): Observable<User> {
    return this.http.patch<User>(`${this.url}/${userId}`, userData);
  }

}