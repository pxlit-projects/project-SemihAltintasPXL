import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, RouterModule } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.module';


@Component({
  selector: 'app-approvable-posts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, MatSnackBarModule, RouterModule],
  templateUrl: './approvable-posts.component.html',
  styleUrls: ['./approvable-posts.component.css']
})
export class ApprovablePostsComponent implements OnInit {
  posts: any[] = [];
  editForm: FormGroup;
  editingPostId: number | null = null;
  filterType: string = '';
  filterValue: string = '';
  comments: { [key: number]: Comment[] } = {};

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private reviewService: ReviewService,
    private commentService: CommentService
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPendingPosts();
  }

  getPendingPosts(): void {
    this.postService.getAllPendingPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.posts.forEach(post => {
        });
      },
      error: (err) => console.error('Error fetching pending posts:', err)
    });
  }



  approvePost(postId: number): void {
    this.reviewService.approvePost(postId).subscribe({
      next: () => {
        this.getPendingPosts();
        this.snackBar.open('Post approved successfully', 'Close', {
          duration: 5000,
        });
      },
      error: (err) => {
        console.error('Error approving post:', err);
        this.snackBar.open('Error approving post', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  startEditing(post: any): void {
    this.editingPostId = post.id;
    this.editForm.setValue({
      title: post.title,
      content: post.content,
    });
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingPostId !== null) {
      const userRole = localStorage.getItem('role') || '';
      this.postService.updatePost(this.editingPostId, this.editForm.value, userRole).subscribe({
        next: () => {
          this.getPendingPosts();
          this.editingPostId = null;
          this.snackBar.open('Post updated successfully', 'Close', {
            duration: 5000,
          });
        },
        error: (err) => {
          console.error('Error updating post:', err);
          this.snackBar.open('Error updating post', 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingPostId = null;
  }

  filteredPosts() {
    return this.posts.filter(post => {
      const filterValueLower = this.filterValue.toLowerCase();
      if (this.filterType === 'content') {
        return post.content && post.content.toLowerCase().includes(filterValueLower);
      } else if (this.filterType === 'author') {
        return post.author && post.author.toLowerCase().includes(filterValueLower);
      } else if (this.filterType === 'date') {
        return post.created === this.filterValue;
      }
      return true;
    });
  }
}
