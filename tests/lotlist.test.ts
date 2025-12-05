import "chromedriver";
import { Builder, By, until, WebDriver } from "selenium-webdriver";
// 1. IMPORTANTE: Importar las opciones de chrome
import * as chrome from "selenium-webdriver/chrome";

describe("LotList UI Tests (Selenium)", function () {
  this.timeout(60000); // 60 segundos de timeout está bien

  let driver: WebDriver;

  before(async () => {
    // 2. CONFIGURACIÓN ROBUSTA (Esto arregla el crash)
    const options = new chrome.Options();

    // Argumentos obligatorios para evitar que Chrome se cierre (crashee) en CI/Docker/Linux
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');

    // 3. DETECCIÓN DE ENTORNO
    // Si estamos en Azure/CI (o si quieres probar headless), activamos el modo sin cabeza.
    // Si estás en local, NO entra aquí y podrás ver la ventana.
    if (process.env.CI === 'true') {
        options.addArguments('--headless=new'); 
        options.addArguments('--window-size=1920,1080'); // Asegura tamaño de pantalla virtual
    }

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options) // Aplicamos las opciones aquí
        .build();
  });

  // 4. LIMPIEZA SEGURA
  // Descomenta esto. Es importante cerrar el navegador al terminar.
  after(async () => {
    if (driver) {
        await driver.quit();
    }
  });

  it("should show loading spinner on load", async () => {
    // Asegúrate de que tu servidor esté corriendo en otra terminal (npm run dev)
    await driver.get("http://localhost:3000/");

    const spinner = await driver.wait(
      until.elementLocated(By.css("[data-testid='loading-spinner']")),
      5000
    );

    if (!spinner) throw new Error("Spinner de carga no encontrado");
  });

  it("should load lot list and display lote cards", async () => {
    // Esperamos a que el spinner desaparezca
    const spinner = await driver.findElement(By.css("[data-testid='loading-spinner']"));
    await driver.wait(until.stalenessOf(spinner), 8000);

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