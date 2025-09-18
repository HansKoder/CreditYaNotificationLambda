import { NotificationDomainException } from "../exception/NotificationDomainException";

export class SubjectVO {
  private constructor(private readonly value: string) {}

  static create(value: string): SubjectVO {
    if (!value || !value.trim()) {
      throw new NotificationDomainException("Subject is required");
    }
    if (value.length > 100) {
      throw new NotificationDomainException("Subject cannot exceed 100 characters");
    }

    return new SubjectVO(value);
  }

  getValue(): string {
    return this.value;
  }
}