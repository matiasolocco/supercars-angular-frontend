import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { MyInfoService } from '../../../services/my-info.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.css'],
})
export class MyInfoComponent implements OnInit {
  user: User | null = null;

  constructor(private myInfoService: MyInfoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.myInfoService.getUserInfo().subscribe({
      next: (response) => {
        console.log('User info received:', response); // Añadir log
        this.user = response;
      },
      error: (error) => {
        console.error('Error fetching user info:', error); // Añadir log
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información del usuario',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  actualizar(): void {
    if (this.user) {
      this.myInfoService.updateUserInfo(this.user).subscribe({
        next: (updatedUser) => {
          console.log('User info updated:', updatedUser); // Añadir log
          this.user = updatedUser;
          Swal.fire({
            title: 'Actualización exitosa',
            text: 'Tu información ha sido actualizada correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (error) => {
          console.error('Error updating user info:', error); // Añadir log
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar la información',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }
}
