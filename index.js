// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");
  const records = await page.$$eval('table tbody tr.athing', rows => {
    return rows.slice(0, 10).map(row => {
      const titleElement = row.querySelector('td.title > span.titleline > a')
      const title = titleElement.textContent.trim()
      const url = titleElement.getAttribute('href')
      return {
        title, url
      }
    })
  })
  await browser.close()

  const csvContent = 'Title, URL\n' + records.map(record => `${record.title},${record.url}`).join('\n')
  const fs = require('fs')
  const path = require('path')
  
  const filePath = path.join(__dirname, 'top-10-articles.csv')
  fs.writeFileSync(filePath, csvContent)

  console.log(`CSV file saved successfully at ${filePath}`)
}

(async () => {
  await saveHackerNewsArticles();
})();
