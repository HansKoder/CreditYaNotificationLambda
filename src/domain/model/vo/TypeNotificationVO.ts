import { NotificationDomainException } from "../exception/NotificationDomainException";

export enum TypeNotification {
    EMAIL = 'EMAIL'
}

export class TypeNotificationVO {
  private readonly value: TypeNotification;

  private constructor(value: TypeNotification) {
    this.value = value;
  }

  public static create(type: string): TypeNotificationVO {
    if (!type || !type.trim()) {
      throw new NotificationDomainException("Type Notification is required");
    }

    switch (type.toUpperCase()) {
      case TypeNotification.EMAIL:
        return new TypeNotificationVO(TypeNotification.EMAIL);
      default:
        throw new NotificationDomainException(`Unknown type notification: ${type}`);
    }
  }

  public getValue(): TypeNotification {
    return this.value;
  }
}