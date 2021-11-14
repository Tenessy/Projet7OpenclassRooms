import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PostService } from '../services/post.service';
import { faThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { FormControl } from '@angular/forms';
import { Post } from '../models/post.model';
import { comment } from 'postcss';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit, OnDestroy {
  @Input() item = '';

  userName: string;
  texte: string;
  subscribtion: Subscription;
  public posts: any = [];
  faThumbsUp = faThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  userId: any;
  comment = new FormControl('');
  comments: any = [];
  commentHeure: any;

  today: any = Date.now();

  constructor(private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.userPermission();
    const id = this.route.snapshot.params['id'];
    this.subscribtion = this.route.params.pipe(
      switchMap((params: Params) => this.postService.getPost(+params['id']))
    ).subscribe(posts => {
      if (posts.length === 0 || posts.length < 0) {
        this.router.navigate(['/not-found']);
      }
      else {
        this.posts = posts;
      }
    });
    this.postService.getCommentsOnePost(id).subscribe(
      comments => {
        this.comments = comments;
        console.log(this.comments);
      }
    );
  }
  userPermission() {
    this.authService.subject.subscribe(
      val => {
        this.userId = val?.userId;
        console.log(val?.userId);
      }
    );
  }

  postComment() {
    console.log(JSON.stringify(this.comment.value));
    const id = this.route.snapshot.params['id'];
    let user;
    this.authService.subject.subscribe(
      oneUser => {
        user = oneUser
        console.log(user);
      }
    );
    let min = 100000;
    let max = 1000000
    const comment_id = Math.floor(Math.random() * (max - min)) + min;
    const comment = {
      comment_id: comment_id,
      commentaire: this.comment.value,
      date: Date.now(),
    }
    const formData: any = new FormData();
    formData.append('comment', JSON.stringify(comment))
    formData.append('user', JSON.stringify(user));
    if (this.comment.value !== "" && formData !== null) {
      this.postService.postOnePostComment(id, formData).subscribe(
        val => {
          console.log(val)
          this.router.navigate([`/forum`])
        },
        error => {
          console.log(error)
        }
      );
    }
    else {
      console.log('La requête n\'a pas pu aboutir, veuillez remplir le champs');
    }
  }
  commentaire: any;
  deleteComment(comment: any) {
    this.commentaire = comment;
  }
  confirmDeleteComment() {
    const id = this.route.snapshot.params['id'];
    const commentaire = JSON.stringify(this.commentaire);
    this.postService.deleteComment(commentaire, id)
      .subscribe(
        val => {
          console.log(val + 'le commentaire a été supprimé')
        }
      );
    this.ngOnInit();
  }

  viewUser(id: any) {
    let link = [`/user/${id}`]
    this.router.navigate(link);
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

}
