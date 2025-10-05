"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationDomainException_1 = require("../../../../src/domain/model/exception/NotificationDomainException");
const DestinationVO_1 = require("../../../../src/domain/model/vo/DestinationVO");
describe("Domain (ValueObject) DestinationVO", () => {
    it("should throw exception because destination is mandatory", () => {
        expect(() => DestinationVO_1.DestinationVO.create(' '))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should throw exception because destination has an invalid format", () => {
        expect(() => DestinationVO_1.DestinationVO.create('invalid.format'))
            .toThrow(NotificationDomainException_1.NotificationDomainException);
    });
    it("should get destination as a email with valid format", () => {
        const vo = DestinationVO_1.DestinationVO.create('doe@gmail.com');
        expect(vo.getValue())
            .toEqual('doe@gmail.com');
    });
});
