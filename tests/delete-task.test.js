import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("Task deletion", () => {
  it("deleting a task should remove it permanently and update the task count", async (context) => {
    const testdriver = TestDriver(context);
    await testdriver.provision.chrome({ url: process.env.TEST_URL || "https://robot-start-quote-jose.trycloudflare.com" });

    await testdriver.find("Task input field with placeholder \"What needs doing?\"").click();
    await testdriver.type("Buy groceries");
    await testdriver.find("Add task button").click();

    await testdriver.find("Delete button ✕ next to \"Buy groceries\"").click();

    // Verify task count updates after deletion
    const counterAssert = await testdriver.assert("the task counter displays '0 tasks left'");
    expect(counterAssert).toBeTruthy();

    // Switching filters should not bring back the deleted task
    await testdriver.find("\"All\" filter button").click();
    const taskGoneAssert = await testdriver.assert("the task 'Buy groceries' is not visible");
    expect(taskGoneAssert).toBeTruthy();
  });
});
