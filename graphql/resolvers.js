const Recipe = require('../models/Recipe.js');
module.exports = {
    // Query fields can be executed in parallel by the GraphQL engine 
    Query: {
        async recipe(_, args) {
            return await Recipe.findById(args.ID)
        },
        async getRecipe(_,args) {
            return await Recipe.find().sort({createAt: -1}).limit(args.amount)
        }
    },
    // Mutation top-level fields MUST execute serially
    Mutation: {
        async createdRecipe(_, args) {
            const createdRecipe = new Recipe({
                name: args.recipeInput.name,
                description: args.recipeInput.description,
                createdAt: new Date().toISOString(),
                thumbsUp: 0,
                thumbsDown: 0
            })

            const res = await createdRecipe.save()
            return  {
                id: res.id,
                ...res._doc
            }
        },
        async deleteRecipe(_, args) {
            const wasDeleted = (await Recipe.deleteOne({_id: args.ID})).deletedCount;
            return wasDeleted;
        },
        async editRecipe(_, args) {
            const wasEdited = (await Recipe.updateOne({_id: args.ID}, {name: args.recipeInput.name, description: args.recipeInput.description})).modifiedCount;
            return wasEdited;
        }
    }
}