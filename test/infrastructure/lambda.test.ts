
import sinon from "sinon";
import { NotificationUseCase } from "../../src/domain/usecase/NotificationUseCase";
import { handler } from "../../src/infrastructure/entrypoints/lambda";

jest.mock("../../src/infrastructure/adapters/SesEmailAdapter");

let sandbox: sinon.SinonSandbox;

describe("NotificationLambda handler", () => {

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore(); // Clean stubs/spies
  });

  it("should return 500 when event is null", async () => {
    const response = await handler(null);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe("Bad Request");
  });

  it("should return 500 when usecase fails", async () => {
    const stub = sandbox.stub(NotificationUseCase.prototype, "execute")
      .rejects(new Error("Use case failed"));

    const response = await handler({
      destination: "test@example.com",
      message: "Hello",
      subject: "Hi",
      type: "EMAIL"
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe("Failed to send email");

    sinon.assert.calledOnce(stub);
  });


  it("should return 200 when usecase succeeds", async () => {
    const stub = sandbox.stub(NotificationUseCase.prototype, "execute")
      .resolves();

    const response = await handler({
      destination: "test@example.com",
      message: "Hello",
      subject: "Hi",
      type: "EMAIL"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Email sent successfully");

    sinon.assert.calledOnce(stub);
  });

});