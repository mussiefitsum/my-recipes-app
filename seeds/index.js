const mongoose = require('mongoose');
const Recipe = require('../models/recipe');


mongoose.connect('mongodb://localhost:27017/myRecipeApp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopolohy: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const seedRecipes = [
    {
        name: 'Fluffy Pancakes',
        author: '610055beef1c281398c1038e',
        description: 'This is the best fluffy pancakes recipe according to my family. They are quick and easy to prepare, but we still consider these homemade pancakes a special treat.',
        category: 'Breakfast',
        ingredients: '1 cup all-purpose flour, 1 tablespoon sugar, 2 teaspoons baking powder, 1/2 teaspoon salt, 1 large egg, 3/4 cup milk, 1/4 cup shortening or melted butter',
        directions: 'In a small bowl, combine flour, sugar, baking powder and salt. Combine egg, milk and shortening; stir into dry ingredients just until moistened. Our batter by 1/4 cupfuls onto a greased hot griddle. Turn when bubbles form on top of pancakes; cook until the second side is golden brown.',
        images: [
            {
                url: 'https://res.cloudinary.com/dfuxr1p10/image/upload/v1627847607/MyRecipe/pancake_qzeore.jpg',
                filename: 'MyRecipe/pancake_qzeore'
            }
        ],
    },
    {
        name: 'Cheesy-Crust Skillet Pizza',
        author: '610055beef1c281398c1038e',
        description: 'If you love pizza but want to cut back on the carbs, then you will love this thin-crust pizza recipe.',
        category: 'Lunch',
        ingredients: '1 ½ cups shredded part-skim mozzarella cheese, 5 cherry tomatoes, thinly sliced, 2 tablespoons torn fresh basil leaves, 4 small fresh mozzarella balls (bocconcini), thinly sliced',
        directions: 'Heat a 10-inch non-stick skillet over medium-high heat. Sprinkle shredded mozzarella cheese evenly into hot skillet; cook until cheese is melted, 2 to 3 minutes. Arrange tomato slices, basil leaves, and fresh mozzarella slices on the melted cheese, leaving space for a "crust" to form; cook until top is bubbling and edges are browned, 2 to 3 minutes. Remove skillet from heat and loosen pizza with a spatula. Gently slice pizza onto a cutting board; cool for 1 minute before slicing.',
        images: [
            {
                url: 'https://res.cloudinary.com/dfuxr1p10/image/upload/v1627847607/MyRecipe/pizza_lap0mt.jpg',
                filename: 'MyRecipe/pizza_lap0mt'
            }
        ],
    }
];

const seedDB = async () => {
    await Recipe.deleteMany({});
    for (let data of seedRecipes) {
        const recipe = new Recipe(data);
        await recipe.save();
    }
};

seedDB()
    .then(data => {
        console.log('Saved!');
        console.log(data);
        mongoose.connection.close();
    })
    .catch(err => {
        console.log('Something Went Wrong!');
        console.log(err);
    })