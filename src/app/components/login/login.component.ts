import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Feathers } from '../../services/feathers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  messages: string[] = [];

  constructor(private feathers: Feathers, private router: Router) {}

  login(email: string, password: string) {
    if (!email || !password) {
      this.messages.push('Заполните все поля!');
      return;
    }

    this.feathers.authenticate({
      strategy: 'local',
      email,
      password
    })
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.messages.unshift('Неправильные креды');
      });
  }

  signup(email: string, password: string) {
    this.feathers.service('users')
      .create({email, password})
      .then((data) =>  {
        this.messages.push('Пользователь успешно создан.')
      } )
      .catch(err => this.messages.push('Невозможно создать пользователя'))
    ;
  }
}
