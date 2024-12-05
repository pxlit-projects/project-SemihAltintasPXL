import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'editor', password: 'editor123', role: 'editor' },
    { username: 'user', password: 'user123', role: 'user' }
  ];

  private currentUser: any = null;

  login(username: string, password: string, role: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
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