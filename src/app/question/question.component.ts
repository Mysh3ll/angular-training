import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Question } from './question.model';
import { QuestionService } from './question.service';
import { AuthService, UserDetails } from '../auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService, EventName } from '../shared/websocket.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  questions: Question[];
  userDetails: UserDetails;
  subQuestion: Subscription;
  subWebSocket: Subscription;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private wsService: WebsocketService,
  ) {}

  ngOnInit() {
    this.dataStorageService.fetchQuestions().subscribe();
    this.subQuestion = this.questionService.questionsChanged.subscribe((questions: Question[]) => {
      this.questions = questions;
    });
    this.questions = this.questionService.getQuestions();
    this.userDetails = this.authService.getUserDetails();

    // socket.io
    this.subWebSocket = this.wsService
      .listen(EventName.Question)
      .subscribe((questions: Question) => {
        this.questions = [questions, ...this.questions];
      });
  }

  onAddQuestion() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onDisableQuestion(question: Question) {
    return this.userDetails.id !== question.createdBy;
  }

  onEditQuestion(question: Question) {
    this.router.navigate([question._id, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    if (this.subQuestion) {
      this.subQuestion.unsubscribe();
    }
    if (this.subWebSocket) {
      this.subWebSocket.unsubscribe();
    }
  }
}
