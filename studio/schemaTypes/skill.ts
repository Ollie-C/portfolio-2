import {defineField, defineType} from 'sanity'

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
      title: 'Category',
      description: 'How you want this skill displayed: Core, Strong working experience, or Familiar with',
      options: {
        list: [
          {title: 'Core', value: 'core'},
          {title: 'Strong working experience', value: 'strong_working_experience'},
          {title: 'Familiar with', value: 'familiar_with'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'proficiency',
      type: 'number',
      title: 'Proficiency',
      description: 'Proficiency level from 1–10 (higher = more proficient). Within each category, skills are ordered by this value, then alphabetically by name.',
      validation: (Rule) => Rule.min(1).max(10),
      initialValue: 5,
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
      category: 'category',
      media: 'icon',
    },
    prepare({title, category, media}) {
      const categoryLabels: Record<string, string> = {
        core: 'Core',
        strong_working_experience: 'Strong working experience',
        familiar_with: 'Familiar with',
      }
      return {
        title,
        subtitle: category ? categoryLabels[category] ?? category : undefined,
        media,
      }
    },
  },
})
