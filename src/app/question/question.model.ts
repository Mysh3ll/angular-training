export class Question {
  public _id: string;
  public title: string;
  public description: string;
  public tags: string[];
  public createdAt: Date;

  constructor(title: string, description: string, tags: string[], createdAt: Date) {
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.createdAt = createdAt;
  }
}
