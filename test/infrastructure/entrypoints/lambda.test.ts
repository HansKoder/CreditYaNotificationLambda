
import sinon from "sinon";
import { NotificationUseCase } from "../../../src/domain/usecase/NotificationUseCase";
import { handler } from "../../../src/infrastructure/entrypoints/lambda";
import { SQSEvent } from "aws-lambda";

jest.mock("../../../src/infrastructure/adapters/SesEmailAdapter");

let sandbox: sinon.SinonSandbox;

describe("NotificationLambda handler", () => {

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore(); // Clean stubs/spies
  });

it("should return 400 when event is null", async () => {
  const response = await handler(null as unknown as SQSEvent);

  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body as string)).toEqual({
    status: 400,
    message: "Bad Request",
  });
});

it("should return 400 when Records array is empty", async () => {
  const emptyEvent: SQSEvent = { Records: [] } as unknown as SQSEvent;

  const response = await handler(emptyEvent);

  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body as string)).toEqual({
    status: 400,
    message: "Bad Request",
  });
});

it("should return 500 when usecase fails", async () => {
  const stub = sandbox.stub(NotificationUseCase.prototype, "execute")
    .rejects(new Error("Use case failed"));

  const sqsEvent: SQSEvent = {
    Records: [
      {
        messageId: "1",
        receiptHandle: "abc",
        body: JSON.stringify({
          destination: "test@example.com",
          message: "Hello",
          subject: "Hi",
          type: "EMAIL",
        }),
      },
    ],
  } as unknown as SQSEvent;

  const response = await handler(sqsEvent);

  expect(response.statusCode).toBe(500);
  expect(JSON.parse(response.body as string)).toEqual({
    status: 500,
    message: "Failed to send email",
  });

  sinon.assert.calledOnce(stub);
});

it("should return 204 when usecase succeeds", async () => {
  const stub = sandbox.stub(NotificationUseCase.prototype, "execute")
    .resolves();

  const sqsEvent: SQSEvent = {
    Records: [
      {
        messageId: "1",
        receiptHandle: "abc",
        body: JSON.stringify({
          destination: "test@example.com",
          message: "Hello",
          subject: "Hi",
          type: "EMAIL",
        }),
      },
    ],
  } as unknown as SQSEvent;

  const response = await handler(sqsEvent);

  expect(response.statusCode).toBe(204);
  expect(response.body).toBeUndefined();

  sinon.assert.calledOnce(stub);
});

it("should return 400 when payload event has an invalid format", async () => {
  const stub = sandbox.stub(NotificationUseCase.prototype, "execute").resolves();

  const sqsEvent: SQSEvent = {
    Records: [
      {
        messageId: "1",
        receiptHandle: "abc",
        body: "{ invalidJson: }",
      },
    ],
  } as unknown as SQSEvent;

  const response = await handler(sqsEvent);

  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body as string)).toEqual({
    status: 400,
    message: "Invalid JSON body",
  });

  sinon.assert.notCalled(stub);
});


});