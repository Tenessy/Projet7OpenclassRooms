import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-forum-view',
  templateUrl: './forum-view.component.html',
  styleUrls: ['./forum-view.component.css']
})
export class ForumViewComponent implements OnInit, OnDestroy {
  constructor(private postService: PostService,
    private auth: AuthService,
    private router: Router) { }
  posts: any = [];
  postSubscription: Subscription;
  user: any;
  today: Number = Date.now();
  deletedPost = new BehaviorSubject<boolean>(false);
  goComment(id: any) {
    let link = [`/forum/${id}/comment`];
    console.log(id);
    this.router.navigate(link);
  }
  ngOnInit() {
    this.getAllPosts();
    this.initPostsAdded();
    this.auth.subject.subscribe(
      user => {
        console.log(user);
        this.user = user;
      }
    );
  }
  deletePost(post: Post) {
    this.deletedPost.subscribe(
      (data: boolean) => {
        if (data) {
          console.log(data);
          this.deletedPost.next(false);
        }
      }
    );
  }
  confirmDeletePost() {
    this.postService.deletedPost.next(true);
  }
  getAllPosts() {
    this.postSubscription = this.postService.getPostsFromServer()
      .subscribe(
        posts => {
          this.posts = posts;
        }
      );
  }
  public initPostsAdded() {
    this.postSubscription = this.postService.postsSubject.subscribe((data: boolean) => {
      if (data) {
        this.getAllPosts();
      }
    });
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
