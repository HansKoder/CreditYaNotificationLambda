import { TypeNotificationVO } from "./vo/TypeNotificationVO";
import { DestinationVO } from "./vo/DestinationVO";
import { MessageVO } from "./vo/MessageVO";
import { SubjectVO } from "./vo/SubjectVO";

export interface NotificationProps {
  destination: DestinationVO;
  subject: SubjectVO;
  message: MessageVO;
  type: TypeNotificationVO;
}

export class Notification {
  private readonly destination: DestinationVO;
  private readonly subject: SubjectVO;
  private readonly message: MessageVO;
  private readonly type: TypeNotificationVO;

  private constructor(props: NotificationProps) {
    this.destination = props.destination;
    this.subject = props.subject;
    this.message = props.message;
    this.type = props.type;
  }

  static create(props: NotificationProps): Notification {
    return new Notification(props);
  }

  getDestination(): string {
    return this.destination.getValue();
  }

  getSubject(): string {
    return this.subject.getValue();
  }

  getMessage(): string {
    return this.message.getValue();
  }

  getType(): TypeNotificationVO {
    return this.type;
  }
}