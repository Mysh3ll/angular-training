import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Question } from './question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  questionsChanged = new Subject<Question[]>();
  questionChanged = new Subject<Question>();

  private questions: Question[] = [];
  private question: Question;

  constructor() {}

  setQuestions(questions: Question[]) {
    this.questions = questions;
    this.questionsChanged.next([...this.questions]);
  }

  getQuestions() {
    return [...this.questions];
  }

  setQuestion(question: Question) {
    this.question = question;
    this.questionChanged.next(this.question);
  }
  getQuestion() {
    return this.question;
  }

  // getRecipe(index: number) {
  //   return this.questions[index];
  // }
  //
  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.slService.addIngredients(ingredients);
  // }
  //
  // addRecipe(recipe: Recipe) {
  //   this.questions.push(recipe);
  //   this.recipesChanged.next(this.questions.slice());
  // }
  //
  // updateRecipe(index: number, newRecipe: Recipe) {
  //   this.questions[index] = newRecipe;
  //   this.recipesChanged.next(this.questions.slice());
  // }
  //
  // deleteRecipe(index: number) {
  //   this.questions.splice(index, 1);
  //   this.recipesChanged.next(this.questions.slice());
  // }
}
