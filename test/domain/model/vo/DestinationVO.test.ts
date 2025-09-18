import { NotificationDomainException } from "../../../../src/domain/model/exception/NotificationDomainException";
import { DestinationVO } from "../../../../src/domain/model/vo/DestinationVO";

describe("Domain (ValueObject) DestinationVO", () => {

  it("should throw exception because destination is mandatory", () => {
    expect(() => DestinationVO.create(' '))
    .toThrow(NotificationDomainException)
  });
    
  it("should throw exception because destination has an invalid format", () => {
    expect(() => DestinationVO.create('invalid.format'))
    .toThrow(NotificationDomainException)
  });

  it("should get destination as a email with valid format", () => {
    const vo = DestinationVO.create('doe@gmail.com');

    expect(vo.getValue())
    .toEqual('doe@gmail.com')

  });

  

});