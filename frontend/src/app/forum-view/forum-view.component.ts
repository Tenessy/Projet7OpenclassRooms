import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../services/post.service';
import { faThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Post } from '../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum-view',
  templateUrl: './forum-view.component.html',
  styleUrls: ['./forum-view.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class ForumViewComponent implements OnInit, OnDestroy {

  faThumbsUp = faThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  title = 'Groupomania';
  posts: any = [];
  users = this.userService.utilisateurs;
  name: any;
  postSubscription: Subscription;

  constructor(private postService: PostService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router) {
  }
  ngOnInit() {
    this.postSubscription = this.postService.getPostsFromServer()
      .subscribe(
        posts => {
          console.log(posts);
          this.posts = posts;
        },
        (error) => {
          console.log('Une erreur est survenue !' + error);
        }
      );
  }
  onFetch() {
    this.postService.getPostsFromServer();
  }
  tokenView() {
    return console.log(localStorage.getItem('currentUser'));
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
