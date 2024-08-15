import ProductRepository from "./product.repository.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";


export default class ProductController{

    constructor(){
        this.productRepositoty = new ProductRepository();
    }

    //===== get all products controller ====//
    async getAllProducts(req,res,next){
        try{
            const result = await this.productRepositoty.getAllProducts();

            if(result?.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }


    //======== get one products with details ======//
    async getDetailsProduct(req, res, next){
        try{
            const productId = req.params.productId;
            const result = await this.productRepositoty.getSingleProduct(productId);
            if(result?.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    // Ensure the correct URL path
async addNewProduct(req, res, next) {
    try {
        const { name, description, price, category, stock, brand } = req.body;

        const errors = [];
        if (!name) {
            errors.push("Product name is required");
        }
        if (!description) {
            errors.push("Product description is required");
        }
        if (!price) {
            errors.push("Product price is required");
        }
        if (!category) {
            errors.push("Product category is required");
        }
        if (!stock) {
            errors.push("Product stock is required");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(", "));
        }

        const images = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

        const result = await this.productRepositoty.addProduct({
            name,
            description,
            price,
            category,
            images:images,
            stock,
            brand
        });

        if (result?.success) {
            return res.status(201).json(result);
        }

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}


    //===== delete products from database ====//
    async deleteProduct(req, res, next){
        try{

            const productId = req.params.productId;
            const result = await this.productRepositoty.deleteProduct(productId);

            if(result?.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //===== get search products =============//
    async getSearchProduct(req,res,next){
        try{

           // console.log("req query: ", req.query);
            const { query } = req.query;
            const result =await this.productRepositoty.getSearchProduct(query);

            if(result?.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //======== filter products controller ======//
    async filterProducts(req, res, next){
        try{
            const {query} = req.query;
            const result = await this.productRepositoty.filterProducts(query);
            if(result?.success){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }
}