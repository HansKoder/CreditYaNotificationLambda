import { NotificationDomainException } from "../exception/NotificationDomainException";

export class DestinationVO {
  private constructor(private readonly value: string) {}

  static create(value: string): DestinationVO {
    if (!value || !value.trim()) {
        console.log('Destination is mandatory');
        throw new NotificationDomainException("Destination is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new NotificationDomainException("Invalid email format");
    }
    return new DestinationVO(value);
  }

  getValue(): string {
    return this.value;
  }
}