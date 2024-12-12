import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

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

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAllRejectedPosts().subscribe(data => {
      console.log(data)
      this.posts = data;
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
}
