const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const category = require('../../models/category');
const { Op } = sequelize;

const prefixBaseName = 'admin';
const model = 'todayscategory';
const modelBaseName = 'todaysCategory';
const modelTitle = 'Today\'s Category';
const modelImageFolder = 'todaysCategory';
const modelDataTable = '';

module.exports = {
    listing: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModule = 'Listing';
            global.currentSubModuleSidebar = 'listing';

            const listing = await module.exports.findAll(req, res);

            console.log(JSON.stringify(listing, null, 2), '===============>listing');
            // return;


            const data = await Promise.all(listing.map(async (row, index) => {
                const todaysCategoryItems = await module.exports.categoryBasedCategoryItems(req, res, row.id);
                
                console.log(todaysCategoryItems, '========>todaysCategoryItems');
                
                let categoryItemSelect = ``;
                categoryItemSelect += `<select class="changeTodayCategoryItem select2" model="${model}" model_title="${row.category.name}" model_id="${row.id}" field="categoryitemId" style="font-weight: 600; width: 100%;" >`;
                for (let key in todaysCategoryItems) {
                    const todaysCategoryItem = todaysCategoryItems[key];
                    console.log(todaysCategoryItem, '============>todaysCategoryItem');
                    categoryItemSelect += `<option value="${todaysCategoryItem.id}" ${row.categoryitemId == todaysCategoryItem.id ? 'selected' : ''} style="font-weight: 600;" >${todaysCategoryItem.title}</option>`;
                }
                categoryItemSelect += `</select>`;

                return Object.values({
                    sno: parseInt(index) + 1,
                    // id: row.id,
                    category: row.category.name,
                    categoryItem: categoryItemSelect,
                });
            }));

            const headerColumns = Object.values({
                sno: '#',
                category: 'Category',
                categoryItem: 'Category Item',
            });

            return res.render(`${prefixBaseName}/${modelBaseName}/listing`, { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    add: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModule = 'Add';
            global.currentSubModuleSidebar = 'add';

            const parent = await module.exports.getOnlyParentCategories();
            // const parent = await module.exports.getParent();

            return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, { row: undefined, prefixBaseName, modelBaseName, parent });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    edit: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModuleSidebar = '';
            global.currentSubModule = `Edit`;

            const row = await module.exports.findOne(req.params.id);

            const parent = await module.exports.getOnlyParentCategories(req.params.id);
            // const parent = await module.exports.getParent(req.params.id);

            return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, { row, prefixBaseName, modelBaseName, parent });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    view: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModuleSidebar = 'listing';

            global.currentSubModule = `View`;
            const row = await module.exports.findOne(req.params.id);

            console.log(JSON.stringify(row, null, 2), '====================================>row');

            // function getHierarchy(row) {
            //     if (!row) return;
            //     let html = '';
            //     html += `
            //     <ul>
            //         <li>${row && row.name}</li>`;
            //     if (row.hasOwnProperty('children') && Array.isArray(row.children)) {
            //         row.children.forEach(child => {
            //             html += getHierarchy(child);
            //         });
            //     }
            //     html += `</ul>`;
            //     return html;
            // }

            const parent = await module.exports.getParent();

            return res.render(`${prefixBaseName}//${modelBaseName}/view`, { row, prefixBaseName, modelBaseName, parent });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addUpdate: async (req, res) => {
        try {
            const required = {
                vendorId: adminData.id,
                name: req.body.name,
            };
            const nonRequired = {
                id: req.body.id,
                image: req.files && req.files.image,
                // parentId: req.body.parentId,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            console.log(requestData, '====================>requestData');

            // if (requestData.parentId == '0') requestData.parentId = null;

            if (!(requestData.hasOwnProperty('id') && requestData.id)) {
                const categoryWithSameName = await models.category.findOne({
                    where: {
                        name: requestData.name,
                        // parentId: requestData.parentId
                    }
                });

                if (categoryWithSameName) {
                    req.flash('flashMessage', { color: 'error', message: 'Category with same name already exists.' });

                    return res.redirect(`/${prefixBaseName}/${modelBaseName}/listing`);
                }
            }

            if (req.files && req.files.image) {
                requestData.image = helper.imageUpload(req.files.image, modelImageFolder);
            }

            console.log(requestData, '===============>requestData after');

            const rowId = await helper.save(models[model], requestData);
            const row = await module.exports.findOne(rowId);
            console.log(row, '=================================================>row');

            let message = `${modelTitle} ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            res.redirect(`/${prefixBaseName}/${modelBaseName}/listing`);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOne: async (id) => {
        return await models[model].findOne({
            where: { id },
            raw: true
        });
    },
    getOnlyParentCategories: async (id = undefined) => {
        const categories = await models[model].findAll({
            where: {
                // parentId: null,
            },
            order: [['id', 'ASC']],
            // hierarchy: true,
            // raw: true,
        }).map(category => {
            category = category.toJSON();

            return {
                label: category.name,
                value: category.id,
            };
        });

        return categories;
    },
    getParent: async (id = undefined) => {
        const categories = await models[model].findAll({
            order: [['id', 'DESC']],
            // hierarchy: true,
            raw: true,
        });

        console.log(JSON.stringify(categories, null, 2), '===============>categories');

        let parent = [];

        // const checkChildren = (children, hierarchyArray) => {
        //     if (children.length == 0) return;

        //     children.forEach(child => {
        //         if (id && child.id == id) return;

        //         console.log(child.name, '================>child.name');
        //         const newHierarchyArray = JSON.parse(JSON.stringify(hierarchyArray));
        //         newHierarchyArray.push(child.name);
        //         parent.push({
        //             value: child.id,
        //             label: newHierarchyArray.join(' > ')
        //         });

        //         if (child.hasOwnProperty('children') && child.children.length > 0) {
        //             checkChildren(child.children, newHierarchyArray);
        //         }
        //     });
        // }

        // if (categories.length > 0) {
        //     categories.forEach(category => {
        //         parent.push({
        //             value: category.id,
        //             label: category.name
        //         });

        //         if (category.hasOwnProperty('children') && category.children.length > 0) {
        //             const hierarchyArray = [];
        //             hierarchyArray.push(category.name);
        //             checkChildren(category.children, hierarchyArray);
        //         }
        //     });
        // }

        console.log(JSON.stringify(parent, null, 2), '===================>data');
        // return;

        parent.unshift({
            value: '0',
            label: 'Choose as a Parent Category'
        });

        return parent;
    },
    categoryBasedChildCategories: async (req, res) => {
        try {
            const requestData = helper.clone(req.body);
            console.log(requestData, '=============>requestData');

            const childCategories = await models[model].findAll({
                where: {
                    // parentId: requestData.id,
                    status: 1
                },
                raw: true
            });

            return helper.success(res, `Child Categories fetched successfully`, childCategories);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    categoryBasedCategoryItems: async (req, res, categoryId) => {
        return await models['categoryitem'].findAll({
            where: {
                categoryId,
                status: 1
            },
        }).map(category => category.toJSON());
    },
    findAll: async (req, res, where = {}, Object) => {
        return await models[model].findAll({
            where: {
                ...where,
            },
            include: [
                {
                    model: models.category,
                    required: true,
                },
                {
                    model: models.categoryitem,
                },
            ],
            ...Object
        }).map(modelItem => {
            modelItem = modelItem.toJSON();
            return modelItem;
        });

    },

}