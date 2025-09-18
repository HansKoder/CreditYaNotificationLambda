import { NotificationDomainException } from "../exception/NotificationDomainException";

export class MessageVO {
  private constructor(private readonly value: string) {}

  static create(value: string): MessageVO {
    if (!value || !value.trim()) {
      throw new NotificationDomainException("Message is required");
    }
    
    if (value.length > 1000) {
      throw new NotificationDomainException("Message cannot exceed 1000 characters");
    }

    return new MessageVO(value);
  }

  getValue(): string {
    return this.value;
  }
}