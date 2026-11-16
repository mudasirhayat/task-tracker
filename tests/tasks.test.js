import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("Task Tracker", () => {
  it("should add, complete, and clear tasks", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://mudasirhayat.github.io/task-tracker/" });

    await testdriver.find("the \"What needs doing?\" input field").click();
    await testdriver.type("Buy groceries");
    await testdriver.find("the \"Add task\" button").click();

    const assertAdded = await testdriver.assert("Buy groceries is in the task list and 1 task left is shown");
    expect(assertAdded).toBeTruthy();

    await testdriver.find("the checkbox next to \"Buy groceries\"").click();

    const assertCompleted = await testdriver.assert("Buy groceries is checked and marked as completed, and 0 tasks left is displayed");
    expect(assertCompleted).toBeTruthy();

    await testdriver.find("the \"Clear completed\" button").click();

    const assertCleared = await testdriver.assert("The empty state No tasks yet is visible and 0 tasks left is displayed");
    expect(assertCleared).toBeTruthy();
  });

  it("should filter tasks by active and completed status", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://mudasirhayat.github.io/task-tracker/" });

    await testdriver.find("the \"What needs doing?\" input field").click();
    await testdriver.type("Read book");
    await testdriver.find("the \"Add task\" button").click();

    await testdriver.find("the \"What needs doing?\" input field").click();
    await testdriver.type("Exercise");
    await testdriver.find("the \"Add task\" button").click();

    await testdriver.find("the checkbox next to \"Read book\"").click();

    await testdriver.find("the \"Active\" filter button").click();
    const assertActive = await testdriver.assert("Exercise is visible in the list and Read book is not visible");
    expect(assertActive).toBeTruthy();

    await testdriver.find("the \"Done\" filter button").click();
    const assertDone = await testdriver.assert("Read book is visible in the list and Exercise is not visible");
    expect(assertDone).toBeTruthy();
  });
});
