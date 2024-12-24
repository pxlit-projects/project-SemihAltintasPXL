import { Review } from './../../models/review.module';
import { ReviewService } from './../../services/review.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import { Post } from '../../models/post.module';

@Component({
  selector: 'app-rejected-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './rejected-posts.component.html',
  styleUrl: './rejected-posts.component.css'
})
export class RejectedPostsComponent {
  posts: any[] = [];
  filterType: string = '';
  filterValue: string = '';
  reviews: { [key: number]: Review } = {};
  review: Review | undefined; 

  constructor(private postService: PostService, private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.postService.getAllRejectedPosts().subscribe(posts => {
      this.posts = posts;
      this.posts.forEach(post => {
        this.getReviewByPostId(post.id);
        console.log(this.reviews);
      });
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
  getReviewByPostId(postId: number) {
    this.reviewService.getReviewsByPostId(postId).subscribe({      
      next: (data) => this.reviews[postId] = data as Review,
      error: (err) => console.error('Error fetching review:', err)
    });
  }
}
