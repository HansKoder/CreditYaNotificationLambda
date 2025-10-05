"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationDomainException_1 = require("../../../../src/domain/model/exception/NotificationDomainException");
const MessageVO_1 = require("../../../../src/domain/model/vo/MessageVO");
describe("Domain (ValueObject) DestinationVO", () => {
    it("should throw exception because message is mandatory", () => {
        expect(() => MessageVO_1.MessageVO.create(' '))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should throw exception because message is too long", () => {
        expect(() => MessageVO_1.MessageVO.create('a'.repeat(1001)))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should get a message with successful", () => {
        const vo = MessageVO_1.MessageVO.create('Congrulations Jhon Doe, its loan was approved');
        expect(vo.getValue())
            .toEqual('Congrulations Jhon Doe, its loan was approved');
    });
});
