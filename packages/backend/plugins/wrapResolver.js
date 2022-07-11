const { makeWrapResolversPlugin } = require("graphile-utils");

module.exports = makeWrapResolversPlugin({
    Mutation: {
        createTblRole: {
            requires: {
                childColumns: [{ column: "name", alias: "$name" }],
            },
            
            async resolve(resolve, _source, _args, context, _resolveInfo) {
                // The pgClient on context is already in a transaction configured for the user:
                const { pgClient } = context;
                // Create a savepoint we can roll back to
                await pgClient.query("SAVEPOINT mutation_wrapper");
                
                try {
                    // Run the original resolver
                    const result = await resolve();
                    // Do the custom thing
                    // await createRole(context, result.data.$name);
                    // Finally return the result of our original mutation
                    pgClient.query(`SELECT public.create_role_if_not_exists('pmsinta_${result.data.$name}')`, (err, res) => {
                        console.log(err)
                        if (err) throw new Error("Cant' create role!!");
                    })

                    return result;
                } catch (e) {
                    // SAVEPOINT allows other mutations to succeed.
                    await pgClient.query("ROLLBACK TO SAVEPOINT mutation_wrapper");
                    // Re-throw the error so the GraphQL client knows about it
                    return e;
                } finally {
                    await pgClient.query("RELEASE SAVEPOINT mutation_wrapper");
                }
            },
        },
        deleteTblRole: {
            requires: {
                childColumns: [{ column: "id", alias: "$id" }],
            },
            async resolve(resolve, _source, _args, context, _resolveInfo) {
                // The pgClient on context is already in a transaction configured for the user:
                const { pgClient } = context;
                // Create a savepoint we can roll back to
                await pgClient.query("SAVEPOINT mutation_wrapper");
                
                try {
                    // Run the original resolver
                    const result = await resolve();
                    // Do the custom thing
                    // await createRole(context, result.data.$name);
                    // Finally return the result of our original mutation
                    pgClient.query(`SELECT public.delete_role_if_not_exists('pmsinta_${result.data.$name}')`, (err, res) => {
                        if (err) throw new Error("Cant' delete role!!");
                    })

                    return result;
                } catch (e) {
                    // SAVEPOINT allows other mutations to succeed.
                    await pgClient.query("ROLLBACK TO SAVEPOINT mutation_wrapper");
                    // Re-throw the error so the GraphQL client knows about it
                    throw new Error('Uh oh!');
                } finally {
                    await pgClient.query("RELEASE SAVEPOINT mutation_wrapper");
                }
            },
        },
        updateTblRole: {
            requires: {
                childColumns: [{ column: "name", alias: "$name" }, { column: "id", alias: "$id" }],
            },
            async resolve(resolve, _source, _args, context, _resolveInfo) {
                // The pgClient on context is already in a transaction configured for the user:
                const { pgClient } = context;
                // Create a savepoint we can roll back to
                await pgClient.query("SAVEPOINT mutation_wrapper");
                
                try {
                    // Run the original resolver
                    const result = await resolve();
                    // Do the custom thing
                    // await createRole(context, result.data.$name);
                    // Finally return the result of our original mutation
                
                    pgClient.query(`SELECT public.create_role_if_not_exists('pmsinta_${result.data.$name}')`, (err, res) => {
                        if (err) throw new Error("Cant' update role!!");
                    })

                    const { rows } = await pgClient.query(`SELECT name FROM role WHERE id = '${result.data.$id}'`);



                    return result;
                } catch (e) {
                    // SAVEPOINT allows other mutations to succeed.
                    await pgClient.query("ROLLBACK TO SAVEPOINT mutation_wrapper");
                    // Re-throw the error so the GraphQL client knows about it
                    throw e;
                } finally {
                    await pgClient.query("RELEASE SAVEPOINT mutation_wrapper");
                }
            },
        },
    },
  });
  
