import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  role: string = 'user';
  errorMessage: string = '';
  roles: string[] = ['editor', 'user'];


  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.authService.login(this.username, this.password, this.role)) {
      const role = this.authService.getUserRole();
      if (role === 'editor') {
        this.router.navigate(['/editor']);
      } else if (role === 'user') {
        this.router.navigate(['/user']);
      }
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}