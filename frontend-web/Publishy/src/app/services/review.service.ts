import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly baseUrl = 'http://localhost:8095/review'; 

  constructor(private http: HttpClient) { }

  approvePost(postId: number) {
    return this.http.post(`${this.baseUrl}/approve/${postId}`, {});
  }
  
}
