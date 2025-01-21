const puppeteer = require('puppeteer');

(async () => {
   //Připojení k běžícímu prohlížeči
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

  // Dotaz na URL epizody
  const episodeUrl = await askQuestion('Zadejte URL epizody: ');

  // Dotaz na počet opakování
  const repeatCount = await askQuestion('Počet opakování: ');

  await page.goto(episodeUrl); 

  for (let i = 0; i < repeatCount; i++) {
    try {
      // Kliknutí na tlačítko pro náhodný výběr hvězdiček
      const hvezdicky = [60, 80, 100];
      const randomHvezda = hvezdicky[Math.floor(Math.random() * hvezdicky.length)];
      await page.waitForSelector(`.star.star-${randomHvezda}`, { timeout: 5000 });
      await page.click(`.star.star-${randomHvezda}`);

      // Kliknutí na šipku pro přechod na další stránku
      await page.waitForSelector('.next-episode', { timeout: 5000 });
      await page.click('.next-episode');

      console.log(`Dokončeno: ${i + 1}/${repeatCount}`);
    } catch (error) {
      console.error(`Chyba na stránce ${i + 1}:`, error);
      break; // Ukončení cyklu v případě chyby
    }
  }

  // Zavření stránky (ne prohlížeče)
  await page.close();

  // Funkce pro dotaz na otázku v konzoli
  async function askQuestion(question) {
    return new Promise((resolve) => {
      process.stdout.write(question);
      process.stdin.once('data', (data) => {
        resolve(data.toString().trim());
      });
    });
  }
})();
