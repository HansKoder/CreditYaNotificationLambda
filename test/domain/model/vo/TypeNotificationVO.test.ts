import { NotificationDomainException } from "../../../../src/domain/model/exception/NotificationDomainException";
import { SubjectVO } from "../../../../src/domain/model/vo/SubjectVO";
import { TypeNotification, TypeNotificationVO } from "../../../../src/domain/model/vo/TypeNotificationVO";

describe("Domain (ValueObject) Type Notification", () => {

  it("should throw exception because type is mandatory", () => {
    expect(() => TypeNotificationVO.create(' '))
    .toThrow(NotificationDomainException)
  });

  it("should throw exception because tyhpe is unknown", () => {
    expect(() => TypeNotificationVO.create('unknown'))
    .toThrow(NotificationDomainException)
  });

  it("should get a message with successful", () => {
    const vo = TypeNotificationVO.create('EMAIL');

    expect(vo.getValue())
    .toEqual(TypeNotification.EMAIL)

  });
  

});