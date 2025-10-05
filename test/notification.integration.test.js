"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_ses_1 = require("@aws-sdk/client-ses");
const testcontainers_1 = require("testcontainers");
const lambda_1 = require("../src/infrastructure/entrypoints/lambda");
const client_ses_2 = require("@aws-sdk/client-ses");
describe('Notification Integration Test E2E', () => {
    let localstackContainer;
    let sesClient;
    let endpoint;
    beforeAll(async () => {
        localstackContainer = await new testcontainers_1.GenericContainer("localstack/localstack:latest")
            .withEnvironment({ "services": "ses,sqs" }) // Specify the AWS services you need
            .withExposedPorts(4566) // Default LocalStack port
            .start();
        const port = localstackContainer.getMappedPort(4566);
        endpoint = `http://localhost:${port}`;
        sesClient = new client_ses_1.SESClient({
            region: "us-east-1",
            endpoint,
            credentials: {
                accessKeyId: "test",
                secretAccessKey: "test",
            },
        });
        // Crear un email identity en SES localstack (necesario para enviar correos)
        await fetch(`${endpoint}/?_aws_ses_create_identity`, {
            method: "POST",
            headers: { "Content-Type": "application/x-amz-json-1.1" },
            body: JSON.stringify({ EmailAddress: "noreply@mydomain.com" }),
        });
        await sesClient.send(new client_ses_2.VerifyEmailIdentityCommand({ EmailAddress: "noreply@mydomain.com" }));
        await sesClient.send(new client_ses_2.VerifyEmailIdentityCommand({ EmailAddress: "client@test.com" }));
    });
    afterAll(async () => {
        await localstackContainer.stop();
    });
    it("should send email when loan decision event is received", async () => {
        // Simulamos evento desde SQS → Lambda
        const event = {
            Records: [
                {
                    body: JSON.stringify({
                        destination: "client@test.com",
                        subject: "Loan decision",
                        message: "Your loan has been APPROVED",
                        type: "EMAIL"
                    }),
                },
            ],
        };
        const response = await (0, lambda_1.handler)(event); // ejecuta la lambda con el evento
        // Verificamos que SES procesó el correo
        const command = new client_ses_1.SendEmailCommand({
            Source: "noreply@mydomain.com",
            Destination: { ToAddresses: ["client@test.com"] },
            Message: {
                Subject: { Data: "Loan decision" },
                Body: { Text: { Data: "Your loan has been APPROVED" } },
            },
        });
        await expect(sesClient.send(command)).resolves.not.toThrow();
        expect(response.statusCode).toEqual(204);
    });
});
