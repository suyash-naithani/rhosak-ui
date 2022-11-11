import { addHours } from "date-fns";
import type { KafkaInstance } from "../../types";

const now = new Date().toISOString();
const future = addHours(new Date(), 19).toISOString();

export const instances: KafkaInstance[] = [
  {
    id: "1",
    name: "foo",
    createdAt: now,
    updatedAt: now,
    expiryDate: undefined,
    owner: "foo-owner",
    provider: "aws",
    region: "region",
    status: "preparing",
    plan: "standard",
    size: "1",
    ingress: undefined,
    egress: undefined,
    storage: undefined,
    maxPartitions: undefined,
    connections: undefined,
    connectionRate: undefined,
    messageSize: undefined,
    billing: undefined,
  },
  {
    id: "2",
    name: "bar",
    createdAt: now,
    updatedAt: now,
    expiryDate: future,
    owner: "bar-owner",
    provider: "aws",
    region: "region",
    status: "deleting",
    plan: "developer",
    size: "1",
    ingress: undefined,
    egress: undefined,
    storage: undefined,
    maxPartitions: undefined,
    connections: undefined,
    connectionRate: undefined,
    messageSize: undefined,
    billing: undefined,
  },
  {
    id: "3",
    name: "baz",
    createdAt: now,
    updatedAt: now,
    expiryDate: future,
    owner: "baz-owner",
    provider: "aws",
    region: "region",
    status: "ready",
    plan: "developer",
    size: "1",
    ingress: undefined,
    egress: undefined,
    storage: undefined,
    maxPartitions: undefined,
    connections: undefined,
    connectionRate: undefined,
    messageSize: undefined,
    billing: undefined,
  },
  {
    id: "4",
    name: "qux",
    createdAt: now,
    updatedAt: now,
    expiryDate: future,
    owner: "qux-owner",
    provider: "aws",
    region: "region",
    status: "provisioning",
    plan: "developer",
    size: "1",
    ingress: undefined,
    egress: undefined,
    storage: undefined,
    maxPartitions: undefined,
    connections: undefined,
    connectionRate: undefined,
    messageSize: undefined,
    billing: undefined,
  },
];
