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
    this.authService.login(this.username, this.password, this.role);
    localStorage.setItem('role', this.authService.getUserRole());
    localStorage.setItem('username', this.authService.getCurrentUser().username);
    this.router.navigate(['/approved-posts']);
  }
}