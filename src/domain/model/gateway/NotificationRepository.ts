import { Notification } from "../Notification";

export interface NotificationRepository {
    send(domain: Notification): Promise<void>;
}