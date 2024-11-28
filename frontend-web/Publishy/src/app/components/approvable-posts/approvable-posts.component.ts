import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-approvable-posts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './approvable-posts.component.html',
  styleUrls: ['./approvable-posts.component.css']
})
export class ApprovablePostsComponent implements OnInit {
  posts: any[] = [];
  editForm: FormGroup;
  editingPostId: number | null = null;

  constructor(private postService: PostService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPendingPosts();
  }

  getPendingPosts(): void {
    this.postService.getAllPendingPosts().subscribe(data => {
      this.posts = data;
    }, error => {
      console.error('Error fetching pending posts', error);
    });
  }

  startEditing(post: any): void {
    this.editingPostId = post.id;
    console.log('Editing post', post);
    this.editForm.setValue({
      title: post.title,
      content: post.content,
    });
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingPostId !== null) {
      this.postService.updatePost(this.editingPostId, this.editForm.value).subscribe(() => {
        this.getPendingPosts(); 
        this.editingPostId = null; 
      }, error => {
        console.error('Error updating post', error);
      });
    }
  }

  cancelEdit(): void {
    this.editingPostId = null;
  }
}
