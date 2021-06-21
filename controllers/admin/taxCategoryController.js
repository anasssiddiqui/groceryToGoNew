const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userdetail;
// const DriverDetail = models.driverdetail;

const model = "taxcategory";
global.modelTitle = "Tax Category";
global.modelDataTable = "";


module.exports = {
    listing: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModule = 'Listing';
            global.currentSubModuleSidebar = 'listing';
            const modelTitle = 'Tax Category';

            const listing = await models[model].findAll({
                where: {
                    vendorId: adminData.id
                },
                order: [['id', 'DESC']],
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');

            const data = listing.map((taxcategory, index) => {


                const statusButton = {
                    0: `<button model_id="${taxcategory.id}" model="${model}" status="${taxcategory.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
                    1: `<button model_id="${taxcategory.id}" model="${model}" status="${taxcategory.status}" class="btn btn-outline-success status_btn" >Active</button>`,
                }


                const viewButton = `<a href="/admin/taxcategory/view/${taxcategory.id}" class="btn btn-outline-info" >View</a>`;
                const editButton = `<a href="/admin/taxcategory/edit/${taxcategory.id}" class="btn btn-outline-warning" >Edit</a>`;
                const deleteButton = `<button model_id="${taxcategory.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

                let action = '';
                action += viewButton;
                action += '&nbsp;';
                action += editButton;
                action += '&nbsp;';
                action += deleteButton;

                return Object.values({
                    sno: parseInt(index) + 1,
                    taxcategory: taxcategory.taxcategory,
                    taxInPercent: taxcategory.taxInPercent == 0 ? 'No' : 'Yes',
                    taxValue: taxcategory.taxValue,
                    dateCreated: moment(taxcategory.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    status: statusButton[taxcategory.status],
                    action
                });
            });

            const headerColumns = Object.values({
                sno: '#',
                taxcategory: 'Tax Category',
                taxInPercent: 'Tax in Percent',
                taxValue: 'Tax Value',
                dateCreated: 'Date Created',
                status: 'Tax Amount',
                action: 'Action',
            });

            return res.render('admin/taxcategory/listing', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    add: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModule = 'Add';
            global.currentSubModuleSidebar = 'add';

            return res.render('admin/taxcategory/addEdit', { taxcategory: undefined });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    edit: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModuleSidebar = '';

            const taxcategory = await module.exports.findOneTaxCategory(req.params.id);
            global.currentSubModule = `Edit`;

            return res.render('admin/taxcategory/addEdit', { taxcategory });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    view: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModuleSidebar = 'listing';

            const taxcategory = await module.exports.findOneTaxCategory(req.params.id);
            global.currentSubModule = `View`;

            return res.render('admin/taxcategory/view', { taxcategory });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addUpdateTaxCategory: async (req, res) => {
        try {
            const required = {
                vendorId: adminData.id,
                taxcategory: req.body.taxcategory,
                taxInPercent: req.body.taxInPercent,
                taxValue: req.body.taxValue,
            };
            const nonRequired = {
                id: req.body.id,
                image: req.files && req.files.image
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (req.files && req.files.image) {
                requestData.image = helper.imageUpload(req.files.image, 'taxcategory');
            }

            const taxCategoryId = await helper.save(models[model], requestData);
            const taxcategory = await module.exports.findOneTaxCategory(taxCategoryId);
            console.log(taxcategory, '=================================================>taxcategory');

            let message = `Tax Category ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            res.redirect('/admin/taxcategory/listing');
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOneTaxCategory: async (id) => {
        return await models[model].findOne({
            where: {
                id,
                vendorId: adminData.id
            },
            order: [['id', 'DESC']],
            raw: true,
            nest: true
        });
    },

}