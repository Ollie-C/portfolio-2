import { defineField, defineType } from 'sanity';

export const skillType = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'icon',
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
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'DevOps', value: 'devops' },
          { title: 'Design', value: 'design' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'proficiency',
      type: 'number',
      description: 'Proficiency level from 1-5',
      validation: (Rule) => Rule.min(1).max(5),
      initialValue: 3,
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Feature this skill prominently',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'icon',
    },
  },
});
