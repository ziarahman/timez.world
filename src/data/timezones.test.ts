import { getAvailableTimezones } from './timezones';

describe('getAvailableTimezones', () => {
  it('includes GMT+13 and GMT+14 offsets', () => {
    const timezones = getAvailableTimezones();
    const gmtZones = timezones.filter(({ id }) => id.startsWith('Etc/GMT'));
    const gmtIds = gmtZones.map(({ id }) => id);

    expect(gmtIds).toEqual(expect.arrayContaining(['Etc/GMT-13', 'Etc/GMT-14']));

    const gmtNames = gmtZones
      .filter(({ id }) => id === 'Etc/GMT-13' || id === 'Etc/GMT-14')
      .map(({ city }) => city);

    expect(gmtNames).toEqual(expect.arrayContaining(['GMT+13', 'GMT+14']));
  });
});
