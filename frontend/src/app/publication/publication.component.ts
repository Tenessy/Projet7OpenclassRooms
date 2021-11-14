import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { style, animate, transition, trigger, keyframes } from '@angular/animations';
import { faThumbsUp as farThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { faShare, faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Post } from '../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ transform: 'rotate(10deg) scale(1.5)' }),
        animate('200ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})

export class PublicationComponent implements OnInit, OnDestroy {
  constructor(private postService: PostService,
    private auth: AuthService,
    private router: Router) { }

  @Input()
  post: Post;

  farThumbsUp = farThumbsUp;
  fasThumbsUp = fasThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  likes: any;
  userId: any;
  likeSubscription: Subscription;
  today: any = Date.now();
  
  goComment(id: any) {
    let link = [`/forum/${id}/#comment`];
    console.log(id);
    this.router.navigate(link);
  }
  like(post: Post) {
    post.userIdLike = this.userId;
    const formData: any = new FormData();
    formData.append('post', JSON.stringify(post));
    this.postService.postLike(formData).subscribe(
      data => {
        console.log(data);
        this.ngOnInit();
      }
    );
    post.likeStatus = true;
  }
  unLike(post: Post) {
    post.userIdLike = this.userId;
    this.postService.deleteLike(post).subscribe(
      data => {
        console.log(data);
        this.ngOnInit();
      }
    );
    post.likeStatus = false;
  }

  ngOnInit() {
    this.auth.subject.subscribe(
      val => {
        this.userId = val?.userId;
      }
    )
    this.likeSubscription = this.postService.getLikes()
      .subscribe(
        likes => {
          this.likes = likes;
          const like = this.likes && this.likes.filter((like: any) => this.post.postId === like.post_id);
          this.post.nbrLikes = like.length;
          like.find((like: any) => {
            const findUserId = like.userId_like === this.userId;
            console.log(findUserId);
            console.log(this.userId);
            if (findUserId) {
              this.post.likeStatus = true;
            }
            else {
              this.post.likeStatus = false;
            }
          })
        }
      );
  }
  ngOnDestroy() {
    this.likeSubscription.unsubscribe();
  }
}


