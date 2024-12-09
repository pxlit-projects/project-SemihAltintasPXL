import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class AllPostsComponent implements OnInit {
  posts: any[] = [];
  filterType: string = '';
  filterValue: string = '';

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAllApprovedPosts().subscribe(data => {
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