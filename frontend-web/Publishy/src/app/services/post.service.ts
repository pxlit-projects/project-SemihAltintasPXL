import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly baseUrl = 'http://localhost:8093/api/post'; 

  constructor(private http: HttpClient) { }

  createPostAsConcept(postRequest: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.baseUrl + '/concept', postRequest, { headers });
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  approvePost(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/approve/${id}`, {});
  }
}