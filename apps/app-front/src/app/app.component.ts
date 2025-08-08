import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { filter, take, tap } from 'rxjs';
import { AuthService } from './libs/auth/services/auth.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'app-front';
  #auth = inject(AuthService);

  ngOnInit(): void {
    this.#auth.isLoggedIn$
      .pipe(
        filter(Boolean),
        take(1),
        tap(() => {
          this.#auth.doPing().subscribe();
        })
      )
      .subscribe();
  }
}
