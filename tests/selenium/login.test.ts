import { Builder, By, until } from "selenium-webdriver";

async function testLogin() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // URL de tu login
    await driver.get("http://localhost:5173/login");

    const emailInput = await driver.wait(
      until.elementLocated(By.id("email")),
      5000
    );

    const passwordInput = await driver.findElement(By.id("password"));
    const loginButton = await driver.findElement(By.id("login-btn"));

    await emailInput.sendKeys("admin@example.com");
    await passwordInput.sendKeys("123456");
    await loginButton.click();

    // Esperar redirección
    await driver.wait(until.urlContains("/dashboard"), 5000);

    console.log("✔ Login test PASSED");
  } catch (error) {
    console.error("Login test FAILED:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

testLogin();
