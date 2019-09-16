import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { QuestionService } from '../question/question.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { Question } from '../question/question.model';

interface ApiQuestion {
  questions?: [Question];
  question?: Question;
}

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private questionService: QuestionService,
    private authService: AuthService,
  ) {}

  // storeQuestions() {
  //   const recipes = this.questionService.getQuestions();
  //   this.http
  //     .put('https://ng-course-recipe-book-65f10.firebaseio.com/recipes.json', recipes)
  //     .subscribe(response => {
  //       console.log(response);
  //     });
  // }

  fetchQuestions() {
    return this.http.get<ApiQuestion>(`${environment.api_uri}/questions/`).pipe(
      map(data => {
        // Order by title
        data.questions.sort((a, b) => (a.title < b.title ? -1 : 1));
        return data;
      }),
      tap(data => {
        this.questionService.setQuestions(data.questions);
      }),
    );
  }

  fetchQuestion(_id: string) {
    return this.http.get<ApiQuestion>(`${environment.api_uri}/questions/${_id}`).pipe(
      tap(data => {
        this.questionService.setQuestion(data.question);
      }),
    );
  }
}
