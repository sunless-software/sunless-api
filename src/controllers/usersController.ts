import { Request, Response } from "express";
import connectToDB from "../db";

const usersController = {
  getUsers: async (req: Request, res: Response) => {
    res.send("ola");
  },
};

export default usersController;
