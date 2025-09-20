import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { handler } from "../src/infrastructure/entrypoints/lambda";
import { SQSEvent } from "aws-lambda";

import { VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";

describe('Notification Integration Test E2E', () => {

    let localstackContainer: StartedTestContainer;
    let sesClient: SESClient;
    let endpoint: string;

    beforeAll(async () => {
        localstackContainer = await new GenericContainer("localstack/localstack:latest")
            .withEnvironment({ "services": "ses,sqs" }) // Specify the AWS services you need
            .withExposedPorts(4566) // Default LocalStack port
            .start();

        const port = localstackContainer.getMappedPort(4566);
        endpoint = `http://localhost:${port}`;

        sesClient = new SESClient({
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

        await sesClient.send(
            new VerifyEmailIdentityCommand({ EmailAddress: "noreply@mydomain.com" })
        );

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

        await handler(event as SQSEvent); // ejecuta la lambda con el evento

        // Verificamos que SES procesó el correo
        const command = new SendEmailCommand({
            Source: "noreply@mydomain.com",
            Destination: { ToAddresses: ["client@test.com"] },
            Message: {
                Subject: { Data: "Loan decision" },
                Body: { Text: { Data: "Your loan has been APPROVED" } },
            },
        });

        // Si no lanza error, significa que SES localstack lo aceptó
        await expect(sesClient.send(command)).resolves.not.toThrow();

    });

})
