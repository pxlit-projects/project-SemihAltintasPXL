import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../models/review.module';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly baseUrl = `${environment.apiUrl}review/api/review`;

  constructor(private http: HttpClient) { }

  approvePost(postId: number) {
    return this.http.post(`${this.baseUrl}/approve/${postId}`, {});
  }
  rejectPosts(review: Review) {
    return this.http.post(`${this.baseUrl}/reject`, review);
  }
  getReviewsByPostId(postId: number) {
    return this.http.get(`${this.baseUrl}/${postId}`);
  }
  
}
