"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationDomainException_1 = require("../../../../src/domain/model/exception/NotificationDomainException");
const SubjectVO_1 = require("../../../../src/domain/model/vo/SubjectVO");
describe("Domain (ValueObject) DestinationVO", () => {
    it("should throw exception because message is mandatory", () => {
        expect(() => SubjectVO_1.SubjectVO.create(' '))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should throw exception because message is loo long", () => {
        expect(() => SubjectVO_1.SubjectVO.create('a'.repeat(101)))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should get a message with successful", () => {
        const vo = SubjectVO_1.SubjectVO.create('Decision Loan - Jhon Doe');
        expect(vo.getValue())
            .toEqual('Decision Loan - Jhon Doe');
    });
});
