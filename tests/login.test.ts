import { Builder, By, WebDriver, until } from "selenium-webdriver";
import "chromedriver";

describe("Login Test", function () {
  this.timeout(60000);

  let driver: WebDriver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("should login successfully", async () => {
    try {
      await driver.get("http://localhost:3000/login");

      const emailInput = await driver.wait(
        until.elementLocated(By.id("email")),
        10000
      );
      await emailInput.sendKeys("test@example.com");

      const passInput = await driver.wait(
        until.elementLocated(By.id("password")),
        10000
      );
      await passInput.sendKeys("123456");

      const loginBtn = await driver.wait(
        until.elementLocated(By.id("btn-login")),
        10000
      );
      await loginBtn.click();

      // ⬇️ Cambiado: ahora esperamos que NO esté más en /login
      await driver.wait(
        async () => {
          const current = await driver.getCurrentUrl();
          return !current.includes("/login");
        },
        15000,
        "No redirigió fuera de /login"
      );

      const url = await driver.getCurrentUrl();

      if (url !== "http://localhost:3000/") {
        throw new Error(`Redirigió a una ruta inesperada: ${url}`);
      }

      console.log("✓ Login exitoso, redirigido a Home:", url);

    } catch (error) {
      const screenshot = await driver.takeScreenshot();
      console.log("Screenshot:", screenshot.substring(0, 100) + "...");
      throw error;
    }
  });
});
