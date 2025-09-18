import { NotificationDomainException } from "../../../src/domain/model/exception/NotificationDomainException";
import { Notification, NotificationProps } from "../../../src/domain/model/Notification";
import { DestinationVO } from "../../../src/domain/model/vo/DestinationVO";
import { MessageVO } from "../../../src/domain/model/vo/MessageVO";
import { SubjectVO } from "../../../src/domain/model/vo/SubjectVO";
import { TypeNotificationVO } from "../../../src/domain/model/vo/TypeNotificationVO";

describe("Domain (Model) Notification", () => {
  it("should throw exception because props has an invalid property", () => {
    
    expect(() => {
      const props: NotificationProps = {
        'destination': DestinationVO.create('doe'),
        'message': MessageVO.create('Hello, doe'),
        'subject': SubjectVO.create('Congrations!'),
        'type': TypeNotificationVO.create('EMAIL')
      } 

      Notification.create(props)
    })
    .toThrow(NotificationDomainException)
  });

  it("should add two numbers correctly", () => {
    const props: NotificationProps = {
        'destination': DestinationVO.create('doe@gmail.com'),
        'message': MessageVO.create('Hello, doe'),
        'subject': SubjectVO.create('Congrations!'),
        'type': TypeNotificationVO.create('EMAIL')
    }

    const domain = Notification.create(props);

    expect(domain).not.toBeUndefined();
    expect(domain).not.toBeNull();
  });
});