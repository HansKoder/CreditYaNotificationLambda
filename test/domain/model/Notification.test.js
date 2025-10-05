"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationDomainException_1 = require("../../../src/domain/model/exception/NotificationDomainException");
const Notification_1 = require("../../../src/domain/model/Notification");
const DestinationVO_1 = require("../../../src/domain/model/vo/DestinationVO");
const MessageVO_1 = require("../../../src/domain/model/vo/MessageVO");
const SubjectVO_1 = require("../../../src/domain/model/vo/SubjectVO");
const TypeNotificationVO_1 = require("../../../src/domain/model/vo/TypeNotificationVO");
describe("Domain (Model) Notification", () => {
    it("should throw exception because props has an invalid property", () => {
        expect(() => {
            const props = {
                'destination': DestinationVO_1.DestinationVO.create('doe'),
                'message': MessageVO_1.MessageVO.create('Hello, doe'),
                'subject': SubjectVO_1.SubjectVO.create('Congrations!'),
                'type': TypeNotificationVO_1.TypeNotificationVO.create('EMAIL')
            };
            Notification_1.Notification.create(props);
        })
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should add two numbers correctly", () => {
        const props = {
            'destination': DestinationVO_1.DestinationVO.create('doe@gmail.com'),
            'message': MessageVO_1.MessageVO.create('Hello, doe'),
            'subject': SubjectVO_1.SubjectVO.create('Congrations!'),
            'type': TypeNotificationVO_1.TypeNotificationVO.create('EMAIL')
        };
        const domain = Notification_1.Notification.create(props);
        expect(domain).not.toBeUndefined();
        expect(domain).not.toBeNull();
        expect(domain.getDestination()).toEqual('doe@gmail.com');
        expect(domain.getMessage()).toEqual('Hello, doe');
        expect(domain.getSubject()).toEqual('Congrations!');
        expect(domain.getType().getValue()).toEqual(TypeNotificationVO_1.TypeNotification.EMAIL);
    });
});
