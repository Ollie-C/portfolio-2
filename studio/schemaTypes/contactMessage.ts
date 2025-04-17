import {defineType, defineField} from 'sanity'

export const contactMessageType = defineType({
  name: 'contactMessage',
  title: 'Contact Messages',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'isRead',
      title: 'Is Read',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'notes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      date: 'submittedAt',
    },
    prepare({title, subtitle, date}) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : ''
      return {
        title: title || 'Unnamed Contact',
        subtitle: `${subtitle} - ${formattedDate}`,
      }
    },
  },
})
