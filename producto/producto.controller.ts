import { Request, Response } from "express";
import Product from "./producto.model"; // Importa el modelo de usuario definido en Mongoose
import productoModel from "./producto.model";

export const createProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, category, price, userId} = req.body; // Obtén las propiedades del cuerpo de la solicitud
  
      // Crea un nuevo producto utilizando el modelo de Mongoose
      const product = new Product({
        name,
        description,
        category,
        price,
        userId,
      });
  
      // Guarda el producto en la base de datos
      await product.save();
  
      res.status(201).json({ message: "Producto creado exitosamente", product });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  }; 

  export async function getProductById(req: Request, res: Response) {
    try {
      //Para usuario admin
      const { _id } = req.params;
  
      const product = await Product.findOne({ _id: _id, active: true });
  
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  }

//   export async function getProductFilters(req: Request,res: Response ) {
//     try{ 
//       const { category, userId } = req.query;
  
//       let query:{isDeleted : Boolean, category:String, userId: String} =; // se crea un objeto query donde estaran los filtos 
  
//       // solo se agreaga un key al objeto si este se encuentra en el query de express
      
//       if(category){
//         query.category = category;
//       }
//       if(restaurante){
//         query.restaurante = restaurante;
//       }
//       if (fechaInicial && fechaFinal){
//         query.createdAt = {$gte: new Date(fechaInicial), $lte:new Date(fechaFinal)};
//       }  
//       let pedidos = [];
  
//       // solo hara el find() si el query contiene algo para evitar que se envien todos los pedidos hechos 
//       if (Object.keys(req.query).length > 0) {
//         pedidos = await Pedido.find(query);
//       }
  
//       res.status(200).json(pedidos);
//     }catch(err){
//       res.status(500).json(err);
//     }
//   }






