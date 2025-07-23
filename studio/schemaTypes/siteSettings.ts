import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'heroUpdate',
      title: 'Hero Update Message',
      type: 'object',
      description:
        'Message displayed in the hero section with typing animation',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Update Message',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'message',
          title: 'Update Message (English)',
          type: 'string',
          description:
            'e.g., "Hibi v1.1.2 released. Check it out on the Play Store"',
        },
        {
          name: 'messageJa',
          title: 'Update Message (Japanese)',
          type: 'string',
          description: 'Japanese version of the update message',
        },
        {
          name: 'link',
          title: 'Update Link (Optional)',
          type: 'url',
          description: 'Link to the update (e.g., Play Store, App Store, etc.)',
        },
        {
          name: 'linkText',
          title: 'Link Text',
          type: 'string',
          description: 'Text for the link button',
          initialValue: 'View Update',
        },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image displayed when sharing the site on social media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
      description: 'HEX color code for primary site color',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'string',
      description: 'HEX color code for secondary site color',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
    }),
  ],
});
