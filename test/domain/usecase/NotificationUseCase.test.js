"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationDomainException_1 = require("../../../src/domain/model/exception/NotificationDomainException");
const NotificationUseCase_1 = require("../../../src/domain/usecase/NotificationUseCase");
describe("Domain (Model) Notification", () => {
    it("should throw exception because props has an invalid property", async () => {
        const mockEmailService = { send: jest.fn().mockResolvedValue(undefined) };
        const usecase = new NotificationUseCase_1.NotificationUseCase(mockEmailService);
        const props = {
            destination: "deo@gmail.com",
            message: "hello",
            subject: "hello",
            type: "UNKNOWN"
        };
        await expect(usecase.execute(props))
            .rejects
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
});
