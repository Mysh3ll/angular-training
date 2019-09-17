import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Question } from './question.model';
import { QuestionService } from './question.service';
import { AuthService, UserDetails } from '../auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  questions: Question[];
  userDetails: UserDetails;
  subscription: Subscription;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.dataStorageService.fetchQuestions().subscribe();
    this.subscription = this.questionService.questionsChanged.subscribe((questions: Question[]) => {
      this.questions = questions;
    });
    this.questions = this.questionService.getQuestions();
    this.userDetails = this.authService.getUserDetails();
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
    this.subscription.unsubscribe();
  }
}
