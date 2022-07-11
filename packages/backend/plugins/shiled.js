const { rule, shield, and } = require('graphql-shield')
const { applyMiddleware } = require('graphql-middleware')
const { makeProcessSchemaPlugin } = require('postgraphile')

// eslint-disable-next-line no-unused-vars
const isAuthenticated = rule()(async (parent, args, ctx) => {
  const { claims: { isAuthenticated: authorized } } = ctx
  return authorized
})

const isAdmin = rule()(async (parent, args, ctx) => {
  const { claims: { role, isAuthenticated: authorized } } = ctx
  if (authorized) {
    const { payloads } = role || null
    return payloads['cognito:groups'].includes('Admin')
  }

  return new Error(ctx.role.message || ' Only authorized for admin')
})

const permissions = shield({
  Query: {
    admins: and(isAuthenticated),
    groups: (isAdmin),
    lawyers: and(isAuthenticated),
  },
  Mutation: {
    // createUser: isAuthenticated,
    // updateUserById: and(isAuthenticated),
    createGroup: and(isAdmin),
  },
  Admin: {
    // createdAt: and(isAdmin),
  },
})

module.exports = makeProcessSchemaPlugin(schema => {
  const newSchema = applyMiddleware(schema, permissions)
  return newSchema
})