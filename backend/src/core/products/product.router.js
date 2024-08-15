import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middleware/fileUpload.middleware.js";
import adminProtectorMiddleware from "../../middleware/adminProtect.middleware.js";

const productRouter = express.Router();
const productController = new ProductController();

//===== add products router =======//
productRouter.post("/addProduct", adminProtectorMiddleware,  upload.array('images'), (req, res, next) => {
    productController.addNewProduct(req, res, next);
});

productRouter.delete("/:productId", adminProtectorMiddleware,  (req, res, next)=>{
    productController.deleteProduct(req, res, next);
})


//===== get all products =======//
productRouter.get("/", (req, res, next) => {
    productController.getAllProducts(req, res, next);
});

//==== search products ======//
productRouter.get("/searchProduct", (req, res, next) => {
    productController.getSearchProduct(req, res, next);
});

//==== filter products ======//
productRouter.get("/filterProduct", (req, res, next) => {
    productController.filterProducts(req, res, next);
});

//==== get details product ====//
productRouter.get("/details/:productId", (req, res, next)=>{
    productController.getDetailsProduct(req, res, next);
})



export default productRouter;
