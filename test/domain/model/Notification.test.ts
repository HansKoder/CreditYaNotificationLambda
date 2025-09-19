import { NotificationDomainException } from "../../../src/domain/model/exception/NotificationDomainException";
import { Notification, NotificationProps } from "../../../src/domain/model/Notification";
import { DestinationVO } from "../../../src/domain/model/vo/DestinationVO";
import { MessageVO } from "../../../src/domain/model/vo/MessageVO";
import { SubjectVO } from "../../../src/domain/model/vo/SubjectVO";
import { TypeNotification, TypeNotificationVO } from "../../../src/domain/model/vo/TypeNotificationVO";

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

    expect(domain.getDestination()).toEqual('doe@gmail.com');
    expect(domain.getMessage()).toEqual('Hello, doe');
    expect(domain.getSubject()).toEqual('Congrations!');
    expect(domain.getType().getValue()).toEqual(TypeNotification.EMAIL);
  });
});