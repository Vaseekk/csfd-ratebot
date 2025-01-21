const puppeteer = require('puppeteer');

(async () => {
  // Připojení k běžícímu prohlížeči
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222', // URL pro vzdálené ladění
  });

  const page = await browser.newPage();

  // Otevření stránky CSFD
  await page.goto('https://www.csfd.cz/film/169530-one-piece/713995-ore-wa-luffy-kaizoku-o-ni-naru-otoko-da/hraji/'); //prepiste od jake stranky chcete zacit

  for (let i = 0; i <= 200; i++) {
    try {
      // Kliknutí na tlačítko pro náhodný výběr hvězdiček
      const hvezdicky = [60, 80, 100];
      const randomHvezda = hvezdicky[Math.floor(Math.random() * hvezdicky.length)];
      await page.waitForSelector(`.star.star-${randomHvezda}`, { timeout: 5000 });
      await page.click(`.star.star-${randomHvezda}`);

      // Kliknutí na šipku pro přechod na další stránku
      await page.waitForSelector('.next-episode', { timeout: 5000 });
      await page.click('.next-episode');

      console.log(`Dokončeno: ${i + 1}/200`);
    } catch (error) {
      console.error(`Chyba na stránce ${i + 1}:`, error);
      break; // Ukončení cyklu v případě chyby
    }
  }

  // Zavření stránky (ne prohlížeče)
  await page.close();
})();
