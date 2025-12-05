import { Builder, By, WebDriver, until } from "selenium-webdriver";
import "chromedriver";

describe("Register Test - Consumidor", function () {
  this.timeout(40000);

  let driver: WebDriver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should register a consumidor successfully", async () => {
    await driver.get("http://localhost:3000/register");

    // Esperar carga del formulario consumidor
    await driver.wait(until.elementLocated(By.id("nombreConsumidor")), 8000);

    // Completar datos
    await driver.findElement(By.id("nombreConsumidor")).sendKeys("Juan Tester");
    await driver.findElement(By.id("email")).sendKeys("consumidor" + Date.now() + "@test.com");
    await driver.findElement(By.id("password")).sendKeys("123456");

    // Click en registrar
    const registerBtn = await driver.findElement(By.id("btn-register"));
    await registerBtn.click();

    // ⬇️ MANEJO DE ALERTA  
    await driver.wait(until.alertIsPresent(), 8000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    console.log("ALERTA:", alertText);
    await alert.accept();

    // ⬇️ Esperar redirección
    await driver.wait(until.urlContains("/login"), 10000);

    const url = await driver.getCurrentUrl();

    if (!url.includes("/login")) {
      throw new Error(`Registro falló: la URL actual es ${url}`);
    }

    console.log("✓ Registro de consumidor correcto, redirigido al login:", url);
  });
});
