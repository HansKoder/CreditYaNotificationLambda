"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const SesEmailAdapter_1 = require("../../../src/infrastructure/adapters/SesEmailAdapter");
const client_ses_1 = require("@aws-sdk/client-ses");
// Mock Notification factory
const makeNotification = () => {
    return {
        getDestination: () => "test@example.com",
        getMessage: () => "Hello World",
        getSubject: () => "Greetings",
    };
};
describe("SesEmailAdapter", () => {
    let sandbox;
    let sendStub;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
        sendStub = sandbox.stub(client_ses_1.SESClient.prototype, "send");
    });
    afterEach(() => {
        sandbox.restore();
    });
    it("should send email with correct parameters", async () => {
        sendStub.resolves({}); // simular respuesta exitosa
        const adapter = new SesEmailAdapter_1.SesEmailAdapter("us-east-1");
        const notification = makeNotification();
        await adapter.send(notification);
        sinon_1.default.assert.calledOnce(sendStub);
        const callArg = sendStub.firstCall.args[0];
        // Validar que sea un SendEmailCommand
        expect(callArg).toBeInstanceOf(client_ses_1.SendEmailCommand);
        // Validar contenido del comando
        const input = callArg.input;
        expect(input.Destination.ToAddresses).toEqual(["test@example.com"]);
        expect(input.Message.Body.Text.Data).toBe("Hello World");
        expect(input.Message.Subject.Data).toBe("Greetings");
        expect(input.Source).toBe("noreply@mydomain.com");
    });
    it("should propagate errors from SESClient", async () => {
        sendStub.rejects(new Error("SES failed"));
        const adapter = new SesEmailAdapter_1.SesEmailAdapter("us-east-1");
        const notification = makeNotification();
        await expect(adapter.send(notification)).rejects.toThrow("SES failed");
        sinon_1.default.assert.calledOnce(sendStub);
    });
});
