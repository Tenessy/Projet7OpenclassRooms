import { Component, OnInit, OnDestroy, HostListener, Directive } from '@angular/core';
import { PostService } from '../services/post.service';
import { faThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Post } from '../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-forum-view',
  templateUrl: './forum-view.component.html',
  styleUrls: ['./forum-view.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class ForumViewComponent implements OnInit, OnDestroy {
  isClick = false;
  onComment($event: any) {
    $event.preventDefault();
    if (this.isClick === false) {
      this.isClick = true;
    }
    else if (this.isClick === true) {
      this.isClick = false;
    }
  }

  goComment(id: any) {
    let link = [`/forum/${id}/comment`];
    console.log(id);
    this.router.navigate(link);
  }

  faThumbsUp = faThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  title = 'Groupomania';
  posts: any = [];

  name: any;
  postSubscription: Subscription;

  constructor(private postService: PostService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
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
      this.auth.subject.subscribe(
        val => {
          console.log(val);
        }
      )
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
