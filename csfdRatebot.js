const puppeteer = require('puppeteer');
const { setTimeout } = require('timers/promises');

(async () => {
  // Připojení k běžícímu prohlížeči
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222', // URL pro vzdálené ladění
  });

  const page = await browser.newPage();

  // Vypíše ASCII art na začátku
  console.log(`

██████╗███████╗███████╗██████╗     ██████╗  █████╗ ████████╗███████╗██████╗  ██████╗ ████████╗
██╔════╝██╔════╝██╔════╝██╔══██╗    ██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝
██║     ███████╗█████╗  ██║  ██║    ██████╔╝███████║   ██║   █████╗  ██████╔╝██║   ██║   ██║   
██║     ╚════██║██╔══╝  ██║  ██║    ██╔══██╗██╔══██║   ██║   ██╔══╝  ██╔══██╗██║   ██║   ██║   
╚██████╗███████║██║     ██████╔╝    ██║  ██║██║  ██║   ██║   ███████╗██████╔╝╚██████╔╝   ██║   
 ╚═════╝╚══════╝╚═╝     ╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝  ╚═════╝    ╚═╝   
by Vaseekk from baSET                                                                            
  `);

  // Funkce pro dotaz na otázku v konzoli
  async function askQuestion(question) {
    return new Promise((resolve) => {
      process.stdout.write(question);
      process.stdin.once('data', (data) => {
        resolve(data.toString().trim());
      });
    });
  }

  // Function to find the closest value in an array
  function findClosest(arr, val) {
    return arr.reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
  }

  // Dotaz na URL epizody
  const episodeUrl = await askQuestion('Zadejte URL epizody: ');

  // Dotaz na počet opakování
  const repeatCount = await askQuestion('Počet opakování: ');

  await page.goto(episodeUrl);

  for (let i = 0; i < repeatCount; i++) {
    try {
      // Kliknutí na tlačítko pro náhodný výběr hvězdiček
      const hvezdicky = [0, 20, 40, 60, 80, 100];

      const averageRatingElement = await page.waitForSelector('.film-rating-average', { timeout: 5000 });
      const averageRating = await page.evaluate(el => el.textContent, averageRatingElement);

      if (averageRating !== "?" && averageRating !== null) {
        const ratingPercentage = parseInt(averageRating.replace('%', ''));
        const hvezdy = findClosest(hvezdicky, ratingPercentage);
        await page.waitForSelector(`.star.star-${hvezdy}`, { timeout: 5000 });
        await page.click(`.star.star-${hvezdy}`);
      } else {
        const randomHvezda = hvezdicky[Math.floor(Math.random() * hvezdicky.length)];
        await page.waitForSelector(`.star.star-${randomHvezda}`, { timeout: 5000 });
        await page.click(`.star.star-${randomHvezda}`);
      }

      // Přidání náhodného zpoždění mezi 200-500 ms
      await setTimeout(Math.floor(Math.random() * 300) + 300);

      // Kliknutí na šipku pro přechod na další stránku
      await page.waitForSelector('.next-episode', { timeout: 5000 });
      await page.click('.next-episode');

      // Přidání náhodného zpoždění mezi 200-500 ms
      await setTimeout(Math.floor(Math.random() * 300) + 300);

      console.log(`Dokončeno: ${i + 1}/${repeatCount}`);
    } catch (error) {
      console.error(`Chyba na stránce ${i + 1}:`, error);
      break; // Ukončení cyklu v případě chyby
    }
  }

  // Zavření stránky (ne prohlížeče)
  await page.close();
})();