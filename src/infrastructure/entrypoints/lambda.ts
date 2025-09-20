import { NotificationUseCase } from "../../domain/usecase/NotificationUseCase";
import { SesEmailAdapter } from "../adapters/SesEmailAdapter";
import { SendNotificationCommand } from "../../domain/usecase/Command";
import to from "await-to-js";
import { NotificationRepository } from "../../domain/model/gateway/NotificationRepository";
import { INotificationUseCase } from "../../domain/usecase/INotificationUseCase";

import { SQSEvent } from "aws-lambda"; 

const sesAdapter: NotificationRepository = new SesEmailAdapter("us-east-1");
const useCase: INotificationUseCase = new NotificationUseCase(sesAdapter);

export const handler = async (event: SQSEvent) => {
    console.log(`[infra.entrypoint.lambda] (handler) send-notification`)

    if (!event?.Records || event.Records.length === 0) {
        console.log(`[infra.entrypoint.lambda] (handler) error=event must be mandatory return bad request`);
        return { statusCode: 400, body: "Bad Request" };
    }

    const record = event.Records[0];
    let payload: SendNotificationCommand;

    try {
        payload = JSON.parse(record.body) as SendNotificationCommand;
        return await sendNotification(payload);
    } catch (err) {
        console.log(`[infra.entrypoint.lambda] (handler) error=invalid JSON body, Payload=[ body:${record.body} ]`);
        return { statusCode: 400, body: "Invalid JSON body" };
    }
};


const sendNotification = async (payload: SendNotificationCommand) => {
    console.log(`[infra.entrypoint.lambda] (handler) send-notification, payload=[ props:${JSON.stringify(payload)} ]`)
    const [err, _] = await to(useCase.execute(payload));

    if (err) {
        console.log(`[infra.entrypoint.lambda] (handler) error, un expectected error, Payload=[ err:${err} ]`)
        return { statusCode: 500, body: "Failed to send email" }
    }

    console.log(`[infra.entrypoint.lambda] (handler) notification was successful`)
    return { statusCode: 200, body: "Email sent successfully" };
}