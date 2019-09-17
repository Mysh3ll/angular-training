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

  storeQuestion(question: Question) {
    // const question = this.questionService.getQuestion();
    return this.http.post(`${environment.api_uri}/questions/`, question);
  }

  fetchQuestions() {
    return this.http.get<ApiQuestion>(`${environment.api_uri}/questions/`).pipe(
      map(data => {
        // Order by date (createdAt) DESC
        data.questions.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
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

  patchQuestion(_id: string, question: Question) {
    return this.http.patch(`${environment.api_uri}/questions/${_id}`, question);
  }

  deleteQuestion(_id: string) {
    return this.http.delete(`${environment.api_uri}/questions/${_id}`);
  }
}
