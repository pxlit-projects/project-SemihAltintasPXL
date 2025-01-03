import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { ApprovablePostsComponent } from './components/approvable-posts/approvable-posts.component';
import { LoginComponent } from './components/login/login.component';
import { RejectedPostsComponent } from './components/rejected-posts/rejected-posts.component';
import { RejectionMessageComponent } from './components/rejection-message/rejection-message.component';
import { CreateCommentComponent } from './components/create-comment/create-comment.component';

export const routes: Routes = [
  { path: 'create-post', component: CreatePostComponent },
  { path: 'approved-posts', component: AllPostsComponent },
  { path: 'approvable-posts', component: ApprovablePostsComponent },
  { path: 'rejected-posts', component: RejectedPostsComponent },
  { path: 'rejection-message/:id', component: RejectionMessageComponent },
  { path: 'create-comment/:id', component: CreateCommentComponent },
  { path: '', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }