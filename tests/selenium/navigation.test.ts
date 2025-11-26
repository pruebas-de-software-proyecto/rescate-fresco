import { Builder, By, until } from "selenium-webdriver";

async function testNavigation() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:5173");

    const link = await driver.wait(
      until.elementLocated(By.linkText("Productos")),
      5000
    );

    await link.click();

    await driver.wait(until.urlContains("/productos"), 5000);

    console.log("✔ Navigation test PASSED");
  } catch (error) {
    console.error("❌ Navigation test FAILED:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

testNavigation();
