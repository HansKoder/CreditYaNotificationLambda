"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const NotificationUseCase_1 = require("../../../src/domain/usecase/NotificationUseCase");
const lambda_1 = require("../../../src/infrastructure/entrypoints/lambda");
jest.mock("../../../src/infrastructure/adapters/SesEmailAdapter");
let sandbox;
describe("NotificationLambda handler", () => {
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
    });
    afterEach(() => {
        sandbox.restore(); // Clean stubs/spies
    });
    it("should return 400 when event is null", async () => {
        const response = await (0, lambda_1.handler)(null);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({
            status: 400,
            message: "Bad Request",
        });
    });
    it("should return 400 when Records array is empty", async () => {
        const emptyEvent = { Records: [] };
        const response = await (0, lambda_1.handler)(emptyEvent);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({
            status: 400,
            message: "Bad Request",
        });
    });
    it("should return 500 when usecase fails", async () => {
        const stub = sandbox.stub(NotificationUseCase_1.NotificationUseCase.prototype, "execute")
            .rejects(new Error("Use case failed"));
        const sqsEvent = {
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
        };
        const response = await (0, lambda_1.handler)(sqsEvent);
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual({
            status: 500,
            message: "Failed to send email",
        });
        sinon_1.default.assert.calledOnce(stub);
    });
    it("should return 204 when usecase succeeds", async () => {
        const stub = sandbox.stub(NotificationUseCase_1.NotificationUseCase.prototype, "execute")
            .resolves();
        const sqsEvent = {
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
        };
        const response = await (0, lambda_1.handler)(sqsEvent);
        expect(response.statusCode).toBe(204);
        expect(response.body).toBeUndefined();
        sinon_1.default.assert.calledOnce(stub);
    });
    it("should return 400 when payload event has an invalid format", async () => {
        const stub = sandbox.stub(NotificationUseCase_1.NotificationUseCase.prototype, "execute").resolves();
        const sqsEvent = {
            Records: [
                {
                    messageId: "1",
                    receiptHandle: "abc",
                    body: "{ invalidJson: }",
                },
            ],
        };
        const response = await (0, lambda_1.handler)(sqsEvent);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({
            status: 400,
            message: "Invalid JSON body",
        });
        sinon_1.default.assert.notCalled(stub);
    });
});
