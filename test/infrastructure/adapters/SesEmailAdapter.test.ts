import sinon from "sinon";
import { SesEmailAdapter } from "../../../src/infrastructure/adapters/SesEmailAdapter";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Notification } from "../../../src/domain/model/Notification";

// Mock Notification factory
const makeNotification = () => {
  return {
    getDestination: () => "test@example.com",
    getMessage: () => "Hello World",
    getSubject: () => "Greetings",
  } as unknown as Notification;
};

describe("SesEmailAdapter", () => {
  let sandbox: sinon.SinonSandbox;
  let sendStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sendStub = sandbox.stub(SESClient.prototype, "send");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should send email with correct parameters", async () => {
    sendStub.resolves({}); // simular respuesta exitosa

    const adapter = new SesEmailAdapter("us-east-1");
    const notification = makeNotification();

    await adapter.send(notification);

    sinon.assert.calledOnce(sendStub);
    const callArg = sendStub.firstCall.args[0];

    // Validar que sea un SendEmailCommand
    expect(callArg).toBeInstanceOf(SendEmailCommand);

    // Validar contenido del comando
    const input: any = callArg.input;
    expect(input.Destination.ToAddresses).toEqual(["test@example.com"]);
    expect(input.Message.Body.Text.Data).toBe("Hello World");
    expect(input.Message.Subject.Data).toBe("Greetings");
    expect(input.Source).toBe("noreply@mydomain.com");
  });

  it("should propagate errors from SESClient", async () => {
    sendStub.rejects(new Error("SES failed"));

    const adapter = new SesEmailAdapter("us-east-1");
    const notification = makeNotification();

    await expect(adapter.send(notification)).rejects.toThrow("SES failed");
    sinon.assert.calledOnce(sendStub);
  });
});
