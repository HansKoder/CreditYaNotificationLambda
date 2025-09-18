import { NotificationDomainException } from "../../../src/domain/model/exception/NotificationDomainException";
import { NotificationRepository } from "../../../src/domain/model/gateway/NotificationRepository";
import { SendNotificationCommand } from "../../../src/domain/usecase/Command";
import { NotificationUseCase } from "../../../src/domain/usecase/NotificationUseCase";


describe("Domain (Model) Notification", () => {
  it("should throw exception because props has an invalid property", async () => {
    
    const mockEmailService: NotificationRepository = { send: jest.fn().mockResolvedValue(undefined) };

    const usecase = new NotificationUseCase(mockEmailService);

    const props: SendNotificationCommand = {
        destination: "deo@gmail.com",
        message: "hello",
        subject: "hello",
        type: "UNKNOWN"
    };

    await expect(usecase.execute(props))
        .rejects
        .toThrow(NotificationDomainException);

    });
});