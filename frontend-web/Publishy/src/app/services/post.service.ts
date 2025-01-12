import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.module';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly baseUrl = `${environment.apiUrl}post/api/post`;

  constructor(private http: HttpClient) { }

  createPostAsConcept(postRequest: any, userRole: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'user-role': userRole
    });
    return this.http.post(this.baseUrl + '/concept', postRequest, { headers });
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  getAllApprovedPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/approved`);
  }
  getAllPendingPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pending`);
  }
  getAllRejectedPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rejected`);
  }
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }
  approvePost(id: number): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<Post>(`${this.baseUrl}/approve/${id}`, {}, {headers });
  }
  rejectPost(id: number): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<Post>(`${this.baseUrl}/reject/${id}`, {}, {headers });
  }
  updatePost(id: number, postRequest: any, userRole: string): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'user-role': userRole
    });

    return this.http.put<void>(`${this.baseUrl}/update/${id}`, postRequest, { headers });
  }
}