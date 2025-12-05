import { Builder, By, until, WebDriver } from "selenium-webdriver";
import "chromedriver";

describe("LotList UI Tests (Selenium)", function () {
  this.timeout(60000);

  let driver: WebDriver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should show loading spinner on load", async () => {
    await driver.get("http://localhost:3000/");

    const spinner = await driver.wait(
      until.elementLocated(By.css("[data-testid='loading-spinner']")),
      5000
    );

    if (!spinner) throw new Error("Spinner de carga no encontrado");
  });

  it("should load lot list and display lote cards", async () => {
    await driver.wait(
      until.stalenessOf(
        await driver.findElement(By.css("[data-testid='loading-spinner']"))
      ),
      8000
    );

    const cards = await driver.findElements(By.css("[data-testid='lote-card']"));

    if (cards.length === 0) {
      throw new Error("No se encontraron lotes renderizados");
    }
  });

  it("should navigate to detail page when clicking Ver detalle", async () => {
    const botones = await driver.findElements(
      By.css("[data-testid='btn-detalle']")
    );

    if (botones.length === 0) {
      throw new Error("Botón Ver detalle no encontrado");
    }

    await botones[0].click();

    await driver.wait(until.urlContains("/lotes/"), 5000);

    const url = await driver.getCurrentUrl();
    if (!url.includes("/lotes/")) {
      throw new Error("No navegó correctamente al detalle del lote");
    }
  });
});
