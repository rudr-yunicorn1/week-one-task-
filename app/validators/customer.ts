import vine from '@vinejs/vine'

export const CustomerValidator = vine.compile(
  vine.object({
    full_name: vine.string().minLength(3),
    email: vine.string().email(),
    age: vine.number().min(0).optional(),
    city: vine.string().optional(),
    position: vine.string().optional(),
    profile_photo: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
