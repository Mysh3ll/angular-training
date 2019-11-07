import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';

export enum EventName {
  Question = 'question',
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // private socket; // socket that connects to our socket.io server
  //
  // constructor() {}
  //
  // connect(): Subject<MessageEvent> {
  //   this.socket = io(environment.ws_url);
  //
  //   const observable = new Observable(obs => {
  //     this.socket.on('message', data => {
  //       console.log('Received a message from websocket server');
  //       obs.next(data);
  //     });
  //
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  //
  //   const observer = {
  //     next: (data: object) => {
  //       this.socket.emit('message', JSON.stringify(data));
  //     },
  //   };
  //
  //   return Subject.create(observer, observable);
  // }

  private socket: any;
  private readonly url: string = environment.ws_url;

  constructor() {
    this.socket = io(this.url);
  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socket.on(eventName, data => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
