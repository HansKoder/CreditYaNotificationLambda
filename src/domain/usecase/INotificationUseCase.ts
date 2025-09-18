import { SendNotificationCommand } from "./Command";

export interface INotificationUseCase {
    execute(command: SendNotificationCommand): Promise<void>;
}