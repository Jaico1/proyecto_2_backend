import { Request, Response } from "express";
import User from "./usuario.model"; // Importa el modelo de usuario definido en Mongoose
import { generateToken } from "../auth/auth_token";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// Creación de usuarios
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, password, email, phone_number, address } = req.body; // Obtén las propiedades del cuerpo de la solicitud

    // Crea un nuevo usuario utilizando el modelo de Mongoose
    const user = new User({
      name,
      password,
      email,
      phone_number,
      address,
    });

    // Guarda el usuario en la base de datos
    await user.save();

    res.status(201).json({ message: "Usuario creado exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

//Obtener usuario por id
export async function getUserById(req: Request, res: Response) {
  try {
    //Para usuario admin
    const { _id } = req.params;

    const user = await User.findOne({ _id: _id, active: true });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
}

//Obtener JWT según email y password
export async function getUserByCreds(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    const password = req.query.password as string;

    const user = await User.findOne({ email: email, active: true });
    if (user) {
      await bcrypt.compare(
        password,
        user?.password,
        async function (err: Error, response: boolean) {
          if (err) {
            throw err;
          }
          if (response) {
            console.log(`success ${response}`);

            const token = await generateToken(user._id.toHexString());
            console.log(token);
            res.status(200).json({ token });
          } else {
            console.log(`failure ${response}`);
            res.status(400).json({ message: "Contraseña incorrecta" });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
}

//Actualizar usuarios
export async function updateUser(req: Request, res: Response) {
  //Aquí opto por usar tanto params como body
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: _id, active: true },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al actualizar el usuario." });
  }
}

//Borrar usuarios
export async function deleteUser(req: Request, res: Response) {
  //Aquí uso params
  const _id = req.params;
  try {
    //El usuario se inhabilita, en vez de borrarse
    const deletedUser = await User.findOneAndUpdate(
      { _id: _id, active: true },
      { active: false }
    );
    if (!deletedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json({ message: "Usuario inhabilitado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
}
