import { ConsumerGroup } from "kafka-node";

const consumer = new ConsumerGroup({ groupId: "group-1" }, "my-topic");
consumer.on("message", message => {
  // tslint:disable-next-line:no-console
  console.log(message);
});

process.on("SIGTERM", () => {
  // tslint:disable-next-line:no-console
  console.error("Shutting down due to SIGTERM...");
  consumer.close(true, () => {
    process.exit(0);
  });
});
