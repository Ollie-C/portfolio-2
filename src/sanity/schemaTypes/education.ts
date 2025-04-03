import { defineField, defineType } from 'sanity';

export const educationType = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'institution',
      type: 'string',
    }),
    defineField({
      name: 'degree',
      type: 'string',
    }),
    defineField({
      name: 'field',
      type: 'string',
    }),
    defineField({
      name: 'logo',
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
      name: 'startDate',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
    }),
    defineField({
      name: 'current',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'order',
      type: 'number',
      description:
        'Order in which to display this education (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'institution',
      subtitle: 'degree',
      media: 'logo',
    },
  },
});
