import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Notification } from "../../domain/model/Notification";
import { NotificationRepository } from "../../domain/model/gateway/NotificationRepository";


export class SesEmailAdapter implements NotificationRepository {
  private client: SESClient;

  constructor(region: string) {
    console.log(`[infra.adapter.ses] (construct), payload=[ region:${region} ]`)
    this.client = new SESClient({ region });
  }
    
  async send(notification: Notification): Promise<void> {
    console.log(`[infra.adapter.ses] (send) send notification using ses service adapter, payload=[${notification}]`)
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

    console.log(`[infra.adapter.ses] (send) sending notification, payload=[ params:${params}]`)
    await this.client.send(new SendEmailCommand(params));
  }
  
}
