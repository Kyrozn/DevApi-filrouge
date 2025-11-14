import { jest } from "@jest/globals";

jest.mock("./config/db", () => ({
  __esModule: true,
  getDb: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});
