import { Browser, Cookie, launch, Page } from 'puppeteer';

// This code is adapted from
// https://gist.github.com/csuzw/845b589549b61d3a5fe18e49592e166f, which itself
// was adapted from https://github.com/cypress-io/cypress/issues/1342/.
// Unfortunately, there is not a standard way to do AD Azure logins from Cypress.

export interface AdCookiesOptions {
  username: string;
  password: string;
  loginUrl: string;
  postLoginSelector: string;
  headless?: boolean;
  logs?: boolean;
  getAllBrowserCookies?: boolean;
}

/**
 * @param string username
 * @param string password
 * @param string the app url
 * @param string a selector on the app's post-login
 * return page to assert that login is successful
 * @param boolean launch puppeteer in headless mode or not
 * @param boolean whether to log cookies and other metadata to console
 * @param boolean whether to get all browser
 * cookies instead of just for the loginUrl
 */
export async function AzureAdSingleSignOn(options: AdCookiesOptions) {
  validateOptions(options);

  const browser = await launch({ headless: !!options.headless });
  const page = await browser.newPage();
  await page.goto(options.loginUrl);
  await page.waitForNavigation();
  const popup = await getLoginPopup(browser, page);

  await typeUsername(popup, options);
  await typePassword(popup, options);
  await chooseToStaySignedIn(popup);

  const cookies = await getCookies(page, popup, options);

  await finalizeSession(browser);

  return {
    cookies,
  };
}

async function getLoginPopup(browser: Browser, page: Page) {
  const newPagePromise = new Promise<Page>((resolve) =>
    browser.once('targetcreated', (target) => resolve(target.page())),
  );
  await page.click('[data-cy = login]', {
    delay: 10000,
  });
  return newPagePromise;
}

function validateOptions(options: AdCookiesOptions) {
  if (!options.username || !options.password) {
    throw new Error('Username or Password missing for login');
  }
  if (!options.loginUrl) {
    throw new Error('Login Url missing');
  }
  if (!options.postLoginSelector) {
    throw new Error('Post login selector missing');
  }
}

async function typeUsername(popup: Page, options: AdCookiesOptions) {
  await popup.waitForSelector('input[name=loginfmt]:not(.moveOffScreen)', {
    visible: true,
  });
  await popup.type('input[name=loginfmt]', options.username);
  await popup.click('input[type=submit]');
}

async function typePassword(popup: Page, options: AdCookiesOptions) {
  await popup.waitForSelector(
    'input[name=Password]:not(.moveOffScreen),input[name=passwd]:not(.moveOffScreen)',
    { visible: true },
  );
  await popup.type('input[name=passwd]', options.password);
  await popup.click('input[type=submit]');
}

async function chooseToStaySignedIn(popup: Page) {
  await popup.waitForSelector('input[type=submit]', {
    visible: true,
  });
  await popup.click('input[type=submit]');
}

async function getCookies(page: Page, popup: Page, options: AdCookiesOptions) {
  await page.waitForSelector(options.postLoginSelector, {
    visible: true,
  });

  console.log('post Login');

  const cookies = options.getAllBrowserCookies
    ? await getCookiesForAllDomains(popup)
    : await popup.cookies(options.loginUrl);

  if (options.logs) {
    console.log(cookies);
  }

  return cookies;
}

async function getCookiesForAllDomains(page: Page): Promise<Cookie[]> {
  const cookies = await (page as any)._client.send('Network.getAllCookies', {});
  return cookies.cookies;
}

async function finalizeSession(browser: Browser) {
  await browser.close();
}
