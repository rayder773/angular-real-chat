import { Injectable } from '@angular/core';
import { Feathers } from './feathers.service';

/**
 *  Abstraction layer for data management
 *  Technically this isn't needed for feathers-chat,
 *  but you will need it for more complex tasks.
 */
@Injectable()
export class DataService {
  constructor(private feathers: Feathers) {
  }

  messages$() {
    return (this.feathers
      .service('messages'))
      .watch()
      .find({
        query: {
          $sort: {createdAt: -1},
          $limit: 25
        }
      });
  }

  users$() {
    return (<any>this.feathers
      .service('users'))
      .watch()
      .find();
  }

  sendMessage(message: string) {
    if (message === '') {
      return;
    }

    return this.feathers
      .service('messages')
      .create({
        text: message
      });
  }
}
