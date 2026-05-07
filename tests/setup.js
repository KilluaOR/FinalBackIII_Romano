import { beforeAll, afterEach, afterAll, jest } from "@jest/globals";

beforeAll(() => {
  process.env.NODE_ENV = "test";
  process.env.MONGODB_URI = "mongodb://test:test@localhost:27017/adoption_test";
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});
