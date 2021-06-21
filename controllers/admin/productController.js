const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const { Op } = sequelize;
// const User = models.product;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const model = "product";
global.modelTitle = "Product";
global.modelDataTable = "productDataTable";

module.exports = {
	approvalRequests: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModule = 'Approval Requests';
			global.currentSubModuleSidebar = 'approvalRequests';
			const modelTitle = 'Product';

			const listing = await models[model].findAndCountAll({
				where: {
					isApproved: 0
				},
				include: [
					{

						model: models['user'],
						as: 'vendor',
						include: [
							{
								model: models['vendorDetail'],
								attributes: {
									include: [
										[sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/product/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
									]
								}
							},
						]
					},
				],
				attributes: {
					include: [
						[sequelize.literal(`(IF (\`product\`.\`image\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/product/', \`product\`.\`image\`)) )`), 'image']
					]
				},
				order: [['id', 'DESC']],
				raw: true,
				nest: true
			});
			console.log(JSON.stringify(listing, null, 2), '===========================================>listing');

			const data = listing.rows.map((product, index) => {


				const statusButton = {
					0: `<button model_id="${product.id}" model="${model}" status="${product.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
					1: `<button model_id="${product.id}" model="${model}" status="${product.status}" class="btn btn-outline-success status_btn" >Active</button>`,
				}

				// const isApprovedButton = {
				// 	0: `<button model_id="${product.id}" model="${model}" status="${product.isApproved}" class="btn btn-outline-danger approved_btn" >Pending</button>`,
				// 	1: `<button model_id="${product.id}" model="${model}" status="${product.isApproved}" class="btn btn-outline-success approved_btn" >Approved</button>`,
				// }


				const viewButton = `<a href="/admin/product/view/${product.id}" class="btn btn-outline-info" >View</a>`;
				const editButton = `<a href="/admin/product/edit/${product.id}" class="btn btn-outline-warning" >Edit</a>`;
				const deleteButton = `<button model_id="${product.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

				let action = '';
				action += viewButton;
				action += '&nbsp;';
				action += editButton;
				action += '&nbsp;';
				action += deleteButton;

				return Object.values({
					sno: parseInt(index) + 1,
					// isApproved: isApprovedButton[product.isApproved],
					image: `<img alt="image" src="${product.image}" class="datatable_list_image" data-toggle="tooltip" title="${product.image}">`,
					vendor: product.vendor && product.vendor.vendorDetail ? product.vendor.vendorDetail.name : 'Admin',
					price: product.price,
					name: product.name,
					description: product.description,
					
					// brandName: product.brandName,
					// mrp: product.mrp,
					// percentageDiscount: product.percentageDiscount,
					dateCreated: moment(product.createdAt).format('dddd, MMMM Do YYYY'),
					status: statusButton[product.status],
					action
				});
			});

			const headerColumns = Object.values({
				sno: '#',
				isApproved: 'Approval Status',
				image: 'Image',
				vendor: 'Vendor',
				price: 'price',
				name: 'Name',
				description: 'Description',
				
				// brandName: 'Brand Name',
				// mrp: 'MRP',
				// percentageDiscount: 'Percentage Discount',
				dateCreated: 'Date Created',
				status: 'Tax Amount',
				action: 'Action',
			});

			return res.render('admin/product/listing', { headerColumns, data });
		} catch (err) {
			return helper.error(res, err);
		}
	},
	listing: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModule = 'Listing';
			global.currentSubModuleSidebar = 'listing';
			const modelTitle = 'Product';

			const listing = await models[model].findAndCountAll({
				where: {
					vendorId: 0
				},
				// include: [
				// 	{
				// 		model: models['user'],
				// 		as: 'vendor',
				// 		include: [
				// 			{
				// 				model: models['vendorDetail'],
				// 				attributes: {
				// 					include: [
				// 						[sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/product/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
				// 					]
				// 				}
				// 			},
				// 		]
				// 	},
				// ],
				attributes: {
					include: [
						[sequelize.literal(`(IF (\`product\`.\`image\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/product/', \`product\`.\`image\`)) )`), 'image']
					]
				},
				order: [['id', 'DESC']],
				raw: true,
				nest: true
			});
			// console.log(listing, '===========================================>listing');


			const categories = await module.exports.getParent();

			const categoryObj = {};

			if (categories.length > 0) {
				categories.forEach(child => {
					categoryObj[child.value] = child.label;
				});
			}


			const data = listing.rows.map((product, index) => {


				const statusButton = {
					0: `<button model_id="${product.id}" model="${model}" status="${product.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
					1: `<button model_id="${product.id}" model="${model}" status="${product.status}" class="btn btn-outline-success status_btn" >Active</button>`,
				}


				const viewButton = `<a href="/admin/product/view/${product.id}" class="btn btn-outline-info" >View</a>`;
				const editButton = `<a href="/admin/product/edit/${product.id}" class="btn btn-outline-warning" >Edit</a>`;
				const deleteButton = `<button model_id="${product.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

				let action = '';
				action += viewButton;
				action += '&nbsp;';
				action += editButton;
				action += '&nbsp;';
				action += deleteButton;

				return Object.values({
					sno: parseInt(index) + 1,
					image: `<img alt="image" src="${product.image}" class="datatable_list_image" data-toggle="tooltip" title="${product.image}">`,
					name: product.name,
					category: categoryObj[product.categoryId],
					description: product.description,
					price: product.price,
					weight: product.weight,
					// brandName: product.brandName,
					// mrp: product.mrp,
					// percentageDiscount: product.percentageDiscount,
					// dateCreated: moment(product.createdAt).format('dddd, MMMM Do YYYY'),
					status: statusButton[product.status],
					action
				});
			});

			const headerColumns = Object.values({
				sno: '#',
				image: 'Image',
				name: 'Name',
				category: 'Category',
				description: 'Description',
				price: 'Price',
				weight: 'Quantity',
				// brandName: 'Brand Name',
				// mrp: 'MRP',
				// percentageDiscount: 'Percentage Discount',
				// dateCreated: 'Date Created',
				status: 'Status',
				action: 'Action',
			});

			return res.render('admin/product/listing', { headerColumns, data });
		} catch (err) {
			return helper.error(res, err);
		}
	},
	add: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModule = 'Add';
			global.currentSubModuleSidebar = 'add';

			// const taxCategories = await models['taxCategory'].findAll({
			// 	where: {
			// 		// vendorId: adminData.id
			// 	}
			// });

			const rootCategories = await models['category'].findAll({
				where: {
					status: 1,
					parentId: null
				},
				raw: true
			});
			// console.log(rootCategories, '========================>rootCategories');
			// return;


			let categories = await module.exports.getParent();
			if (categories.length > 0) {
				categories = categories.map(category => ({
					id: category.value,
					name: category.label
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

			return res.render('admin/product/add', { categories, rootCategories });
		} catch (err) {
			return helper.error(res, err);
		}
	},
	edit: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModuleSidebar = 'listing';

			const product = await module.exports.findOneProduct(req.params.id);
			global.currentSubModule = `Edit`;

			// const taxCategories = await models['taxCategory'].findAll({
			// 	where: {
			// 		// vendorId: adminData.id
			// 	}
			// });

			// const productTags = await models['productTag'].findAll({
			// 	where: {
			// 		productId: product.id
			// 	}
			// });

			// const categories = await models['category'].findAll({
			//     order: [['name', 'ASC']]
			// });

			let categories = await module.exports.getParent();
			if (categories.length > 0) {
				categories = categories.map(category => ({
					id: category.value,
					name: category.label
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

			// const productSpecifications = await models['productSpecification'].findAll({
			// 	where: {
			// 		productId: product.id,
			// 	},
			// 	raw: true
			// });

			// let productSpecificationsHTML = ``;

			// if (productSpecifications.length > 1) {
			// 	for (i = 1; i < productSpecifications.length; i++) {
			// 		productSpecificationsHTML += `
			//         <div class="row single_row_container">
			//             <div class="col-5 col-md-5 col-lg-5">
			//                 <div class="form-group">
			//                 <label>&nbsp;</label>

			//                 <div class="input-group">
			//                     <div class="input-group-prepend">
			//                     <div class="input-group-text">
			//                         <i class="fas fa-signature"></i>
			//                     </div>
			//                     </div>
			//                     <input type="text" class="form-control" name="specificationName"
			//                     value="${productSpecifications[i].name}"
			//                     required>
			//                 </div>
			//                 </div>
			//             </div>
			//             <div class="col-5 col-md-5 col-lg-5">
			//                 <label>&nbsp;</label>
			//                 <div class="form-group">
			//                 <div class="input-group">
			//                     <div class="input-group-prepend">
			//                     <div class="input-group-text">
			//                         <i class="fas fa-signature"></i>
			//                     </div>
			//                     </div>
			//                     <input type="text" class="form-control" name="speecificationValue"
			//                     value="${productSpecifications[i].value}"
			//                     required>
			//                 </div>
			//                 </div>
			//             </div>
			//             <div class="col-2 col-md-2 col-lg-2">
			//                 <label>&nbsp;</label>
			//                 <div class="form-group">
			//                     <input type="hidden" class="form-control" name="speecificationId" value="${productSpecifications[i]['id']}" required>
			//                     <a href="javascript:void(0)" class="btn btn-icon btn-danger delete_product_specification_row"><i class="fas fa-times"></i></a>
			//                 </div>
			//             </div>
			//             </div>
			//         `;
			// 	}
			// }

			return res.render('admin/product/edit', { product, categories, });
		} catch (err) {
			return helper.error(res, err);
		}
	},
	view: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModuleSidebar = 'listing';

			const product = await module.exports.findOneProduct(req.params.id);
			global.currentSubModule = `View`;

			// const taxCategories = await models['taxCategory'].findAll({
			// 	where: {
			// 		vendorId: adminData.id
			// 	}
			// });

			// const productTags = await models['productTag'].findAll({
			// 	where: {
			// 		productId: product.id
			// 	}
			// });

			// const categories = await models['category'].findAll({
			//     order: [['name', 'ASC']]
			// });

			let categories = await module.exports.getParent();
			if (categories.length > 0) {
				categories = categories.map(category => ({
					id: category.value,
					name: category.label
				}));
			}

			const subCategories = [];
			// const subCategories = await models['subCategory'].findAll({
			//     include: [
			//         {
			//             model: models['category'],
			//             required: true
			//         }
			//     ],
			//     order: [['name', 'ASC']]
			// });

			return res.render('admin/product/view', { product, categories });
		} catch (err) {
			return helper.error(res, err);
		}
	},
	importExport: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModuleSidebar = 'importExport';



			return res.render('admin/product/importExport', {});
		} catch (err) {
			return helper.error(res, err);
		}
	},
	addUpdateProduct: async (req, res) => {
		try {
			const required = {
				vendorId: 0,
				name: req.body.name,
				description: req.body.description,
				// brandName: req.body.brandName,
				// mrp: req.body.mrp,
				isApproved: 1,
			};
			const nonRequired = {
				id: req.body.id,
				// minimumSellingPrice: req.body.minimumSellingPrice,
				tags: req.body.tags,
				price: req.body.price,
				taxCategoryId: req.body.taxCategoryId,
				image: req.files && req.files.image && req.files.image.name.length > 0 ? req.files.image.name : undefined,
				percentageDiscount: req.body.percentageDiscount,
				length: req.body.length,
				width: req.body.width,
				height: req.body.height,
				dimensionsUnit: req.body.dimensionsUnit,
				weight: req.body.weight,
				weightUnit: req.body.weightUnit,
				// tags: req.body.tags,
				status: req.body.status,
				sku: req.body.sku,
				barcode: req.body.barcode,
				categoryId: req.body.categoryId,
				// subCategoryId: req.body.subCategoryId,
				specificationName: req.body.specificationName,
				speecificationValue: req.body.speecificationValue,
				...req.body
			};

			let requestData = await helper.vaildObject(required, nonRequired);

			if (requestData.hasOwnProperty('barcode')) {
				requestData.barcodeImage = await helper.generateBarcode(requestData.barcode, 'product');
			}

			console.log(JSON.stringify(requestData, null, 2), '=====================>requestData');
			// return;


			if (req.files && req.files.image && req.files.image.name) {
				requestData.image = helper.imageUpload(req.files.image, 'product');
			}

			if (!requestData.hasOwnProperty('id')) {
				requestData.status = 1;
			}

			const productId = await helper.save(models[model], requestData);

			if (requestData.tags && requestData.tags.length > 0) {
				if (!Array.isArray(requestData.tags) && typeof requestData.tags == 'string') requestData.tags = [requestData.tags];

				await models['productTag'].destroy({
					where: {
						productId
					}
				});

				let addTagsObj = requestData.tags.map(tag => ({
					productId,
					tag
				}));

				// if (requestData.hasOwnProperty('id')) {
				//     const productTags = await models['productTag'].findAll({
				//         where: {
				//             productId: requestData.id
				//         }
				//     }).map(productTag => productTag.tag);

				//     addTagsObj = addTagsObj.filter(tagObj => {
				//         return !productTags.includes(tagObj.tag);
				//     });
				// }

				await models['productTag'].bulkCreate(addTagsObj);
			}

			if (requestData.hasOwnProperty('specificationName')) {
				if (!Array.isArray(requestData.specificationName)) requestData.specificationName = [requestData.specificationName];

				if (requestData.specificationName.length > 0) {
					await models['productSpecification'].destroy(
						{
							where: {
								productId
							},
							// truncate: true
						}
					);

					const addProductSpecification = [];

					for (let i in requestData.specificationName) {
						addProductSpecification.push({
							productId,
							name: requestData.specificationName[i],
							value: requestData.speecificationValue[i],
							...(requestData.hasOwnProperty('speecificationId') && requestData.speecificationId.length > i ? { id: requestData.speecificationId[i] } : {})
						});
					}

					console.log(addProductSpecification, '=================>addProductSpecification');
					await models['productSpecification'].bulkCreate(addProductSpecification, { updateOnDuplicate: ['name', 'value'] });
				}
			}

			// if (requestData.specificationName.length > 0) {
			//     await models['productSpecification'].destroy(
			//         {
			//             where: {
			//                 productId
			//             },
			//             // truncate: true
			//         }
			//     );

			//     const addProductSpecification = [];

			//     for (let i in requestData.specificationName) {
			//         addProductSpecification.push({
			//             productId,
			//             name: requestData.specificationName[i],
			//             value: requestData.speecificationValue[i],
			//             ...(requestData.hasOwnProperty('speecificationId') && requestData.speecificationId.length > i ? { id: requestData.speecificationId[i] } : {})
			//         });
			//     }

			//     console.log(addProductSpecification, '=================>addProductSpecification');
			//     await models['productSpecification'].bulkCreate(addProductSpecification, { updateOnDuplicate: ['name', 'value'] });
			// }

			const product = await module.exports.findOneProduct(productId);
			console.log(product, '=================================================>product');

			let message = `Product ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

			req.flash('flashMessage', { color: 'success', message });

			res.redirect('/admin/product/listing');
		} catch (err) {
			err.code = 200;
			return helper.error(res, err);
		}
	},
	findOneProduct: async (id) => {
		return await models[model].findOne({
			where: {
				id
			},
			// include: [
			// 	{
			// 		model: models['user'],
			// 		as: 'vendor',
			// 		include: [
			// 			{
			// 				model: models['vendorDetail'],
			// 				attributes: {
			// 					include: [
			// 						[sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/product/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
			// 					]
			// 				}
			// 			},
			// 		]
			// 	},
			// 	{
			// 		model: models['taxCategory'],
			// 	},
			// ],
			attributes: {
				include: [
					[sequelize.literal(`(IF (\`product\`.\`image\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/product/', \`product\`.\`image\`)) )`), 'image'],
					[sequelize.literal(`(IF (\`product\`.\`barcodeImage\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/product/', \`product\`.\`barcodeImage\`)) )`), 'barcodeImage'],
					[sequelize.literal(`(IF (\`product\`.\`skuImage\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/product/', \`product\`.\`skuImage\`)) )`), 'skuImage'],
				]
			},
			raw: true,
			nest: true
		});
	},

	productCategorySelect: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModuleSidebar = '';

			const required = {
				categoryId: req.body.categoryId,
			};
			const nonRequired = {
			};

			console.log(required, '========.required');

			let requestData = await helper.vaildObject(required, nonRequired);

			const subCategories = await models['subCategory'].findAll({
				where: {
					categoryId: requestData.categoryId
				}
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
				subCategories.forEach(subCategory => {
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

			return helper.success(res, `Sub Category Fetched for product successfully`, html);
		} catch (err) {
			err.code = 200;
			return helper.error(res, err);
		}
	},

	getParent: async (id = undefined) => {
		const categories = await models['category'].findAll({
			where: {
				status: 1
			},
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

		// parent.unshift({
		//     value: null,
		//     label: 'Root'
		// });

		return parent;
	},
	productListingExport: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModuleSidebar = '';

			const required = {
				vendorId: req.body.vendorId,
			};
			const nonRequired = {
			};


			let requestData = await helper.vaildObject(required, nonRequired);
			console.log(requestData, '========.requestData');

			const listing = await models[model].findAll({
				where: {
					vendorId: requestData.vendorId
				},
				order: [['id', 'DESC']]
			});

			return helper.success(res, `Product list exported successfully`, listing);
		} catch (err) {
			err.code = 200;
			return helper.error(res, err);
		}
	},
	productListingImport: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModuleSidebar = '';

			const required = {
				file: req.files && req.files.file,
			};
			const nonRequired = {
			};


			let requestData = await helper.vaildObject(required, nonRequired);
			console.log(requestData, '========.requestData');


			// fs.createReadStream('data.csv')
			fs.createReadStream(requestData.file.tempFilePath)
				.pipe(csv())
				.on('data', async (row) => {
					// console.log(row, '===================>row');

					row = JSON.parse(JSON.stringify(row));
					// return;
					console.log(row[`categoryId`], '============>categoryId');

					if (row.hasOwnProperty('categoryId') && row.categoryId == '' || row.hasOwnProperty('name') && row.name == '') {
						return;
					}

					if (row.hasOwnProperty('barcode') && row.barcode != '') {
						row.barcodeImage = await helper.generateBarcode(row.barcode, 'product');
					}

					row.isApproved = 1;

					console.log(row, '==================>row after')

					await helper.save(models[model], row)

				})
				.on('end', () => {
					console.log('CSV file successfully processed');
				});

			return helper.success(res, `Product list imported successfully`, {});
		} catch (err) {
			err.code = 200;
			return helper.error(res, err);
		}
	},
	importProductImages: async (req, res) => {
		try {
			global.currentModule = 'Product';
			global.currentSubModuleSidebar = '';

			const required = {
				images: req.files && req.files.images,
			};
			const nonRequired = {
			};

			let requestData = await helper.vaildObject(required, nonRequired);
			console.log(requestData, '========.requestData');

			if (!Array.isArray(requestData.images)) requestData.images = [requestData.images];

			if (Array.isArray(requestData.images) && requestData.images.length > 0) {

				requestData.images.forEach(image => {
					helper.imageUploadWithRealName(image, 'product');
				});

			}

			return helper.success(res, `Product images imported successfully`, {});
		} catch (err) {
			err.code = 200;
			return helper.error(res, err);
		}
	},
}