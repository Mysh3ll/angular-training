import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Question } from './question.model';
import { QuestionService } from './question.service';
import { AuthService } from '../auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  questions: Question[];
  subscription: Subscription;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
  ) {}

  ngOnInit() {
    this.dataStorageService.fetchQuestions().subscribe();
    this.subscription = this.questionService.questionsChanged.subscribe((questions: Question[]) => {
      this.questions = questions;
    });
    this.questions = this.questionService.getQuestions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
