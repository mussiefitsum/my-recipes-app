const Recipe = require('../models/recipe');
const { cloudinary } = require('../cloudinary')
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Brunch', 'Snack', 'Dessert'];

module.exports.index = async (req, res) => {
    const recipes = await Recipe.find({});
    res.render('recipes/index', { recipes });
};

module.exports.renderForm = (req, res) => {
    res.render('recipes/new');
};

module.exports.createRecipe = async (req, res, next) => {
    const recipe = new Recipe(req.body.recipe);
    recipe.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    recipe.author = req.user._id;
    await recipe.save();
    req.flash('success', 'Successfully made a new recipe!');
    res.redirect(`/recipes/${ recipe._id }`);
};

module.exports.recipeDetails = async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!recipe) {
        req.flash('error', 'We could not find this recipe!');
        return res.redirect('/recipes');
    }
    res.render('recipes/details', { recipe });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
        req.flash('error', 'We could not edit this recipe!');
        return res.redirect('/recipes');
    }
    res.render('recipes/edit', { recipe, categories });
};

module.exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, { ...req.body.recipe });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    recipe.images.push(...imgs);
    await recipe.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await recipe.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated recipe!');
    res.redirect(`/recipes/${ recipe._id }`);
};

module.exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id)
    for (let img of recipe.images) {
        await cloudinary.uploader.destroy(img.filename)
    }
    await Recipe.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted recipe!');
    res.redirect('/recipes');
};