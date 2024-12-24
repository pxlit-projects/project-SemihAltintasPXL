import { FormBuilder, FormGroup } from '@angular/forms'; // Import FormBuilder and FormGroup
import { CommentService } from './../../services/comment.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Comment } from './../../models/comment.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {Observable} from "rxjs";

import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth-service.service';
@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, RouterModule]
})
export class AllPostsComponent implements OnInit {
  posts: any[] = [];
  filterType: string = '';
  filterValue: string = '';
  comments: { [key: number]: Comment[] } = {};
  editingCommentId: number | null = null;
  commentForm: FormGroup;
  authService: AuthService = inject(AuthService);

  constructor(private postService: PostService, private commentService: CommentService, private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      commentId: [''],
      commentMessage: ['']
    });
    
  }

  ngOnInit(): void {
    this.postService.getAllApprovedPosts().subscribe(data => {
      this.posts = data;
      this.posts.forEach(post => {
        this.getCommentsByPostId(post.id);
      });
    }, error => {
      console.error('Error fetching posts', error);
    });
  }

  filteredPosts() {
    return this.posts.filter(post => {
      if (this.filterType === 'content') {
        return post.content.includes(this.filterValue);
      } else if (this.filterType === 'author') {
        return post.author.includes(this.filterValue);
      } else if (this.filterType === 'date') {
        return post.created === this.filterValue;
      }
      return true;
    });
  }

  createComment(comment: Comment) {
    this.commentService.createComment(comment).subscribe(data => {
      console.log(data);
    }, error => {
      console.error('Error creating comment', error);
    });
  }

  getCommentsByPostId(postId: number): void {
    this.commentService.getAllCommentsByPostId(postId).subscribe({
      next: (data) => this.comments[postId] = data as Comment[],
      error: (err) => console.error('Error fetching comments:', err)
    });
  }

  deleteComment(commentId: number, postId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        console.log('Comment deleted successfully');
        this.getCommentsByPostId(postId); 
      },
      error: (err) => console.error('Error deleting comment:', err)
    });
  }

  startEditingComment(comment: Comment): void {
    this.editingCommentId = comment.id || null;
    this.commentForm.setValue({
      commentId: comment.id,
      commentMessage: comment.commentMessage
    });
  }

  saveCommentEdit(postId: number): void {
    if (this.commentForm.valid && this.editingCommentId !== null) {
      const updatedComment: Comment = {
        id: this.editingCommentId,
        commentAuthor: localStorage.getItem('username') || '',
        commentMessage: this.commentForm.value.commentMessage,
        postId: postId
      };

      this.commentService.updateComment(this.editingCommentId, updatedComment).subscribe({
        next: () => {
          console.log('Comment updated successfully');
          this.editingCommentId = null;
          this.getCommentsByPostId(postId);
        },
        error: (err) => console.error('Error updating comment:', err)
      });
    }
  }

  cancelCommentEdit(): void {
    this.editingCommentId = null;
  }
}