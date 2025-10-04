import { getAvailableTimezones } from '../../data/timezones'

const timezones = getAvailableTimezones()

const getAliasesForTimezone = (id: string): string[] => {
  const timezone = timezones.find(tz => tz.id === id)
  if (!timezone) {
    throw new Error(`Timezone with id ${id} not found`)
  }
  return timezone.aliases
}

describe('timezone aliases include common abbreviations', () => {
  it('includes PST and PDT for America/Los_Angeles', () => {
    const aliases = getAliasesForTimezone('America/Los_Angeles')
    expect(aliases).toEqual(expect.arrayContaining(['PST', 'PDT']))
  })

  it('includes EST and EDT for America/New_York', () => {
    const aliases = getAliasesForTimezone('America/New_York')
    expect(aliases).toEqual(expect.arrayContaining(['EST', 'EDT']))
  })

  it('includes CST and CDT for America/Chicago', () => {
    const aliases = getAliasesForTimezone('America/Chicago')
    expect(aliases).toEqual(expect.arrayContaining(['CST', 'CDT']))
  })
})
