import { NotificationDomainException } from "../../../../src/domain/model/exception/NotificationDomainException";
import { MessageVO } from "../../../../src/domain/model/vo/MessageVO";

describe("Domain (ValueObject) DestinationVO", () => {

  it("should throw exception because message is mandatory", () => {
    expect(() => MessageVO.create(' '))
    .toThrow(NotificationDomainException)
  });

  it("should get a message with successful", () => {
    const vo = MessageVO.create('Congrulations Jhon Doe, its loan was approved');

    expect(vo.getValue())
    .toEqual('Congrulations Jhon Doe, its loan was approved')

  });
  

});