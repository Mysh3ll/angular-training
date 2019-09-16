import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Question } from '../question.model';
import { QuestionService } from '../question.service';
import { AuthService } from '../../auth.service';
import { DataStorageService } from '../../shared/data-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  question: Question;
  subscription: Subscription;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params._id;
      this.dataStorageService.fetchQuestion(id).subscribe();
      this.subscription = this.questionService.questionChanged.subscribe((question: Question) => {
        this.question = question;
      });
      this.question = this.questionService.getQuestion();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
