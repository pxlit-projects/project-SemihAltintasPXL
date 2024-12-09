import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {



  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
  getRoleOfCurrentUser(): any {
    localStorage.getItem('role');
  }

}
