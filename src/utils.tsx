import * as yup from 'yup'

yup.addMethod(yup.string, 'match', function (key, message) {
  return this.oneOf([yup.ref(key), null], message)
})

export function createYupSchema(properties: any) {
  let schema: any = {}
  Object.keys(properties).forEach((key) => {
    const { validationType, rules = [] } = properties[key] as any

    if (!(yup as any)[validationType]) {
      return schema
    }

    let validator = (yup as any)[validationType]()

    rules.forEach((validation: any) => {
      const { params, type } = validation
      if (!validator[type]) {
        return
      }
      validator = validator[type](...params)
    })

    schema[key] = validator
  })

  return schema
}
