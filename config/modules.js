/*
|--------------------------------------------------------------------------------------------------------------------
|   Modules Configuration File
|--------------------------------------------------------------------------------------------------------------------
|
|   * All modules listing configured in this file.
|   * title => value will be shown as title for this module.
|   * dashboard => set to true will show the module into dashboard.
|   * sidebar => set to true will show the module into sidebar.
|   * permissions => set to true will show this module into sub-admins module for giving permissions to particalar 
|     Sub Admins.
|   * icon => icon class specified here.
|   * link => link for the module.
|   * count => count selector from admin dashboard method in controller or count value in integer.
|   * sidebarAnchorClass => to set class on the anchor attached to the sidebar link for single link element like "Logout" or "Dashboard"
*/

global.modules = {
    // 'old_master_admin': {
    //     'dashboard': {
    //         'title': 'Dashboard',
    //         'dashboard': false,
    //         'sidebar': true,
    //         'permissions': false,
    //         'icon': 'fas fa-fire',
    //         'link': '/admin/dashboard',
    //         'count': 1
    //     },
    'user': {
        'title': 'User',
        'dashboard': true,
        'dashboardLink': '/admin/user/listing',
        'sidebar': true,
        'permissions': true,
        'icon': 'far fa-user',
        'link': [{
                'title': 'Listing',
                'link': '/admin/user/listing',
                'subModule': 'listing',
            },
            {
                'title': 'Add',
                'link': '/admin/user/add',
                'subModule': 'add'
            },
        ],
        'count': 'user'
    },
    //     'driver': {
    //         'title': 'Driver',
    //         'dashboard': true,
    //         'sidebar': false,
    //         'permissions': false,
    //         'icon': 'fas fa-taxi',
    //         'link': '/admin/user/listing',
    //         'count': 'driver'
    //     },
    //     'vendor': {
    //         'title': 'Vendor',
    //         'dashboard': true,
    //         'sidebar': false,
    //         'permissions': false,
    //         'icon': 'fas fa-store',
    //         'link': '/admin/user/listing',
    //         'count': 'vendor'
    //     },
    //     'category': {
    //         'title': 'Category',
    //         'dashboard': true,
    //         'dashboardLink': '/admin/category/listing',
    //         'sidebar': true,
    //         'permissions': true,
    //         'icon': 'fas fa-list',
    //         'link': [
    //             {
    //                 'title': 'Listing',
    //                 'link': '/admin/category/listing',
    //                 'subModule': 'listing',
    //             },
    //             {
    //                 'title': 'Add',
    //                 'link': '/admin/category/add',
    //                 'subModule': 'add'
    //             },
    //         ],
    //         'count': 'category'
    //     },
    // 'product': {
    //     'title': 'Product',
    //     'dashboard': true,
    //     'dashboardLink': '/admin/product/listing',
    //     'sidebar': true,
    //     'permissions': true,
    //     'icon': 'fas fa-cubes',
    //     'link': [
    //         {
    //             'title': 'Listing',
    //             'link': '/admin/product/listing',
    //             'subModule': 'listing',
    //         },
    //         {
    //             'title': 'Add',
    //             'link': '/admin/product/add',
    //             'subModule': 'add'
    //         },
    //     ],
    //     'count': 'product'
    // },
    //     'order': {
    //         'title': 'Order',
    //         'dashboard': true,
    //         // 'dashboardLink': '/admin/order/customerOrders',
    //         'sidebar': true,
    //         'permissions': true,
    //         'icon': 'fas fa-truck',
    //         'link': [
    //             {
    //                 'title': 'Customer Orders',
    //                 'link': '/admin/order/customerOrders',
    //                 'subModule': 'customerOrders',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-user',
    //                 'count': 'order'
    //             },
    //             {
    //                 'title': 'Seller Orders',
    //                 'link': '/admin/order/sellerOrders',
    //                 'subModule': 'sellerOrders',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-truck',
    //                 'count': 'order'
    //             },
    //             {
    //                 'title': 'Cancellation Requests',
    //                 'link': '/admin/order/cancellationRequests',
    //                 'subModule': 'cancellationRequests',
    //                 'dashboard': true,
    //                 'dashboardTitle': 'Order Cancellation Requests',
    //                 'icon': 'fas fa-truck',
    //                 'count': 'ordercancellationrequest'
    //             },
    //             {
    //                 'title': 'Refund Requests',
    //                 'link': '/admin/order/refundRequests',
    //                 'subModule': 'refundRequests',
    //                 'dashboard': true,
    //                 'dashboardTitle': 'Order Refund Requests',
    //                 'icon': 'fas fa-truck',
    //                 'count': 'orderrefundrequest'
    //             },
    //             {
    //                 'title': 'Withdrawal Requests',
    //                 'link': '/admin/order/withdrawalRequests',
    //                 'subModule': 'withdrawalRequests',
    //                 'dashboard': true,
    //                 'dashboardTitle': 'Order Withdrawal Requests',
    //                 'icon': 'fas fa-truck',
    //                 'count': 'orderWithdrawalRequests'
    //             },
    //         ],
    //         'count': 'order'
    //     },
    //     'report': {
    //         'title': 'Report',
    //         'dashboard': true,
    //         // 'dashboardLink': '/admin/report/salesReport',
    //         'sidebar': true,
    //         'permissions': true,
    //         'icon': 'fas fa-list-alt',
    //         'link': [
    //             {
    //                 'title': 'Sales Report',
    //                 'link': '/admin/report/salesReport',
    //                 'subModule': 'salesReport',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-list-alt',
    //                 'count': 'salesReport'
    //             },
    //             {
    //                 'title': 'User Report',
    //                 'link': '/admin/report/userReport',
    //                 'subModule': 'userReport',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-list-alt',
    //                 'count': 'userReport'
    //             },
    //             {
    //                 'title': 'Seller Report',
    //                 'link': '/admin/report/sellerReport',
    //                 'subModule': 'sellerReport',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-list-alt',
    //                 'count': 'sellerReport'
    //             },
    //             {
    //                 'title': 'Tax Report',
    //                 'link': '/admin/report/taxReport',
    //                 'subModule': 'taxReport',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-list-alt',
    //                 'count': 'taxReport'
    //             },
    //             {
    //                 'title': 'Commission Report',
    //                 'link': '/admin/report/commissionReport',
    //                 'subModule': 'commissionReport',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-list-alt',
    //                 'count': 'commissionReport'
    //             },
    //             {
    //                 'title': 'Revenue Report',
    //                 'link': '/admin/report/revenueReport',
    //                 'subModule': 'revenueReport',
    //                 'dashboard': true,
    //                 'icon': 'fas fa-list-alt',
    //                 'count': 'revenueReport'
    //             },
    //         ],
    //         'count': 'order'
    //     },
    //     'page': {
    //         'title': 'Page',
    //         'dashboard': true,
    //         'dashboardLink': 'javascript:void(0)',
    //         'sidebar': true,
    //         'permissions': true,
    //         'icon': 'fas fa-feather-alt',
    //         'link': [
    //             {
    //                 'title': 'Terms And Conditions',
    //                 'link': '/admin/page/termsAndConditions',
    //                 'subModule': 'termsAndConditions'
    //             },
    //             {
    //                 'title': 'Privacy Policy',
    //                 'link': '/admin/page/privacyPolicy',
    //                 'subModule': 'privacyPolicy'
    //             },
    //             {
    //                 'title': 'About Us',
    //                 'link': '/admin/page/aboutUs',
    //                 'subModule': 'aboutUs'
    //             },
    //         ],
    //         'count': 3
    //     },
    //     'setting': {
    //         'title': 'Setting',
    //         'dashboard': true,
    //         'sidebar': true,
    //         'permissions': true,
    //         'icon': 'fas fa-cog',
    //         'link': '/admin/setting',
    //         'count': 1
    //     },
    //     'logout': {
    //         'title': 'Log Out',
    //         'dashboard': false,
    //         'sidebar': true,
    //         'sidebarAnchorClass': 'logout_btn',
    //         'permissions': false,
    //         'icon': 'fas fa-sign-out-alt',
    //         'color': 'bg-blue',
    //         'link': '/admin/logout',
    //         'count': 1
    //     },
    // },
    'sellerAdmin': {
        'dashboard': {
            'title': 'Dashboard',
            'dashboard': false,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-fire',
            'link': '/admin/dashboard',
            'count': 1
        },
        'manageShop': {
            'title': 'Manage Shop',
            'dashboard': true,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-store',
            'link': '/admin/manageShop',
            'count': 1
        },
        'shopCategory': {
            'title': 'Parent Category',
            'dashboard': true,
            'dashboardLink': '/admin/shopCategory/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-list',
            'link': [{
                    'title': 'Listing',
                    'link': '/admin/shopCategory/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/admin/shopCategory/add',
                    'subModule': 'add'
                },
            ],
            'count': 'parentcategory'
        },
        // 'todaysCategory': {
        //     'title': 'Today\'s Category',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/todaysCategory/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-clock',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/todaysCategory/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/todaysCategory/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'todaysCategory'
        // },
        // 'category': {
        //     'title': 'Sub Category',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/category/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-list',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/category/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/category/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'category'
        // },
        // 'RE:CIPES': {
        //     'title': 'Grocery & Staples',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/recipe/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fa fa-shopping-cart',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/recipe/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/recipe/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'recipe'
        // },
        // 'RE:TAIL': {
        //     'title': 'Fruits & Vegetables',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/retail/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-seedling',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/retail/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/retail/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'retail'
        // },
        // 'RE:VIVE': {
        //     'title': 'Breakfast & Diary',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/revive/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-coffee',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/revive/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/revive/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'revive'
        // },
        // 'RE:AD': {
        //     'title': 'Kitchen Needs',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/read/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-utensils',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/read/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/read/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'read'
        // },
        // 'RE:SET': {
        //     'title': 'Beverages',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/reset/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-beer',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/reset/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/reset/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'reset'
        // },
        'product': {
            'title': 'Product',
            'dashboard': true,
            'dashboardLink': '/admin/product/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-cubes',
            'link': [
                // {
                //     'title': 'Approval Requests',
                //     'link': '/admin/product/approvalRequests',
                //     'subModule': 'approvalRequests',
                // },
                {
                    'title': 'Listing',
                    'link': '/admin/product/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/admin/product/add',
                    'subModule': 'add'
                },
                // {
                //     'title': 'Import Export',
                //     'link': '/admin/product/importExport',
                //     'subModule': 'importExport',
                // },
                // {
                //     'title': 'Import Products',
                //     'link': 'javascript:void(0)',
                //     'subModule': 'importProductExcel',
                //     'class': 'importProductExcel'
                // },
                // {
                //     'title': 'Import Products Images',
                //     'link': 'javascript:void(0)',
                //     'subModule': 'importProductImages',
                //     'class': 'importProductImages'
                // },
            ],
            'count': 'product'
        },
        'user': {
            'title': 'User',
            'dashboard': true,
            'dashboardLink': '/admin/user/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'far fa-user',
            'link': [{
                    'title': 'Listing',
                    'link': '/admin/user/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/admin/user/add',
                    'subModule': 'add'
                },
            ],
            'count': 'user'
        },
        'orders': {
            'title': 'Orders',
            'dashboard': true,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-truck',
            'link': '/admin/orders',
            'count': 'order'
        },
        // 'cancellationRequests': {
        //     'title': 'Cancellation Requests',
        //     'dashboard': true,
        //     'sidebar': true,
        //     'permissions': false,
        //     'icon': 'fas fa-ban',
        //     'link': '/admin/cancellationRequests',
        //     'count': 'cancellationRequests'
        // },
        // 'orderReturnRequests': {
        //     'title': 'Order Return Requests',
        //     'dashboard': true,
        //     'sidebar': true,
        //     'permissions': false,
        //     'icon': 'fas fa-undo-alt',
        //     'link': '/admin/orderReturnRequests',
        //     'count': 'orderReturnRequests'
        // },
        // 'taxcategory': {
        //     'title': 'Tax Category',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/taxcategory/listing',
        //     'sidebar': true,
        //     'permissions': false,
        //     'icon': 'fas fa-hand-holding-usd',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/taxcategory/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/taxcategory/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'taxcategory'
        // },
        // 'report': {
        //     'title': 'Report',
        //     'dashboard': true,
        //     // 'dashboardLink': '/admin/report/salesReport',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-list-alt',
        //     'link': [
        //         {
        //             'title': 'Sales Report',
        //             'link': '/admin/report/salesReport',
        //             'subModule': 'salesReport',
        //             'dashboard': true,
        //             'icon': 'fas fa-list-alt',
        //             'count': 'salesReport'
        //         },
        //         {
        //             'title': 'Tax Report',
        //             'link': '/admin/report/taxReport',
        //             'subModule': 'taxReport',
        //             'dashboard': true,
        //             'icon': 'fas fa-list-alt',
        //             'count': 'taxReport'
        //         },
        //         {
        //             'title': 'Total Income Report',
        //             'link': '/admin/report/totalIncomeReport',
        //             'subModule': 'totalIncomeReport',
        //             'dashboard': true,
        //             'icon': 'fas fa-list-alt',
        //             'count': 'totalIncomeReport'
        //         },
        //     ],
        //     'count': 'order'
        // },
        'setting': {
            'title': 'Setting',
            'dashboard': true,
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-cog',
            'link': '/admin/setting',
            'count': 1
        },
        'logout': {
            'title': 'Log Out',
            'dashboard': false,
            'sidebar': true,
            'sidebarAnchorClass': 'logout_btn',
            'permissions': false,
            'icon': 'fas fa-sign-out-alt',
            'color': 'bg-blue',
            'link': '/admin/logout',
            'count': 1
        },
    }
};

module.exports = modules;