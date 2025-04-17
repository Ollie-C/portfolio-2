import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  studioHost: 'ollie-c-portfolio',
  api: {
    projectId: 'a1odqyb1',
    dataset: 'production',
  },

  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
