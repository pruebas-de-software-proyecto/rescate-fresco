import { Builder, By, WebDriver, until } from "selenium-webdriver";
import "chromedriver";

describe("Register Test - Tienda", function () {
  this.timeout(60000);

  let driver: WebDriver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should register a tienda successfully", async () => {
    await driver.get("http://localhost:3000/register");

    // Cambiar a rol Tienda
    const tiendaButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Quiero Vender')]")),
      10000
    );
    await tiendaButton.click();

    // Esperar a que aparezca el formulario de tienda
    await driver.wait(until.elementLocated(By.id("nombreTienda")), 8000);

    // Completar formulario
    await driver.findElement(By.id("nombreTienda")).sendKeys("Panadería Tester");
    await driver.findElement(By.id("email")).sendKeys("tienda" + Date.now() + "@test.com");
    await driver.findElement(By.id("password")).sendKeys("123456");

    // Click en registrar
    const registerBtn = await driver.findElement(By.id("btn-register"));
    await registerBtn.click();

    // ⬇️ MANEJO DE ALERTA — evita UnexpectedAlertOpenError
    await driver.wait(until.alertIsPresent(), 8000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    console.log("ALERTA:", alertText);
    await alert.accept();

    // ⬇️ Esperar a que redirija al login
    await driver.wait(until.urlContains("/login"), 10000);

    const url = await driver.getCurrentUrl();

    if (!url.includes("/login")) {
      throw new Error(`Registro falló: la URL actual es ${url}`);
    }

    console.log("✓ Registro de tienda correcto, redirigido al login:", url);
  });
});
