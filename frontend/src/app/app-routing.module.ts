import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';

import { ForumViewComponent } from './forum-view/forum-view.component';
import { OnePostComponent } from './one-post/one-post.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'forum', canActivate: [AuthGuard], component: ForumViewComponent },
    { path: 'forum/:id', canActivate: [AuthGuard], component: OnePostComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: RegisterComponent },
    { path: 'user/:id', canActivate: [AuthGuard], component: UserComponent },
    { path: 'user/:id/edit', canActivate: [AuthGuard], component: EditUserComponent },
    { path: 'not-found', component: FourOhFourComponent },
    { path: '**', redirectTo: 'not-found' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            anchorScrolling: 'enabled'
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }