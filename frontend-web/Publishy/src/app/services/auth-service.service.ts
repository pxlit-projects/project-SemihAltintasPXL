import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  login(username: string, password: string, role: string): boolean {
    this.currentUser = { username, password, role };
    return true;
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserRole(): string {
    return this.currentUser ? this.currentUser.role : null;
  }
}
