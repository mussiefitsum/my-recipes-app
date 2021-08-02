const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipes');
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, validateRecipeSchema, verifyAuthor } = require('../middleware');
const { storage } = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(recipes.index))
    .post(isLoggedIn, upload.array('image'), validateRecipeSchema, wrapAsync(recipes.createRecipe));

router.get('/new', isLoggedIn, recipes.renderForm);

router.route('/:id')
    .get(wrapAsync(recipes.recipeDetails))
    .put(isLoggedIn, verifyAuthor, upload.array('image'), validateRecipeSchema, wrapAsync(recipes.updateRecipe))
    .delete(isLoggedIn, verifyAuthor, wrapAsync(recipes.deleteRecipe));

router.get('/:id/edit', isLoggedIn, verifyAuthor, wrapAsync(recipes.renderEditForm));

module.exports = router;