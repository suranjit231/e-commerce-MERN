import OrderRepository from "./order.repository.js";

export default class OrderController{
    constructor(){
        this.orderRepository = new OrderRepository();
    }

    //===== create new order controller ====//
    async createOrder(req, res, next){
        try{
            const userId = req.userId;

            const result = await this.orderRepository.createOrder(userId);
            if(result?.success){
                return res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }
    }

    //==== get user orders controller =====//
    async getUserOrders(req, res, next){
        try{
            const userId = req.userId;
            const result = await this.orderRepository.getUserOrders(userId);

            if(result){
                return res.status(200).json(result);
            }

        }catch(error){
            next(error);
        }
    }
}