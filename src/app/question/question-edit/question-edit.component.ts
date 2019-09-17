import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from '../question.model';
import { DataStorageService } from '../../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss'],
})
export class QuestionEditComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private questionService: QuestionService,
  ) {}

  @ViewChild('alert', { static: false }) alert: ElementRef;

  question: Question;
  questionForm: FormGroup;
  editMode: boolean = false;
  id: string;
  isLoading: boolean = false;
  errorMessage: string = '';
  subscription: Subscription;

  onSubmit() {
    this.isLoading = true;

    if (this.editMode) {
      this.updateQuestion();
    } else {
      this.postQuestion();
    }
  }

  private postQuestion() {
    const tags = this.convertJsonTagsArray();

    const question = new Question(
      this.inputTitle.value,
      this.inputDescription.value,
      tags,
      new Date(),
    );
    this.dataStorageService.storeQuestion(question).subscribe(
      response => {
        this.router.navigate(['/questions']);
        this.isLoading = false;
      },
      err => {
        if (err) {
          this.errorMessage = err.error.message;
          this.isLoading = false;
        }
      },
    );
  }

  private updateQuestion() {
    const tags = this.convertJsonTagsArray();

    const updatedQuestion = new Question(
      this.inputTitle.value,
      this.inputDescription.value,
      tags,
      this.question.createdAt,
    );
    this.dataStorageService.patchQuestion(this.question._id, updatedQuestion).subscribe(
      response => {
        this.router.navigate(['/questions']);
        this.isLoading = false;
      },
      err => {
        if (err) {
          this.errorMessage = err.error.message;
          this.isLoading = false;
        }
      },
    );
  }

  private deleteQuestion() {
    this.dataStorageService.deleteQuestion(this.question._id).subscribe(
      response => {
        this.router.navigate(['/questions']);
        this.isLoading = false;
      },
      err => {
        if (err) {
          this.errorMessage = err.error.message;
          this.isLoading = false;
        }
      },
    );
  }

  private initForm() {
    let questionTitle = '';
    let questionDescription = '';
    let questionTags: FormArray;

    if (this.editMode) {
      questionTags = new FormArray([]);
      this.dataStorageService.fetchQuestion(this.id).subscribe();
      this.subscription = this.questionService.questionChanged.subscribe((question: Question) => {
        this.question = question;

        questionTitle = question.title;
        questionDescription = question.description;
        if (question.tags) {
          for (const tag of question.tags) {
            questionTags.push(
              new FormGroup({
                tag: new FormControl(tag, Validators.required),
              }),
            );
          }
        }
        this.createForm(questionTitle, questionDescription, questionTags);
      });
      this.question = this.questionService.getQuestion();
    } else {
      questionTags = new FormArray([this.createTag()]);
      this.createForm(questionTitle, questionDescription, questionTags);
    }
  }

  private convertJsonTagsArray() {
    return this.inputTags.value.map(obj => {
      return obj.tag;
    });
  }

  get inputTitle() {
    return this.questionForm.get('title');
  }

  get inputDescription() {
    return this.questionForm.get('description');
  }

  get inputTags() {
    return this.questionForm.get('tags') as FormArray;
  }

  get inputTagsControls() {
    return (this.questionForm.get('tags') as FormArray).controls;
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errorMessage = '';
  }

  createForm(questionTitle: string, questionDescription: string, questionTags: FormArray): void {
    this.questionForm = new FormGroup({
      title: new FormControl(questionTitle, [Validators.required]),
      description: new FormControl(questionDescription, [Validators.required]),
      tags: questionTags,
    });
  }

  private createTag(): FormGroup {
    return new FormGroup({
      tag: new FormControl(null, [Validators.required]),
    });
  }

  onAddTag(): void {
    (this.questionForm.get('tags') as FormArray).push(this.createTag());
  }

  onDeleteTag(index: number) {
    (this.questionForm.get('tags') as FormArray).removeAt(index);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params._id;
      const key = '_id';
      this.editMode = params[key] != null;
      this.initForm();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
