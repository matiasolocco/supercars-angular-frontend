import { Component } from '@angular/core';
import { User } from '../../../interfaces/user';

import { UserService } from '../../../services/user.service';
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

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: User[]) => {
        this.users = response as User[];
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
      }
    });
  }

}
