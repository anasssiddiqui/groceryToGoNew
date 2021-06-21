const models = require("../../models");
const helper = require("../../helpers/helper");
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require("express");
const { Op } = sequelize;
// const User = models.product;
// const UserDetail = models.userdetail;
// const DriverDetail = models.driverdetail;

const prefixBaseName = "admin";
const model = "categoryitem";
const modelcat = 'category';
const modelImageFolder = "categoryitem";
global.modelTitle = "Category Item";
global.modelDataTable = "productDataTable";

const modelBaseNames = {
  1: "recipe",
  2: "retail",
  3: "revive",
  4: "read",
  5: "reset",
};

const descriptionFieldTitles = {
  1: "Recipe",
  2: "Exercise",
  3: "Exercise",
  4: "Artical",
  5: "Exercise",
};

module.exports = {
  listing: (categoryId) => {
    return async (req, res) => {
      try {
        const category = await module.exports.checkCategory(
          req,
          res,
          categoryId
        );

        global.currentModule = category.name;
        global.currentSubModule = "Listing";
        global.currentSubModuleSidebar = "listing";
        const modelTitle = pluralize.singular(category.name);

        const listing = await module.exports.getListing(req, {
          categoryId,
        });
      //   const listingaa = await models[modelcat].findAll({
      //     order: [['id', 'DESC']],
      //     // hierarchy: true,
      //     raw: true,
      // });

        const parent = await module.exports.getParent();

            const parentCategoryObj = {};

            if (parent.length > 0) {
                parent.forEach(child => {
                    parentCategoryObj[child.value] = child.label;
                });
            }

        const data = listing.rows.map((categoryitem, index) => {
          const statusButton = {
            0: `<button model_id="${categoryitem.id}" model="${model}" status="${categoryitem.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
            1: `<button model_id="${categoryitem.id}" model="${model}" status="${categoryitem.status}" class="btn btn-outline-success status_btn" >Active</button>`,
          };

          const viewButton = `<a href="/${prefixBaseName}/${modelBaseNames[categoryId]}/view/${categoryitem.id}" class="btn btn-outline-info" >View</a>`;
          const editButton = `<a href="/${prefixBaseName}/${modelBaseNames[categoryId]}/edit/${categoryitem.id}" class="btn btn-outline-warning" >Edit</a>`;
          const deleteButton = `<button model_id="${categoryitem.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

          let action = "";
          action += viewButton;
          action += "&nbsp;";
          action += editButton;
          action += "&nbsp;";
          action += deleteButton;
          return Object.values({
            sno: parseInt(index) + 1,
            // image: `<img alt="image" src="${categoryitem.image}" class="datatable_list_image" data-toggle="tooltip" title="${categoryitem.image}">`,
            media:
              categoryitem.mediaType == 0
                ? `<image alt="media" src="${categoryitem.media}" style="max-width: 200px !important;" class="datatable_list_image" data-toggle="tooltip" title="${categoryitem.title}"  >`
                : `<video alt="media" src="${categoryitem.media}" style="max-width: 200px !important;" class="datatable_list_image" data-toggle="tooltip" title="${categoryitem.title}" controls >`,
                title: categoryitem.title,
                category:category.name,
                // parentCategory: parentCategoryObj[categoryitem.id] == categoryitem.parent.name ? 'Parent Category' : parentCategoryObj[categoryitem.id],
                subCategory:
                  categoryitem.subCategory &&
                  categoryitem.subCategory.hasOwnProperty("name")
                    ? categoryitem.subCategory.name
                    : "",
                quantity: categoryitem.quantity,
                introduction:
                  categoryitem.introduction.length > 100
                    ? categoryitem.introduction.slice(0, 100) + "..."
                    : categoryitem.introduction,
                description:
                  categoryitem.description.length > 100
                    ? categoryitem.description.slice(0, 100) + "..."
                    : categoryitem.description,
                status: statusButton[categoryitem.status],
                action,
              });
            });
    
            const headerColumns = Object.values({
              sno: "#",
              image: "Image / Video",
              title: "Title",
              category: 'Parent Category',
              subCategory: "Sub Category",
              quantity: "Quantity",
              introduction: "Introduction",
              description: descriptionFieldTitles[categoryId],
              status: "Status",
              action: "Action",
            });

        return res.render("admin/categoryitem/listing", {
          headerColumns,
          data,
        });
      } catch (err) {
        return helper.error(res, err);
      }
    };
  },
  addEditView: (type = "view", categoryId) => {
    return async (req, res) => {
      try {
        const category = await module.exports.checkCategory(
          req,
          res,
          categoryId
        );
        const subCategories = await module.exports.getSubCategories(
          req,
          res,
          categoryId
        );

        const modelBaseName = modelBaseNames[categoryId];
        const parent = await module.exports.getOnlyParentCategories();
        global.currentModule = category.name;
        global.currentSubModule = "Listing";
        global.currentSubModuleSidebar = "listing";
        const modelTitle = pluralize.singular(category.name);
        const descriptionFieldTitle = descriptionFieldTitles[categoryId];

        const categoryItem =
          type == "add"
            ? undefined
            : await module.exports.findOne(req.params.id);
        global.currentSubModule = helper.capitalizeFirstLetter(type);

        let recipeingredients = undefined;

        if (categoryItem) {
          recipeingredients = await models.recipeingredient.findAll({
            where: {
              categoryitemId: categoryItem.id,
            },
            raw: true,
          });
        }

        let recipeingredientsHTML = ``;

        if (recipeingredients && recipeingredients.length > 1) {
          for (i = 1; i < recipeingredients.length; i++) {
            recipeingredientsHTML += `
                        <div class="row single_row_container">
                            <div class="col-5 col-md-5 col-lg-5">
                                <div class="form-group">
                                <label>&nbsp;</label>
    
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <i class="fas fa-signature"></i>
                                    </div>
                                    </div>
                                    <input type="text" class="form-control" name="recipeingredientName"
                                    value="${recipeingredients[i].name}"
                                    required ${
                                      type == "view" ? "disabled" : ""
                                    }>
                                </div>
                                </div>
                            </div>
                            <div class="col-5 col-md-5 col-lg-5">
                                <label>&nbsp;</label>
                                <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <i class="fas fa-signature"></i>
                                    </div>
                                    </div>
                                    <input type="text" class="form-control" name="recipeingredientValue"
                                    value="${recipeingredients[i].value}"
                                    required ${
                                      type == "view" ? "disabled" : ""
                                    }>
                                </div>
                                </div>
                            </div>
                            <div class="col-2 col-md-2 col-lg-2">
                                <label>&nbsp;</label>
                                <div class="form-group">
                                    <input type="hidden" class="form-control" name="speecificationId" value="${
                                      recipeingredients[i]["id"]
                                    }" required>
                                    ${
                                      type != "view"
                                        ? `<a href="javascript:void(0)" class="btn btn-icon btn-danger delete_recipe_ingredient_row"><i class="fas fa-times"></i></a>`
                                        : ""
                                    }                                    
                                </div>
                            </div>
                            </div>
                        `;
          }
        }

        return res.render("admin/categoryitem/addEditView", {
          type,
          prefixBaseName,
          row: categoryItem,
          modelBaseName,
          parent,
          descriptionFieldTitle,
          categoryId,
          subCategories,
          recipeingredients,
          recipeingredientsHTML,
        });
      } catch (err) {
        return helper.error(res, err);
      }
    };
  },
  addUpdate: async (req, res) => {
    try {
      const required = {
        mediaType: req.body.mediaType,
        quantityType: req.body.quantityType,
      };
      const nonRequired = {
        id: req.body.id,
        image: req.files && req.files.image,
        // previewMedia: req.files && req.files.previewMedia,
        media: req.files && req.files.media,
        quantity: req.body.quantity,
        ...req.body,
      };

      let requestData = await helper.vaildObject(required, nonRequired);
      const parent = await module.exports.getOnlyParentCategories();
      const category = await module.exports.checkCategory(
        req,
        res,
        req.body.categoryId
      );

      // if (req.files && req.files.image && req.files.image.name) {
      //     const addedImage = helper.imageUpload(req.files.image, modelImageFolder);
      //     if (addedImage) requestData.image = addedImage;
      //     console.log('============================================>inside req.image');
      // } else {
      //     delete requestData.image;
      // }
      // console.log(requestData.image, '=========>requestData.image');

      // if (!requestData.hasOwnProperty('id')) {
      //     requestData.status = 1;
      // }

      // if (req.files && req.files.previewMedia) {
      //     requestData.previewMedia = helper.imageUpload(req.files.previewMedia, modelImageFolder);
      // }

      if (req.files && req.files.media) {
        requestData.media = helper.imageUpload(
          req.files.media,
          modelImageFolder
        );

        // requestData.watermarkVideo = await helper.watermarkUpload(req.files.media, requestData.media, modelImageFolder);
      }

      if (
        requestData.hasOwnProperty("previewMedia") &&
        requestData.previewMedia
      ) {
        requestData.previewMedia = await helper.base64ImageUpload(
          requestData.previewMedia,
          modelImageFolder
        );
        console.log(
          requestData.previewMedia,
          "====================>requestData.previewMedia"
        );
      } else {
        requestData.previewMedia = requestData.media;
      }

      if (requestData.mediaType == 2) {
        requestData.previewMedia = "titleWithBlack.png";
      }

      if (requestData.categoryId == 5 && requestData.mediaType == 2) {
        requestData.previewMedia = "Sandalwood.png";
      }

      console.log(
        JSON.stringify(requestData, null, 2),
        "=====================>requestData"
      );

      const modelId = await helper.save(models[model], requestData);

      if (
        category.id == 1 &&
        requestData.hasOwnProperty("recipeingredientName")
      ) {
        if (!Array.isArray(requestData.recipeingredientName))
          requestData.recipeingredientName = [requestData.recipeingredientName];

        if (requestData.recipeingredientName.length > 0) {
          await models.recipeingredient.destroy({
            where: {
              categoryitemId: modelId,
            },
            // truncate: true
          });

          const addRecipeIngredients = [];

          for (let i in requestData.recipeingredientName) {
            addRecipeIngredients.push({
              categoryitemId: modelId,
              name: requestData.recipeingredientName[i],
              value: requestData.recipeingredientValue[i],
              ...(requestData.hasOwnProperty("recipeingredientId") &&
              requestData.recipeingredientId.length > i
                ? { id: requestData.recipeingredientId[i] }
                : {}),
            });
          }

          console.log(
            addRecipeIngredients,
            "=================>addRecipeIngredients"
          );
          await models.recipeingredient.bulkCreate(addRecipeIngredients, {
            updateOnDuplicate: ["name", "value"],
          });
        }
      }

      const modelItem = await module.exports.findOne(modelId);
      console.log(
        modelItem,
        "=================================================>modelItem"
      );

      let message = `${category.name} ${
        requestData.hasOwnProperty("id") ? `Updated` : "Added"
      } Successfully.`;

      req.flash("flashMessage", { color: "success", message });

      res.redirect(`/admin/${modelBaseNames[category.id]}/listing`);
    } catch (err) {
      err.code = 200;
      return helper.error(res, err);
    }
  },
  // listing: async (req, res) => {
  //     try {
  //         global.currentModule = 'Product';
  //         global.currentSubModule = 'Listing';
  //         global.currentSubModuleSidebar = 'listing';
  //         const modelTitle = 'Product';

  //         const listing = await module.exports.getListing(req, adminData.id);
  //         const systemInventoryListing = await module.exports.getListing(req, 0);
  //         // console.log(listing, '===========================================>listing');

  //         const categories = await module.exports.getParent();

  //         const categoryObj = {};

  //         if (categories.length > 0) {
  //             categories.forEach(child => {
  //                 categoryObj[child.value] = child.label;
  //             });
  //         }

  //         /*
  //         |----------------------------------------------------------------------------------
  //         | My Invetory Data
  //         |----------------------------------------------------------------------------------
  //         |
  //          */

  //         const data = listing.rows.map((product, index) => {

  //             const statusButton = {
  //                 0: `<button model_id="${categoryitem.id}" model="${model}" status="${categoryitem.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
  //                 1: `<button model_id="${categoryitem.id}" model="${model}" status="${categoryitem.status}" class="btn btn-outline-success status_btn" >Active</button>`,
  //             }

  //             const viewButton = `<a href="/admin/categoryitem/view/${categoryitem.id}" class="btn btn-outline-info" >View</a>`;
  //             const editButton = `<a href="/admin/categoryitem/edit/${categoryitem.id}" class="btn btn-outline-warning" >Edit</a>`;
  //             const deleteButton = `<button model_id="${categoryitem.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

  //             let action = '';
  //             action += viewButton;
  //             action += '&nbsp;';
  //             action += editButton;
  //             action += '&nbsp;';
  //             action += deleteButton;

  //             return Object.values({
  //                 sno: parseInt(index) + 1,
  //                 image: `<img alt="image" src="${categoryitem.image}" class="datatable_list_image" data-toggle="tooltip" title="${categoryitem.image}">`,
  //                 name: categoryitem.name,
  //                 category: categoryObj[categoryitem.categoryId],
  //                 description: categoryitem.description,
  //                 brandName: categoryitem.brandName,
  //                 minimumSellingPrice: categoryitem.minimumSellingPrice,
  //                 percentageDiscount: categoryitem.percentageDiscount,
  //                 dateCreated: moment(categoryitem.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
  //                 status: statusButton[categoryitem.status],
  //                 action
  //             });
  //         });

  //         const headerColumns = Object.values({
  //             sno: '#',
  //             image: 'Image',
  //             name: 'Name',
  //             category: 'Category',
  //             description: 'Description',
  //             brandName: 'Brand Name',
  //             minimumSellingPrice: 'Minimum Selling Price',
  //             percentageDiscount: 'Percentage Discount',
  //             dateCreated: 'Date Created',
  //             status: 'Status',
  //             action: 'Action',
  //         });

  //         /*
  //         |----------------------------------------------------------------------------------
  //         | System Invetory Data
  //         |----------------------------------------------------------------------------------
  //         |
  //          */

  //         const dataSystemInventory = systemInventoryListing.rows.map((product, index) => {

  //             const statusButton = {
  //                 0: `<button model_id="${categoryitem.id}" model="${model}" status="${categoryitem.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
  //                 1: `<button model_id="${categoryitem.id}" model="${model}" status="${categoryitem.status}" class="btn btn-outline-success status_btn" >Active</button>`,
  //             }

  //             const addToMyInventoryButton = `<a href="/admin/categoryitem/addToMyInventory/${categoryitem.id}" class="btn btn-outline-success" >Add To My Inventory</a>`;
  //             const viewButton = `<a href="/admin/categoryitem/view/${categoryitem.id}" class="btn btn-outline-info" >View</a>`;
  //             const editButton = `<a href="/admin/categoryitem/edit/${categoryitem.id}" class="btn btn-outline-warning" >Edit</a>`;
  //             const deleteButton = `<button model_id="${categoryitem.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

  //             let action = '';
  //             action += addToMyInventoryButton;
  //             // action += '&nbsp;';
  //             // action += viewButton;
  //             // action += '&nbsp;';
  //             // action += editButton;
  //             // action += '&nbsp;';
  //             // action += deleteButton;

  //             return Object.values({
  //                 sno: parseInt(index) + 1,
  //                 image: `<img alt="image" src="${categoryitem.image}" class="datatable_list_image" data-toggle="tooltip" title="${categoryitem.image}">`,
  //                 name: categoryitem.name,
  //                 category: categoryObj[categoryitem.categoryId],
  //                 description: categoryitem.description,
  //                 brandName: categoryitem.brandName,
  //                 minimumSellingPrice: categoryitem.minimumSellingPrice,
  //                 percentageDiscount: categoryitem.percentageDiscount,
  //                 dateCreated: moment(categoryitem.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
  //                 // status: statusButton[categoryitem.status],
  //                 action
  //             });
  //         });

  //         const headerColumnsSystemInventory = Object.values({
  //             sno: '#',
  //             image: 'Image',
  //             name: 'Name',
  //             category: 'Category',
  //             description: 'Description',
  //             brandName: 'Brand Name',
  //             minimumSellingPrice: 'Minimum Selling Price',
  //             percentageDiscount: 'Percentage Discount',
  //             dateCreated: 'Date Created',
  //             // status: 'Status',
  //             action: 'Action',
  //         });

  //         return res.render('admin/categoryitem/listing', { headerColumns, data, headerColumnsSystemInventory, dataSystemInventory });
  //     } catch (err) {
  //         return helper.error(res, err);
  //     }
  // },
  add: async (req, res) => {
    try {
      global.currentModule = "Product";
      global.currentSubModule = "Add";
      global.currentSubModuleSidebar = "add";

      const taxCategories = await models["taxcategory"].findAll({
        where: {
          vendorId: adminData.id,
        },
      });

      const rootCategories = await models["category"].findAll({
        where: {
          status: 1,
          parentId: null,
        },
        raw: true,
      });
      // console.log(rootCategories, '========================>rootCategories');
      // return;

      let categories = await module.exports.getParent();
      if (categories.length > 0) {
        categories = categories.map((category) => ({
          id: category.value,
          name: category.label,
        }));
      }

      // const categories = await models['category'].findAll({
      //     order: [['name', 'ASC']]
      // });

      // const subCategories = await models['subCategory'].findAll({
      //     include: [
      //         {
      //             model: models['category'],
      //             required: true
      //         }
      //     ],
      //     order: [['name', 'ASC']]
      // });

      return res.render("admin/categoryitem/add", {
        taxCategories,
        categories,
        rootCategories,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },
  edit: async (req, res) => {
    try {
      global.currentModule = "Product";
      global.currentSubModuleSidebar = "listing";

      const product = await module.exports.findOneProduct(req.params.id);
      global.currentSubModule = `Edit`;

      const taxCategories = await models["taxcategory"].findAll({
        where: {
          vendorId: adminData.id,
        },
      });

      const productTags = await models["producttag"].findAll({
        where: {
          productId: categoryitem.id,
        },
      });

      // const categories = await models['category'].findAll({
      //     order: [['name', 'ASC']]
      // });

      let categories = await module.exports.getParent();
      if (categories.length > 0) {
        categories = categories.map((category) => ({
          id: category.value,
          name: category.label,
        }));
      }

      // const subCategories = await models['subCategory'].findAll({
      //     include: [
      //         {
      //             model: models['category'],
      //             required: true
      //         }
      //     ],
      //     order: [['name', 'ASC']]
      // });

      const productSpecifications = await models[
        "productspecification"
      ].findAll({
        where: {
          productId: categoryitem.id,
        },
        raw: true,
      });

      let productSpecificationsHTML = ``;

      if (productSpecifications.length > 1) {
        for (i = 1; i < productSpecifications.length; i++) {
          productSpecificationsHTML += `
                    <div class="row single_row_container">
                        <div class="col-5 col-md-5 col-lg-5">
                            <div class="form-group">
                            <label>&nbsp;</label>

                            <div class="input-group">
                                <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <i class="fas fa-signature"></i>
                                </div>
                                </div>
                                <input type="text" class="form-control" name="recipeingredientName"
                                value="${productSpecifications[i].name}"
                                required>
                            </div>
                            </div>
                        </div>
                        <div class="col-5 col-md-5 col-lg-5">
                            <label>&nbsp;</label>
                            <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <i class="fas fa-signature"></i>
                                </div>
                                </div>
                                <input type="text" class="form-control" name="recipeingredientValue"
                                value="${productSpecifications[i].value}"
                                required>
                            </div>
                            </div>
                        </div>
                        <div class="col-2 col-md-2 col-lg-2">
                            <label>&nbsp;</label>
                            <div class="form-group">
                                <input type="hidden" class="form-control" name="speecificationId" value="${productSpecifications[i]["id"]}" required>
                                <a href="javascript:void(0)" class="btn btn-icon btn-danger delete_product_specification_row"><i class="fas fa-times"></i></a>
                            </div>
                        </div>
                        </div>
                    `;
        }
      }

      return res.render("admin/categoryitem/edit", {
        product,
        taxCategories,
        productTags,
        categories,
        productSpecifications,
        productSpecificationsHTML,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },
  addToMyInventory: async (req, res) => {
    try {
      global.currentModule = "Product";
      global.currentSubModuleSidebar = "listing";

      const product = await module.exports.findOneProduct(req.params.id);
      global.currentSubModule = `Edit`;

      const taxCategories = await models["taxcategory"].findAll({
        where: {
          vendorId: adminData.id,
        },
      });

      const productTags = await models["producttag"].findAll({
        where: {
          productId: categoryitem.id,
        },
      });

      // const categories = await models['category'].findAll({
      //     order: [['name', 'ASC']]
      // });

      let categories = await module.exports.getParent();
      if (categories.length > 0) {
        categories = categories.map((category) => ({
          id: category.value,
          name: category.label,
        }));
      }

      // const subCategories = await models['subCategory'].findAll({
      //     include: [
      //         {
      //             model: models['category'],
      //             required: true
      //         }
      //     ],
      //     order: [['name', 'ASC']]
      // });

      const productSpecifications = await models[
        "productspecification"
      ].findAll({
        where: {
          productId: categoryitem.id,
        },
        raw: true,
      });

      let productSpecificationsHTML = ``;

      if (productSpecifications.length > 1) {
        for (i = 1; i < productSpecifications.length; i++) {
          productSpecificationsHTML += `
                    <div class="row single_row_container">
                        <div class="col-5 col-md-5 col-lg-5">
                            <div class="form-group">
                            <label>&nbsp;</label>

                            <div class="input-group">
                                <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <i class="fas fa-signature"></i>
                                </div>
                                </div>
                                <input type="text" class="form-control" name="recipeingredientName"
                                value="${productSpecifications[i].name}"
                                required>
                            </div>
                            </div>
                        </div>
                        <div class="col-5 col-md-5 col-lg-5">
                            <label>&nbsp;</label>
                            <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <i class="fas fa-signature"></i>
                                </div>
                                </div>
                                <input type="text" class="form-control" name="recipeingredientValue"
                                value="${productSpecifications[i].value}"
                                required>
                            </div>
                            </div>
                        </div>
                        <div class="col-2 col-md-2 col-lg-2">
                            <label>&nbsp;</label>
                            <div class="form-group">
                                <input type="hidden" class="form-control" name="speecificationId" value="${productSpecifications[i]["id"]}" required>
                                <a href="javascript:void(0)" class="btn btn-icon btn-danger delete_product_specification_row"><i class="fas fa-times"></i></a>
                            </div>
                        </div>
                        </div>
                    `;
        }
      }

      return res.render("admin/categoryitem/addToMyInventory", {
        product,
        taxCategories,
        productTags,
        categories,
        productSpecifications,
        productSpecificationsHTML,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },
  view: async (req, res) => {
    try {
      global.currentModule = "Product";
      global.currentSubModuleSidebar = "listing";

      const product = await module.exports.findOneProduct(req.params.id);
      global.currentSubModule = `View`;

      const taxCategories = await models["taxcategory"].findAll({
        where: {
          vendorId: adminData.id,
        },
      });

      const productTags = await models["producttag"].findAll({
        where: {
          productId: categoryitem.id,
        },
      });

      // const categories = await models['category'].findAll({
      //     order: [['name', 'ASC']]
      // });

      let categories = await module.exports.getParent();
      if (categories.length > 0) {
        categories = categories.map((category) => ({
          id: category.value,
          name: category.label,
        }));
      }

      const subCategories = await models["subCategory"].findAll({
        include: [
          {
            model: models["category"],
            required: true,
          },
        ],
        order: [["name", "ASC"]],
      });

      return res.render("admin/categoryitem/view", {
        product,
        taxCategories,
        productTags,
        categories,
        subCategories,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },
  addUpdateProduct: async (req, res) => {
    try {
      const required = {};
      const nonRequired = {
        id: req.body.id,
        tags: req.body.tags,
        imageSystemInventory: req.body.imageSystemInventory,
        image: req.files && req.files.image,
        vendorId: adminData.id,
        taxCategoryId: req.body.taxCategoryId,
        name: req.body.name,
        description: req.body.description,
        brandName: req.body.brandName,
        minimumSellingPrice: req.body.minimumSellingPrice,
        percentageDiscount: req.body.percentageDiscount,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
        dimensionsUnit: req.body.dimensionsUnit,
        weight: req.body.weight,
        weightUnit: req.body.weightUnit,
        // tags: req.body.tags,
        status: req.body.status,
        categoryId: req.body.categoryId,
        // subCategoryId: req.body.subCategoryId,
        recipeingredientName: req.body.recipeingredientName,
        recipeingredientValue: req.body.recipeingredientValue,
      };

      let requestData = await helper.vaildObject(required, nonRequired);

      if (requestData.hasOwnProperty("imageSystemInventory")) {
        const imageSystemInventoryArray = requestData.imageSystemInventory.split(
          "/"
        );
        console.log(
          imageSystemInventoryArray,
          "=========>imageSystemInventoryArray"
        );
        console.log(
          imageSystemInventoryArray[imageSystemInventoryArray.length - 1],
          "=========>imageSystemInventoryArray[imageSystemInventoryArray.length-1]"
        );
        requestData.image =
          imageSystemInventoryArray[imageSystemInventoryArray.length - 1];
        console.log(requestData.image, "=========>requestData.image");
      }

      console.log(requestData.image, "=========>requestData.image");

      if (req.files && req.files.image) {
        const addedImage = helper.imageUpload(req.files.image, "product");
        if (addedImage) requestData.image = addedImage;
        console.log("============================================>here");
      }
      console.log(requestData.image, "=========>requestData.image");

      if (!requestData.hasOwnProperty("id")) {
        requestData.status = 1;
      }

      console.log(
        JSON.stringify(requestData, null, 2),
        "=====================>requestData"
      );

      const productId = await helper.save(models[model], requestData);

      if (requestData.tags && requestData.tags.length > 0) {
        if (
          !Array.isArray(requestData.tags) &&
          typeof requestData.tags == "string"
        )
          requestData.tags = [requestData.tags];

        await models["producttag"].destroy({
          where: {
            productId,
          },
        });

        let addTagsObj = requestData.tags.map((tag) => ({
          productId,
          tag,
        }));

        // if (requestData.hasOwnProperty('id')) {
        //     const productTags = await models['producttag'].findAll({
        //         where: {
        //             productId: requestData.id
        //         }
        //     }).map(producttag => producttag.tag);

        //     addTagsObj = addTagsObj.filter(tagObj => {
        //         return !productTags.includes(tagObj.tag);
        //     });
        // }

        await models["producttag"].bulkCreate(addTagsObj);
      }

      if (requestData.hasOwnProperty("recipeingredientName")) {
        if (!Array.isArray(requestData.recipeingredientName))
          requestData.recipeingredientName = [requestData.recipeingredientName];

        if (requestData.recipeingredientName.length > 0) {
          await models["productspecification"].destroy({
            where: {
              productId,
            },
            // truncate: true
          });

          const addProductSpecification = [];

          for (let i in requestData.recipeingredientName) {
            addProductSpecification.push({
              productId,
              name: requestData.recipeingredientName[i],
              value: requestData.recipeingredientValue[i],
              ...(requestData.hasOwnProperty("speecificationId") &&
              requestData.speecificationId.length > i
                ? { id: requestData.speecificationId[i] }
                : {}),
            });
          }

          console.log(
            addProductSpecification,
            "=================>addProductSpecification"
          );
          await models["productspecification"].bulkCreate(
            addProductSpecification,
            {
              updateOnDuplicate: ["name", "value"],
            }
          );
        }
      }

      // if (requestData.recipeingredientName.length > 0) {
      //     await models['productspecification'].destroy(
      //         {
      //             where: {
      //                 productId
      //             },
      //             // truncate: true
      //         }
      //     );

      //     const addProductSpecification = [];

      //     for (let i in requestData.recipeingredientName) {
      //         addProductSpecification.push({
      //             productId,
      //             name: requestData.recipeingredientName[i],
      //             value: requestData.recipeingredientValue[i],
      //             ...(requestData.hasOwnProperty('speecificationId') && requestData.speecificationId.length > i ? { id: requestData.speecificationId[i] } : {})
      //         });
      //     }

      //     console.log(addProductSpecification, '=================>addProductSpecification');
      //     await models['productspecification'].bulkCreate(addProductSpecification, { updateOnDuplicate: ['name', 'value'] });
      // }

      const product = await module.exports.findOneProduct(productId);
      console.log(
        product,
        "=================================================>product"
      );

      let message = `Product ${
        requestData.hasOwnProperty("id") ? `Updated` : "Added"
      } Successfully.`;

      req.flash("flashMessage", { color: "success", message });

      res.redirect("/admin/categoryitem/listing");
    } catch (err) {
      err.code = 200;
      return helper.error(res, err);
    }
  }, 
  getOnlyParentCategories: async (id = undefined) => {
    const categories = await models[modelcat].findAll({
        where: {
            parentId: null,
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
  findOne: async (id) => {
    return await models[model]
      .findOne({
        where: {
          id,
        },
        attributes: {
          include: [
            // [sequelize.literal(`(IF (\`categoryitem\`.\`image\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/categoryitem/', \`categoryitem\`.\`image\`)) )`), 'image'],
            [
              sequelize.literal(
                `(IF (\`${model}\`.\`media\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/${modelImageFolder}/', \`${model}\`.\`media\`)) )`
              ),
              "media",
            ],
            [
              sequelize.literal(
                `(IF (\`${model}\`.\`previewMedia\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/${modelImageFolder}/', \`${model}\`.\`previewMedia\`)) )`
              ),
              "previewMedia",
            ],
          ],
        },
        // raw: true,
        // nest: true
      })
      .then((modelItem) => (modelItem ? modelItem.toJSON() : modelItem));
  },

  productCategorySelect: async (req, res) => {
    try {
      global.currentModule = "Product";
      global.currentSubModuleSidebar = "";

      const required = {
        categoryId: req.body.categoryId,
      };
      const nonRequired = {};

      console.log(required, "========.required");

      let requestData = await helper.vaildObject(required, nonRequired);

      const subCategories = await models["subCategory"].findAll({
        where: {
          categoryId: requestData.categoryId,
        },
      });

      let html = ``;

      html += `
                <div class="subCategoryContainer">
                  <div class="form-group">
                    <label> Sub Category</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          <i class="fas fa-list"></i>
                        </div>
                      </div>
                    <select name="subCategoryId" class="form-control select2" required>`;
      if (subCategories.length > 0) {
        html += `<option value="">Select Sub Category</option>`;
        subCategories.forEach((subCategory) => {
          html += `<option value="${subCategory.id}">
                                                    ${subCategory.name}
                                                </option>`;
        });
      } else {
        html += `<option value="">No Sub Category Found</option>`;
      }
      html += `</select>  
                        </div>
                        </div>
                    </div>
              `;

      return helper.success(
        res,
        `Sub Category Fetched for product successfully`,
        html
      );
    } catch (err) {
      err.code = 200;
      return helper.error(res, err);
    }
  },

  getParent: async (id = undefined) => {
    const categories = await models["category"].findAll({
        order: [['id', 'DESC']],
        hierarchy: true,
        raw: true,
    });

    console.log(JSON.stringify(categories, null, 2), '===============>categories');

    let parent = [];

    const checkChildren = (children, hierarchyArray) => {
        if (children.length == 0) return;

        children.forEach(child => {
            if (id && child.id == id) return;

            console.log(child.name, '================>child.name');
            const newHierarchyArray = JSON.parse(JSON.stringify(hierarchyArray));
            newHierarchyArray.push(child.name);
            parent.push({
                value: child.id,
                label: newHierarchyArray.join(' > ')
            });

            if (child.hasOwnProperty('children') && child.children.length > 0) {
                checkChildren(child.children, newHierarchyArray);
            }
        });
    }

    if (categories.length > 0) {
        categories.forEach(category => {
            parent.push({
                value: category.id,
                label: category.name
            });

            if (category.hasOwnProperty('children') && category.children.length > 0) {
                const hierarchyArray = [];
                hierarchyArray.push(category.name);
                checkChildren(category.children, hierarchyArray);
            }
        });
    }

    console.log(JSON.stringify(parent, null, 2), '===================>data');
    // return;

    parent.unshift({
        value: '0',
        label: 'Choose as a Parent Category'
    });

    return parent;
},
  getListing: async (req, where = {}) => {
    return await await models[model].findAndCountAll({
      where: {
        ...where,
        // ...(
        //     vendorId != undefined
        //         ? { vendorId }
        //         : {}
        // )
      },
      include: [
        {
          model: models.category,
          as: "parentCategory",
        },],
      include: [
        {
          model: models.category,
          as: "subCategory",
        },
        //     {

        //         model: models['user'],
        //         as: 'vendor',
        //         include: [
        //             {
        //                 model: models['vendordetail'],
        //                 attributes: {
        //                     include: [
        //                         [sequelize.literal(`(IF (\`vendor->vendordetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/categoryitem/', \`vendor->vendordetail\`.\`image\`)) )`), 'image']
        //                     ]
        //                 }
        //             },
        //         ]
        //     },
      ],
      attributes: {
        include: [
          // [sequelize.literal(`(IF (\`categoryitem\`.\`image\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/categoryitem/', \`categoryitem\`.\`image\`)) )`), 'image'],
          [
            sequelize.literal(
              `(IF (\`${model}\`.\`media\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/${modelImageFolder}/', \`${model}\`.\`media\`)) )`
            ),
            "media",
          ],
          [
            sequelize.literal(
              `(IF (\`${model}\`.\`previewMedia\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/${modelImageFolder}/', \`${model}\`.\`previewMedia\`)) )`
            ),
            "previewMedia",
          ],
        ],
      },
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });
  },
  checkCategory: async (req, res, categoryId) => {
    const category = await models.category.findOne({
      where: {
        id: categoryId,
      },
      raw: true,
    });

    if (!category) throw "Main Category could not be found.";

    return category;
  },
  getSubCategories: async (req, res, categoryId) => {
    return await models.category
      .findAll({
        where: {
          parentId: categoryId,
          status: 1,
        },
      })
      .map((row) => row.toJSON());
  },
};
