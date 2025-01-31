import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Inicia el navegador en modo no sin cabeza
  const page = await browser.newPage();
  
  // Establece las dimensiones de la página
  await page.setViewport({ width: 1280, height: 800 });

  // Navega a una página en blanco
  await page.goto('about:blank');

  // Función para mover el ratón continuamente
  async function moveMouseContinuously() {
    let x = 0;
    let y = 0;
    const increment = 50; // Cuánto se moverá el ratón en cada paso

    while (true) {
      await page.mouse.move(x, y);
      await page.waitForTimeout(1000); // Espera 1 segundo entre movimientos

      x += increment;
      y += increment;

      // Resetea las posiciones si alcanzan el borde de la ventana
      if (x > 1280) x = 0;
      if (y > 800) y = 0;
    }
  }

  // Inicia el movimiento continuo del ratón
  moveMouseContinuously();

  // Cierra el navegador cuando la ventana sea cerrada
  browser.on('disconnected', () => {
    console.log('Navegador cerrado. Terminando el script.');
    process.exit(0);
  });
})();
