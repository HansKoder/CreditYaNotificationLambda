import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Notification } from "../../domain/model/Notification";
import { NotificationRepository } from "../../domain/model/gateway/NotificationRepository";

import { to } from "await-to-js";
import { NotificationAdapterInfraException } from "./exception/NotificationAdapterInfraException";

export class SesEmailAdapter implements NotificationRepository {
  private client: SESClient;

  constructor() {
    console.log(`[infra.adapter.ses] (construct)`)
    const config = {
      region: process.env.AWS_REGION || "us-east-1",
    }

    this.client = new SESClient(config);
  }
    
  async send(notification: Notification): Promise<void> {
    console.log(`[infra.adapter.ses] (send) send notification using ses service adapter, payload=[${JSON.stringify(notification)}]`)
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
      Source: "hansarias74@gmail.com",
    };

    
    console.log(`[infra.adapter.ses] (send) before sending notification, payload=[ params:${JSON.stringify(params)}]`)
    const [err, resp] = await to(this.client.send(new SendEmailCommand(params)));    

    if (err) {
       console.log(`[infra.adapter.ses] (send) it cannot send message, payload=[ error:${JSON.stringify(err)}]`)
       throw new NotificationAdapterInfraException(`It cannot send message, error detail: ${err.message}`);
    }

    console.log(`[infra.adapter.ses] (send) the notification was sent with successful, payload=[ resp:${JSON.stringify(resp)}]`)
    
  }
  
}
