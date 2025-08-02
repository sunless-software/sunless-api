import { Request, Response } from "express";
import connectToDB from "../db";

const usersController = {
  getUsers: async (req: Request, res: Response) => {
    const db = await connectToDB();
    const result = await db.query("SELECT * FROM users");
    console.log(result.rows);
    res.send("ola");
  },
};

export default usersController;
