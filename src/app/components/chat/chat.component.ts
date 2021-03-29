import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Paginated } from '@feathersjs/feathers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

const defaultRooms = [
  {name: 'room1', description: "Description1", id: uuidv4()},
  {name: 'room2', description: "Description2", id: uuidv4()},
  {name: 'room3', description: "Description3", id: uuidv4()},
  {name: 'room4', description: "Description4", id: uuidv4()}
];

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  users$: Observable<any[]>;
  rooms = [];
  isEditable = false;
  activeRoomId: number;
  messages$: Observable<any[]>;
  messageLikes = {};
  roomMessages = {};

  constructor(private data: DataService, private auth: AuthService) {
    this.messages$ = data.messages$()
    .pipe(
        map((m: Paginated<any>) => {
          return m.data;
        }),
        map((m: Array<any>) => m.reverse()),
      )
         
    this.users$ = data.users$().pipe(
        map((u: Paginated<any>) => {
          return u.data
        })
      );

    this.rooms = defaultRooms;
    this.activeRoomId = this.rooms[0].id;
  }

  deleteRoom(id: number) {
    this.rooms = this.rooms.filter(r => r.id !== id);

    if(this.activeRoomId === id && this.rooms.length) {
      this.activeRoomId = this.rooms[0].id;
    }
  }

  addNewRoom(name: string, description: string) {
    this.rooms.push({
      name: name || 'default name',
      description: description || 'default description',
      id: uuidv4()
    })
  }

  setActiveRoom(id: number) { 
    this.activeRoomId = id;
  }

  setEditable(isEditable = false) {
    this.isEditable = isEditable;
  }

  likeIt(id: number) {
    if(this.messageLikes[id]) {
      delete this.messageLikes[id];
      return;
    }
    this.messageLikes[id] = true
  }

  async sendMessage(message: string) {    
    const sentMessage = await this.data.sendMessage(message);

    if (this.roomMessages[this.activeRoomId]) {
      this.roomMessages[this.activeRoomId].push(sentMessage._id)
    } else {
      this.roomMessages[this.activeRoomId] = [sentMessage._id]
    }
  }

  logOut() {
    this.auth.logOut();
  }
}
