/*
|----------------------------------------------------------------------------------------------------------------
|   Configuration File
|----------------------------------------------------------------------------------------------------------------
*/

const express = require('express');
const router = express.Router();

// const requireUserAuthentication = require('../passport').authenticateUser;

/*
|----------------------------------------------------------------------------------------------------------------
|   Calling Controllers 
|----------------------------------------------------------------------------------------------------------------
*/
const apiController = require('../controllers/api/api_controller');

const authController = require('../controllers/api/authController');
const userController = require('../controllers/api/userController');
const categoryController = require('../controllers/api/categoryController');
const pageController = require('../controllers/api/pageController');
const cardController = require('../controllers/api/cardController');
const cartController = require('../controllers/api/cartController');
const notificationController = require('../controllers/api/notificationController');
const orderController = require('../controllers/api/orderController');
const productController = require('../controllers/api/productController');
const addressController = require('../controllers/api/addressController');


/*
|----------------------------------------------------------------------------------------------------------------
|   Auth Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.post('/login', authController.login);
router.post('/signUp', authController.signUp);


/*
|----------------------------------------------------------------------------------------------------------------
|   users Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/getProfile', userController.getProfile);
router.post('/updateProfile', userController.updateProfile);
router.post('/GetWalletBalance', userController.GetWalletBalance);
router.post('/addWalletMoney', userController.addWalletMoney);




/*
|----------------------------------------------------------------------------------------------------------------
|   Addresses Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.post('/addAddress', addressController.addAddress);
router.get('/UserAddressList', addressController.UserAddressList);
router.post('/editAddress', addressController.editAddress);
router.post('/addressDefaultSet', addressController.addressDefaultSet);
router.post('/deleteAddress', addressController.deleteAddress);



/*
|----------------------------------------------------------------------------------------------------------------
|   Products Routes
|----------------------------------------------------------------------------------------------------------------
*/

router.post('/homeCategoryBasedProducts', productController.homeCategoryBasedProducts);
router.post('/productsReviews', productController.productsReviews);
router.get('/favouriteProductItems', productController.favouriteProductItems);


/*
|----------------------------------------------------------------------------------------------------------------
|   Category Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/homeCategories', categoryController.homeCategories);
router.post('/categoryItemDetail', categoryController.categoryItemDetail);
router.post('/favouriteUnfavouriteCategoryItem', categoryController.favouriteUnfavouriteCategoryItem);
router.post('/downloadCategoryItem', categoryController.downloadCategoryItem);
router.get('/downloadedCategoryItems', categoryController.downloadedCategoryItems);
router.delete('/deletedownloadedCategoryItem', categoryController.deletedownloadedCategoryItem);
router.get("/share/:productId/:categoryId", categoryController.share);


/*
|----------------------------------------------------------------------------------------------------------------
|   Card Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/allCards', cardController.allCards);
router.post('/addCard', cardController.addCard);
router.delete('/deleteCard', cardController.deleteCard);
router.put('/changeDefaulCard', cardController.changeDefaulCard);

/*
|----------------------------------------------------------------------------------------------------------------
|   Cart Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/cartItemsListing', cartController.cartItemsListing);
router.post('/addCartItem', cartController.addCartItem);
router.put('/updateCartItem', cartController.updateCartItem);
router.delete('/deleteCartItem', cartController.deleteCartItem);

/*
|----------------------------------------------------------------------------------------------------------------
|   Order Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.post('/orderListing', orderController.orderListing);
router.post('/orderDetail', orderController.orderDetail);
router.post('/addOrder', orderController.addOrder);

/*
|----------------------------------------------------------------------------------------------------------------
|    Notification Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/notificationListing', notificationController.notificationListing);

/*
|----------------------------------------------------------------------------------------------------------------
|   Page Routes
|----------------------------------------------------------------------------------------------------------------
*/

router.get('/aboutUs', pageController.getPage('aboutUs'));
router.get('/termsAndConditions', pageController.getPage('termsAndConditions'));
router.get('/privacyPolicy', pageController.getPage('privacyPolicy'));

/*
|----------------------------------------------------------------------------------------------------------------
|   Exporting Module
|----------------------------------------------------------------------------------------------------------------
*/

module.exports = router;