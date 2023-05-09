import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface User extends Document {
  name: string;
  password: string;
  email: string;
  phone_number: string;
  address: string;
  role: "Cliente" | "Domiciliario" | "Administrador";
  active: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        "Por favor, agrega un email válido",
      ],
    },
    phone_number: {
      type: String,
      unique: true,
      required: true,
      maxlength: 10,
      minlength: 10,
    },
    address: {
      type: String,
      required: true,
      maxlength: 48,
    },
    role: {
      type: String,
      required: true,
      enum: ["Cliente", "Domiciliario", "Administrador"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "users" }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  if (!password) {
    throw new Error("¡Falta la contraseña!");
  } else {
    try {
      const result = await bcrypt.compare(password, this.password);
      return result;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  }
};

export default mongoose.model<User>("user", userSchema);