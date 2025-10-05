"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationDomainException_1 = require("../../../../src/domain/model/exception/NotificationDomainException");
const TypeNotificationVO_1 = require("../../../../src/domain/model/vo/TypeNotificationVO");
describe("Domain (ValueObject) Type Notification", () => {
    it("should throw exception because type is mandatory", () => {
        expect(() => TypeNotificationVO_1.TypeNotificationVO.create(' '))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should throw exception because tyhpe is unknown", () => {
        expect(() => TypeNotificationVO_1.TypeNotificationVO.create('unknown'))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should get a message with successful", () => {
        const vo = TypeNotificationVO_1.TypeNotificationVO.create('EMAIL');
        expect(vo.getValue())
            .toEqual(TypeNotificationVO_1.TypeNotification.EMAIL);
    });
});
