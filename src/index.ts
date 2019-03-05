import { ConsumerGroup, KafkaClient, Producer } from "kafka-node";

const MESSAGE = { foo: { bar: "baz" }, type: "foo" };
const TOPIC = "my-topic";
const GROUP_ID = "my-group-id";
const client = new KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new Producer(client);
const consumer = new ConsumerGroup(
  { kafkaHost: "localhost:9092", groupId: GROUP_ID },
  TOPIC
);

consumer.on("message", message => {
  throw new Error("nope");
  // tslint:disable-next-line:no-console
  console.log(message.value);
});
consumer.on("error", error => {
  // tslint:disable-next-line:no-console
  console.error(error);
});

setInterval(() => {
  producer.send(
    [
      {
        messages: JSON.stringify(MESSAGE),
        topic: TOPIC
      }
    ],
    (err, data) => {
      // NOOP
    }
  );
}, 1000);

process.on("SIGINT", () => {
  stop();
});
process.on("SIGTERM", () => {
  stop();
});

const stop = () => {
  // tslint:disable-next-line:no-console
  console.error("Shutting down due to SIGTERM...");
  producer.close(() => {
    consumer.close(() => {
      process.exit(0);
    });
  });
};
