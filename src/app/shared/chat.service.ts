import { Injectable, OnDestroy, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  message: BehaviorSubject<any> = new BehaviorSubject<any>('');
  subscription: Subscription;

  constructor(private wsService: WebsocketService) {
    this.subscription = this.wsService.listen('message').subscribe(data => {
      this.message.next(data);
    });
  }

  sendMsg(msg) {
    this.wsService.emit('message', msg);
    // this.message.next(msg);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
