import { NotificationRepository } from "../model/gateway/NotificationRepository";
import { Notification } from "../model/Notification";
import { DestinationVO } from "../model/vo/DestinationVO";
import { MessageVO } from "../model/vo/MessageVO";
import { SubjectVO } from "../model/vo/SubjectVO";
import { TypeNotificationVO } from "../model/vo/TypeNotificationVO";
import { SendNotificationCommand } from "./Command";
import { INotificationUseCase } from "./INotificationUseCase";

export class NotificationUseCase implements INotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(command: SendNotificationCommand): Promise<void> {
    await this.notificationRepository.send(this.checkParams(command));
  }

  private checkParams (cmd: SendNotificationCommand) : Notification {
    return Notification.create({
        'destination': DestinationVO.create(cmd.destination),
        'message': MessageVO.create(cmd.message),
        'subject': SubjectVO.create(cmd.subject),
        'type': TypeNotificationVO.create(cmd.type) 
    });
  }

}