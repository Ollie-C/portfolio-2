import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'titleJa',
      title: 'Title (Japanese)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'note',
      type: 'text',
    }),
    defineField({
      name: 'noteJa',
      title: 'Note (Japanese)',
      type: 'text',
    }),
    defineField({
      name: 'summary',
      type: 'text',
    }),
    defineField({
      name: 'summaryJa',
      title: 'Summary (Japanese)',
      type: 'text',
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'descriptionJa',
      title: 'Description (Japanese)',
      type: 'text',
    }),
    defineField({
      name: 'category',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      description: 'Set to false to hide this project from the site without deleting it',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'legacy',
      title: 'Legacy Project',
      description: 'Mark project as legacy (older work)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inProgress',
      title: 'In progress',
      description: 'Show an "In progress" tag next to the project title',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'projectType',
      title: 'Project type',
      description: 'Choose whether this was client work or a personal project.',
      type: 'string',
      options: {
        list: [
          {title: 'Client', value: 'client'},
          {title: 'Personal', value: 'personal'},
        ],
        layout: 'radio',
      },
      initialValue: 'personal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectCollection',
      title: 'Projects section',
      description: 'Choose which tab this project appears under in the Projects section.',
      type: 'string',
      options: {
        list: [
          {title: 'Recent', value: 'recent'},
          {title: 'Mini-apps', value: 'mini-apps'},
          {title: 'Legacy', value: 'legacy'},
        ],
        layout: 'radio',
      },
      initialValue: 'recent',
    }),
    defineField({
      name: 'codeWrittenPercentage',
      title: 'Code written by me (%)',
      description: 'Enter the percentage of code you wrote yourself. AI-assisted is calculated automatically as the remainder to 100.',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100).precision(0),
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      description: 'Technologies used in this project',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      description: 'Key features of this project',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'featuresJa',
      title: 'Features (Japanese)',
      description: 'Key features of this project in Japanese',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'desktopImages',
      title: 'Desktop Images',
      description: 'images optimized for desktop view (landscape orientation preferred)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'mobileImages',
      title: 'Mobile Images',
      description: 'images optimized for mobile view (portrait orientation preferred)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'projectImages',
      title: 'Project Images (Legacy)',
      description: 'Legacy field - please use Desktop/Mobile Images instead',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(6),
      hidden: true,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image (Legacy)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
      hidden: true,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source Code URL',
      type: 'url',
    }),
    defineField({
      name: 'sourceUrl2',
      title: 'Source Code URL 2',
      type: 'url',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'desktopImages.0',
    },
  },
})
