import { KafkaClient, Producer } from "kafka-node";

const client = new KafkaClient({ kafkaHost: "localhost:9092" });

const producer = new Producer(client, { partitionerType: 2 });

setInterval(() => {
  producer.send(
    [
      {
        messages: "my-message",
        topic: "my-topic"
      }
    ],
    (err, data) => {
      // NOOP
    }
  );
}, 1000);

process.on("SIGTERM", () => {
  // tslint:disable-next-line:no-console
  console.error("Shutting down due to SIGTERM...");
  producer.close(() => {
    process.exit(0);
  });
});
