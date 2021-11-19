import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PostService } from '../services/post.service';
import { faThumbsUp, faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit, OnDestroy {
  @Input() item = '';

  userName: string;
  texte: string;
  postSubscribtion = new Subscription();
  public posts: any = [];
  faThumbsUp = faThumbsUp;
  faCommentAlt = faCommentAlt;
  faShare = faShare;
  user_id: number | undefined;
  comment = new FormControl('');
  comments: any = [];
  commentHeure: any;
  post_id: number = this.route.snapshot.params['id'];

  today: any = Date.now();

  constructor(private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.subject.subscribe(
      user => {
        this.user_id = user?.id;
        console.log(user?.id);
      }
    );
    const id = this.route.snapshot.params['id'];
    this.postSubscribtion.add(this.route.params.pipe(
      switchMap((params: Params) => this.postService.getPost(+params['id']))
    ).subscribe(posts => {
      if (posts.length <= 0) {
        return this.router.navigate(['/not-found']);
      }
      return this.posts = posts;
    }));
    this.postSubscribtion.add(this.postService.getCommentsOnePost(id).subscribe(
      comments => {
        this.comments = comments;
        console.log(this.comments);
      }
    ));
  }
  postComment() {
    this.postSubscribtion.add(this.authService.subject.subscribe(
      user => {
        const comment = {
          commentaire: this.comment.value,
          date: Date.now(),
        }
        const formData: any = new FormData();
        formData.append('comment', JSON.stringify(comment))
        formData.append('user', JSON.stringify(user));
        if (this.comment.value !== "" && formData !== null) {
          this.postService.postOneComment(this.post_id, formData).subscribe(
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
    ));
  }
  commentaire: any;
  deleteComment(comment: any) {
    this.commentaire = comment;
  }
  confirmDeleteComment() {
    const commentaire = JSON.stringify(this.commentaire);
    console.log(commentaire);
    this.postSubscribtion.add(this.postService.deleteOneComment(commentaire, this.post_id)
      .subscribe(
        val => {
          console.log(val + 'le commentaire a été supprimé')
        }
      ));
    this.ngOnInit();
  }
  confirmDeletePost() {
    this.postService.deletedPost.next(true);
  }
  viewUser(id: any) {
    let link = [`/user/${id}`]
    this.router.navigate(link);
  }
  ngOnDestroy() {
    this.postSubscribtion.unsubscribe();
  }

}
