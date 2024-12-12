import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../models/review.module';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly baseUrl = 'http://localhost:8095/api/review'; 

  constructor(private http: HttpClient) { }

  approvePost(postId: number) {
    return this.http.post(`${this.baseUrl}/approve/${postId}`, {});
  }
  rejectPost(postId: number, review: Review) {

    return this.http.post(`${this.baseUrl}/reject/${postId}`, {review});
  }
  
}
