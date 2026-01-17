import { test, expect, Page } from '@playwright/test';

const openCitySearchDialog = async (page: Page) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add new timezone' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
};

test.describe('Live Lookup', () => {
  test('clears API results when query is too short', async ({ page }) => {
    await page.route('**/geo-db.p.rapidapi.com/v1/geo/cities**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,OPTIONS',
            'access-control-allow-headers': '*'
          }
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,OPTIONS',
          'access-control-allow-headers': '*'
        },
        body: JSON.stringify({
          data: [
            {
              name: 'Xanadu',
              country: 'Nowhere',
              timezone: 'Europe/Paris',
              population: 1000,
              latitude: 48.8566,
              longitude: 2.3522,
              offset: 0
            }
          ]
        })
      });
    });
    await page.route('**/geo/1.0/direct**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,OPTIONS',
            'access-control-allow-headers': '*'
          }
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,OPTIONS',
          'access-control-allow-headers': '*'
        },
        body: JSON.stringify([
          {
            name: 'Xanadu',
            sys: { country: 'Nowhere' },
            coord: { lat: 48.8566, lon: 2.3522 }
          }
        ])
      });
    });
    await page.route('**/nominatim.openstreetmap.org/search**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,OPTIONS',
            'access-control-allow-headers': '*'
          }
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,OPTIONS',
          'access-control-allow-headers': '*'
        },
        body: JSON.stringify([
          {
            display_name: 'Xanadu, Nowhere',
            lat: '48.8566',
            lon: '2.3522',
            address: {
              city: 'Xanadu',
              country: 'Nowhere'
            }
          }
        ])
      });
    });

    await openCitySearchDialog(page);

    await page.getByRole('button', { name: /Live Lookup/i }).click();
    const searchInput = page.getByPlaceholder('Search for a city...');

    const apiResponse = page.waitForResponse(response => {
      const url = response.url();
      return (
        response.request().method() === 'GET' &&
        (url.includes('geo-db.p.rapidapi.com/v1/geo/cities') ||
          url.includes('api.openweathermap.org/geo/1.0/direct') ||
          url.includes('nominatim.openstreetmap.org/search'))
      );
    });
    await searchInput.fill('Xan');
    await apiResponse;

    const apiResult = page.getByText('Xanadu, Nowhere');
    await expect(apiResult).toBeVisible();

    await searchInput.fill('Xa');
    await expect(apiResult).toHaveCount(0);
  });

  test('shows authentication error when providers return 401', async ({ page }) => {
    await page.route('**/geo-db.p.rapidapi.com/v1/geo/cities**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,OPTIONS',
            'access-control-allow-headers': '*'
          }
        });
        return;
      }

      await route.fulfill({
        status: 401,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,OPTIONS',
          'access-control-allow-headers': '*'
        },
        body: '{}'
      });
    });
    await page.route('**/geo/1.0/direct**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,OPTIONS',
            'access-control-allow-headers': '*'
          }
        });
        return;
      }

      await route.fulfill({
        status: 401,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,OPTIONS',
          'access-control-allow-headers': '*'
        },
        body: '{}'
      });
    });
    await page.route('**/nominatim.openstreetmap.org/search**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,OPTIONS',
            'access-control-allow-headers': '*'
          }
        });
        return;
      }

      await route.fulfill({
        status: 401,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,OPTIONS',
          'access-control-allow-headers': '*'
        },
        body: '{}'
      });
    });

    await openCitySearchDialog(page);

    await page.getByRole('button', { name: /Live Lookup/i }).click();
    const searchInput = page.getByPlaceholder('Search for a city...');

    await searchInput.fill('Auth');

    await expect(
      page.getByText('API authentication failed. Please check your API key.')
    ).toBeVisible();
  });
});
