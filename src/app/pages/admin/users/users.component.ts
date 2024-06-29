import { Component } from '@angular/core';
import { User } from '../../../interfaces/user';
import { Booking } from '../../../interfaces/booking';
import { UserService } from '../../../services/user.service';
import { BookingService } from '../../../services/booking.service';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { DivisaPipe } from '../../../pipes/divisa.pipe';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [FormatDatePipe, DivisaPipe]
})
export class UsersComponent {
  users: User[] = [];
  selectedUser: User | null = null;
  selectedUserBookings: Booking[] = [];

  constructor(private userService: UserService, private bookingService: BookingService) {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response as User[];
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
      }
    });
  }

}
