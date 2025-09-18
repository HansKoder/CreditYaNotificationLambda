export interface SendNotificationCommand {
    type: string,
    destination: string,
    message: string,
    subject: string
}
