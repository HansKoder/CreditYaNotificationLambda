import { NotificationUseCase } from "../../domain/usecase/NotificationUseCase";
import { SesEmailAdapter } from "../adapters/SesEmailAdapter";
import { SendNotificationCommand } from "../../domain/usecase/Command";
import to from "await-to-js";
import { NotificationRepository } from "../../domain/model/gateway/NotificationRepository";
import { INotificationUseCase } from "../../domain/usecase/INotificationUseCase";

import { SQSEvent } from "aws-lambda"; 

const sesAdapter: NotificationRepository = new SesEmailAdapter();
const useCase: INotificationUseCase = new NotificationUseCase(sesAdapter);

export const handler = async (event: SQSEvent) => {
  console.log(`[infra.entrypoint.lambda] (handler) send-notification`);

  if (!event?.Records || event.Records.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: 400, message: "Bad Request" }),
    };
  }

  const record = event.Records[0];
  let payload: SendNotificationCommand;

  try {
    payload = JSON.parse(record.body) as SendNotificationCommand;
    return await sendNotification(payload);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: 400, message: "Invalid JSON body" }),
    };
  }
};

const sendNotification = async (payload: SendNotificationCommand) => {
  console.log(`[infra.entrypoint.lambda] (handler) send-notification, payload=[ props:${JSON.stringify(payload)} ]`);
  const [err] = await to(useCase.execute(payload));

  if (err) {
    console.error(`[infra.entrypoint.lambda] (handler) error, unexpected error`, err);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, message: "Failed to send email" }),
    };
  }

  console.log(`[infra.entrypoint.lambda] (handler) notification was successful`);
  return { statusCode: 204 };
};