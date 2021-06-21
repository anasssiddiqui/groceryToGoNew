const model = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { Op } = require('sequelize');
const { request } = require('express');
const Page = model.page;

module.exports = {
    getPage: (accessor) => { 
        return async (req, res) => {
            try {        
                const page = await Page.findOne({
                    where: {
                        accessor
                    },
                    raw: true
                });
                 
                return helper.success(res, `${page.title} fetched successfully.`, page);
            } catch (err) {
                return helper.error(res, err);
            }
        }
    },
}