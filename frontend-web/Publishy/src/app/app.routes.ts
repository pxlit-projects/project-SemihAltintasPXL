import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { ApprovablePostsComponent } from './components/approvable-posts/approvable-posts.component';
import { LoginComponent } from './components/login/login.component';
import { RejectedPostsComponent } from './components/rejected-posts/rejected-posts.component';
import { RejectionMessageComponent } from './components/rejection-message/rejection-message.component';
import { CreateCommentComponent } from './components/create-comment/create-comment.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'approved-posts', component: AllPostsComponent, canActivate: [AuthGuard]},
  { path: 'approvable-posts', component: ApprovablePostsComponent , canActivate: [AuthGuard]},
  { path: 'rejected-posts', component: RejectedPostsComponent , canActivate: [AuthGuard]},
  { path: 'rejection-message/:id', component: RejectionMessageComponent , canActivate: [AuthGuard]},
  { path: 'create-comment/:id', component: CreateCommentComponent , canActivate: [AuthGuard]},
  { path: '', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
