import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './../models/comment.module';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly baseUrl = 'http://localhost:8097/api/comment'; 

  constructor(private http: HttpClient) { }

  createComment(comment: Comment) {
    return this.http.post(`${this.baseUrl}/create`, comment);
  }
  getAllCommentsByPostId(postId: number) {
    return this.http.get(`${this.baseUrl}/${postId}`);
  }
  deleteComment(commentId: number) {
    return this.http.delete(`${this.baseUrl}/${commentId}`);
  }
  updateComment(commentId: number, comment: Comment) {
    return this.http.put(`${this.baseUrl}/${commentId}`, comment);
  }

}
