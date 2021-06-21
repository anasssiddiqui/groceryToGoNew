/*
|----------------------------------------------------------------------------------------------------------------
|   Admin Routes File
|----------------------------------------------------------------------------------------------------------------
*/

const express = require('express');
const router = express.Router();

/*
|----------------------------------------------------------------------------------------------------------------
|   Calling Controllers 
|----------------------------------------------------------------------------------------------------------------
*/

const adminAuthController = require('../controllers/admin/adminAuthController');
const adminController = require('../controllers/admin/adminController');
const userController = require('../controllers/admin/userController');
const categoryItemController = require('../controllers/admin/categoryItemController');
const productController = require('../controllers/admin/productController');
const orderController = require('../controllers/admin/orderController');
const reportController = require('../controllers/admin/reportController');
const settingController = require('../controllers/admin/settingController');
const taxCategoryController = require('../controllers/admin/taxCategoryController');
const categoryController = require('../controllers/admin/categoryController');
const todaysCategoryController = require('../controllers/admin/todaysCategoryController');
const subCategoryController = require('../controllers/admin/subCategoryController');
const shopCategoryController = require('../controllers/admin/shopCategoryController');
// const pageController = require('../controllers/admin/pageController');

/*
|----------------------------------------------------------------------------------------------------------------
|   Admin Auth Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/', adminAuthController.loginPage);
router.get('/login', adminAuthController.loginPage);
router.post('/loginSubmit', adminAuthController.loginSubmit);
router.get('/logout', adminAuthController.logout);

/*
|----------------------------------------------------------------------------------------------------------------
|   Admin Related Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/dashboard', adminController.dashboard);
// router.get('/dashboardCounts', adminController.dashboardCounts);
router.put('/updateStatus', adminController.updateStatus);
router.delete('/delete', adminController.delete);
router.put('/changeField', adminController.changeField);

/*
|----------------------------------------------------------------------------------------------------------------
|   User Routes
|----------------------------------------------------------------------------------------------------------------
*/
// router.get('/user/userList', userController.userList);
// router.get('/user/edit', userController.userEdit);
router.get('/manageShop', userController.manageShop);
router.post('/user/updateUser', userController.updateUser);
router.post('/user/changePasswordSetting', userController.changePasswordSetting);
router.post('/user/changeEmailSetting', userController.changeEmailSetting);



    router.get('/user', userController.listing);
    router.get('/user/listing', userController.listing);
    router.get('/user/add', userController.addEditView('add'));
    router.get('/user/edit/:id', userController.addEditView('edit'));
    router.get('/user/view/:id', userController.addEditView('view'));
    router.get('/user/datatable', userController.datatable);
    router.post('/user/addUpdate', userController.addUpdate);

/*
|----------------------------------------------------------------------------------------------------------------
|   Today's Category Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/todaysCategory', todaysCategoryController.listing);
router.get('/todaysCategory/listing', todaysCategoryController.listing);
router.get('/todaysCategory/add', todaysCategoryController.add);
/*
|----------------------------------------------------------------------------------------------------------------
|   Category Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/category', categoryController.listing);
router.get('/category/listing', categoryController.listing);
router.get('/category/add', categoryController.add);
router.get('/category/edit/:id', categoryController.edit);
router.get('/category/view/:id', categoryController.view);
router.post('/category/addUpdate', categoryController.addUpdate);
router.post('/category/categoryBasedChildCategories', categoryController.categoryBasedChildCategories);
/*
|----------------------------------------------------------------------------------------------------------------
|   shopCategory Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/shopCategory', shopCategoryController.listing);
router.get('/shopCategory/listing', shopCategoryController.listing);
router.get('/shopCategory/add', shopCategoryController.add);
router.get('/shopCategory/edit/:id', shopCategoryController.edit);
router.get('/shopCategory/view/:id', shopCategoryController.view);
router.post('/shopCategory/addUpdate', shopCategoryController.addUpdate);
/*
|----------------------------------------------------------------------------------------------------------------
|   Sub Category Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/subCategory', subCategoryController.listing);
router.get('/subCategory/listing', subCategoryController.listing);
router.get('/subCategory/add', subCategoryController.add);
router.get('/subCategory/edit/:id', subCategoryController.edit);
router.get('/subCategory/view/:id', subCategoryController.view);
router.post('/subCategory/addUpdate', subCategoryController.addUpdate);

/*
|----------------------------------------------------------------------------------------------------------------
|   Tax Category Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/taxcategory', taxCategoryController.listing);
router.get('/taxcategory/listing', taxCategoryController.listing);
router.get('/taxcategory/add', taxCategoryController.add);
router.get('/taxcategory/edit/:id', taxCategoryController.edit);
router.get('/taxcategory/view/:id', taxCategoryController.view);
router.post('/taxcategory/addUpdateTaxCategory', taxCategoryController.addUpdateTaxCategory);

/*
|----------------------------------------------------------------------------------------------------------------
|   Product Routes
|----------------------------------------------------------------------------------------------------------------
*/

// RE:CIPES
router.get('/recipe', categoryItemController.listing(1));
router.get('/recipe/listing', categoryItemController.listing(1));
router.get('/recipe/add', categoryItemController.addEditView('add', 1));
router.get('/recipe/edit/:id', categoryItemController.addEditView('edit', 1));
router.get('/recipe/view/:id', categoryItemController.addEditView('view', 1));

// RE:TAIL
router.get('/retail', categoryItemController.listing(2));
router.get('/retail/listing', categoryItemController.listing(2));
router.get('/retail/add', categoryItemController.addEditView('add', 2));
router.get('/retail/edit/:id', categoryItemController.addEditView('edit', 2));
router.get('/retail/view/:id', categoryItemController.addEditView('view', 2));

// RE:VIVE
router.get('/revive', categoryItemController.listing(3));
router.get('/revive/listing', categoryItemController.listing(3));
router.get('/revive/add', categoryItemController.addEditView('add', 3));
router.get('/revive/edit/:id', categoryItemController.addEditView('edit', 3));
router.get('/revive/view/:id', categoryItemController.addEditView('view', 3));

// RE:AD
router.get('/read', categoryItemController.listing(4));
router.get('/read/listing', categoryItemController.listing(4));
router.get('/read/add', categoryItemController.addEditView('add', 4));
router.get('/read/edit/:id', categoryItemController.addEditView('edit', 4));
router.get('/read/view/:id', categoryItemController.addEditView('view', 4));

// RE:SET
router.get('/reset', categoryItemController.listing(5));
router.get('/reset/listing', categoryItemController.listing(5));
router.get('/reset/add', categoryItemController.addEditView('add', 5));
router.get('/reset/edit/:id', categoryItemController.addEditView('edit', 5));
router.get('/reset/view/:id', categoryItemController.addEditView('view', 5));

router.post('/categoryitem/addUpdate', categoryItemController.addUpdate);



router.get('/product', productController.listing);
router.get('/product/listing', productController.listing);
router.get('/product/add', productController.add);
router.get('/product/edit/:id', productController.edit);
// // router.get('/product/addToMyInventory/:id', productController.addToMyInventory);
router.get('/product/view/:id', productController.view);
router.post('/product/addUpdateProduct', productController.addUpdateProduct);
// router.post('/product/productCategorySelect', productController.productCategorySelect);
//----------------------------------------------------------



/*
|----------------------------------------------------------------------------------------------------------------
|   Order Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/orders', orderController.orders);
router.get('/cancellationRequests', orderController.cancellationRequests);
router.get('/orderReturnRequests', orderController.orderReturnRequests);
router.get('/order/view/:id', orderController.view);
//     router.get('/order/customerOrders', orderController.customerOrders);
//     router.get('/order/sellerOrders', orderController.sellerOrders);
//     router.get('/order/withdrawalRequests', orderController.withdrawalRequests);
//     router.get('/order/refundRequests', orderController.refundRequests);
//     router.get('/order/customerOrderDataTable', orderController.customerOrderDataTable);
//     router.get('/order/sellerOrderDataTable', orderController.sellerOrderDataTable);
//     router.get('/order/cancellationRequestsDataTable', orderController.cancellationRequestsDataTable);
//     router.get('/order/withdrawalRequestsDataTable', orderController.withdrawalRequestsDataTable);
//     router.get('/order/refundRequestsDataTable', orderController.refundRequestsDataTable);

/*
|----------------------------------------------------------------------------------------------------------------
|   Report Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/report', reportController.salesReport);
router.get('/report/salesReport', reportController.salesReport);
router.get('/report/taxReport', reportController.taxReport);
router.get('/report/totalIncomeReport', reportController.totalIncomeReport);
//     router.get('/report/userReport', reportController.userReport);
//     router.get('/report/sellerReport', reportController.sellerReport);
//     router.get('/report/commissionReport', reportController.commissionReport);
//     router.get('/report/revenueReport', reportController.revenueReport);
//     router.get('/report/salesReportDataTable', reportController.salesReportDataTable);
//     router.get('/report/userReportDataTable', reportController.userReportDataTable);
//     router.get('/report/sellerReportDataTable', reportController.sellerReportDataTable);
//     router.get('/report/taxReportDataTable', reportController.taxReportDataTable);
//     router.get('/report/commissionReportDataTable', reportController.commissionReportDataTable);

/*
|----------------------------------------------------------------------------------------------------------------
|   Setting Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.get('/setting', settingController.setting);
router.put('/setting/updateSettings', settingController.updateSettings);
/*
// |----------------------------------------------------------------------------------------------------------------
// |   Page Routes
// |----------------------------------------------------------------------------------------------------------------
// */
//     router.get('/page/aboutUs', pageController.getPage('aboutUs'));
//     router.get('/page/termsAndConditions', pageController.getPage('termsAndConditions'));
//     router.get('/page/privacyPolicy', pageController.getPage('privacyPolicy'));
//     router.put('/page/updatePage', pageController.updatePage);

module.exports = router;
