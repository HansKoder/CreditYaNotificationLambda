import { NotificationUseCase } from "../../domain/usecase/NotificationUseCase";
import { SesEmailAdapter } from "../adapters/SesEmailAdapter";
import { SendNotificationCommand } from "../../domain/usecase/Command";
import to from "await-to-js";
import { NotificationRepository } from "../../domain/model/gateway/NotificationRepository";
import { INotificationUseCase } from "../../domain/usecase/INotificationUseCase";

const sesAdapter: NotificationRepository = new SesEmailAdapter("us-east-1");
const useCase: INotificationUseCase = new NotificationUseCase(sesAdapter);

export const handler = async (event: any) => {
    if (event == null || event == undefined)
        return { statusCode: 500, body: "Bad Request" };

    const props: SendNotificationCommand = {
        'destination': event.destination,
        'message': event.message,
        'subject': event.subject,
        'type': event.type
    }

    const [err, _] = await to(useCase.execute(props));

    if (err) {
        console.error("Error:", err);
        return { statusCode: 500, body: "Failed to send email" }
    }

    return { statusCode: 200, body: "Email sent successfully" };
};
