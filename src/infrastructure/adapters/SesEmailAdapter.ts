import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Notification } from "../../domain/model/Notification";
import { NotificationRepository } from "../../domain/model/gateway/NotificationRepository";


export class SesEmailAdapter implements NotificationRepository {
  private client: SESClient;

  constructor(region: string) {
    this.client = new SESClient({ region });
  }
    
  async send(notification: Notification): Promise<void> {
    const params = {
      Destination: {
        ToAddresses: [notification.getDestination()],
      },
      Message: {
        Body: {
          Text: { Data: notification.getMessage() },
        },
        Subject: { Data: notification.getSubject() },
      },
      Source: "noreply@mydomain.com",
    };

    await this.client.send(new SendEmailCommand(params));
  }
  
}
