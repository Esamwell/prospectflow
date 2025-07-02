import puppeteer from 'puppeteer';

export async function scrapeGoogleMaps({ categoria, cidade, estado, maxResults = 20 }) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const query = `${categoria} em ${cidade} ${estado}`;
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  console.log('Iniciando scraping:', query);

  // User-agent realista
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000); // Espera extra para garantir carregamento

  // Scroll dinâmico até carregar todos os resultados ou atingir maxResults
  let previousCount = 0;
  let sameCountTimes = 0;
  while (true) {
    const cardsCount = await page.evaluate(() => document.querySelectorAll('.hfpxzc').length);
    if (cardsCount === previousCount) {
      sameCountTimes++;
    } else {
      sameCountTimes = 0;
    }
    if (cardsCount >= maxResults || sameCountTimes >= 3) {
      break;
    }
    previousCount = cardsCount;
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(1200);
  }

  // Esperar resultados carregarem
  try {
    await page.waitForSelector('.hfpxzc', { timeout: 15000 });
  } catch (e) {
    console.error('Seletor .hfpxzc não encontrado. Pode ser bloqueio do Google, layout diferente ou nenhum resultado.');
    await browser.close();
    return [];
  }

  // Coletar links dos cartões
  const cardLinks = await page.evaluate((maxResults) => {
    return Array.from(document.querySelectorAll('.hfpxzc'))
      .slice(0, maxResults)
      .map(card => card.getAttribute('href'));
  }, maxResults);

  const results = [];
  for (let i = 0; i < cardLinks.length; i++) {
    const link = cardLinks[i];
    if (!link) continue;
    const fullLink = link.startsWith('http') ? link : `https://www.google.com${link}`;
    console.log(`Abrindo cartão ${i + 1}/${cardLinks.length}: ${fullLink}`);
    try {
      await page.goto(fullLink, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(2500);
      // Esperar nome aparecer
      await page.waitForSelector('h1.DUwDvf', { timeout: 10000 });
      const data = await page.evaluate(() => {
        const nome = document.querySelector('h1.DUwDvf')?.textContent || '';
        // Telefone: <a class="CsEnBe" data-item-id^="phone:"> ... <div class="Io6YTe fontBodyMedium ...">(71) 3375-2301</div> ... </a>
        let telefone = '';
        const telEl = document.querySelector('a.CsEnBe[data-item-id^="phone:"]') || document.querySelector('button.CsEnBe[data-item-id^="phone:"]');
        if (telEl) {
          const telDiv = telEl.querySelector('div.Io6YTe.fontBodyMedium');
          if (telDiv) telefone = telDiv.textContent.trim();
        }
        // Endereço (mantém tentativa anterior)
        const endereco = Array.from(document.querySelectorAll('.Io6YTe.fontBodyMedium')).find(el => el.textContent && el.textContent.match(/\d{5}-\d{3}/))?.textContent || '';
        // Site: <a class="CsEnBe" data-tooltip*="link" ou "site"> ... href ... </a>
        let site = '';
        const siteA = Array.from(document.querySelectorAll('a.CsEnBe')).find(a => {
          const tooltip = a.getAttribute('data-tooltip') || '';
          return /link|site/i.test(tooltip) && a.href && a.href.startsWith('http');
        });
        if (siteA) site = siteA.href;
        return { nome, telefone, endereco, site };
      });
      results.push(data);
      console.log('Lead extraído:', data);
      // Voltar para a lista
      await page.goBack({ waitUntil: 'networkidle2' });
      await page.waitForTimeout(1500);
    } catch (err) {
      console.error('Erro ao extrair dados do cartão:', fullLink, err);
      // Tentar voltar para a lista mesmo em caso de erro
      try { await page.goBack({ waitUntil: 'networkidle2' }); await page.waitForTimeout(1500); } catch {}
    }
  }

  await browser.close();
  console.log('Resultados coletados:', results.length);
  return results;
} 