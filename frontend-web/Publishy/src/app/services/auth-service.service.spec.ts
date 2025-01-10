import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a user', () => {
    const result = service.login('testuser', 'password123', 'admin');
    expect(result).toBe(true);
    expect(service.getCurrentUser()).toEqual({
      username: 'testuser',
      password: 'password123',
      role: 'admin'
    });
  });

  it('should set current user to null when logging out', () => {
    service.login('testuser', 'password123', 'admin');
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should return true for isLoggedIn when a user is logged in', () => {
    service.login('testuser', 'password123', 'admin');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false for isLoggedIn when no user is logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return the user role', () => {
    service.login('testuser', 'password123', 'admin');
    expect(service.getUserRole()).toBe('admin');
  });

  it('should return null if no user is logged in when getting user role', () => {
    expect(service.getUserRole()).toBeNull();
  });
});
