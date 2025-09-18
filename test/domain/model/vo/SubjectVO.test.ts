import { NotificationDomainException } from "../../../../src/domain/model/exception/NotificationDomainException";
import { SubjectVO } from "../../../../src/domain/model/vo/SubjectVO";

describe("Domain (ValueObject) DestinationVO", () => {

  it("should throw exception because message is mandatory", () => {
    expect(() => SubjectVO.create(' '))
    .toThrow(NotificationDomainException)
  });

  it("should get a message with successful", () => {
    const vo = SubjectVO.create('Decision Loan - Jhon Doe');

    expect(vo.getValue())
    .toEqual('Decision Loan - Jhon Doe')

  });
  

});