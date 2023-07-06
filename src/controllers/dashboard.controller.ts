import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer, { Transporter } from 'nodemailer';
import { PrismaClient, User } from '@prisma/client';
import multer from "multer";
import { tokenSecret } from "../../config";
import { NextFunction } from 'express';

const prisma = new PrismaClient();
export const dashboardController = {

  async showdashboardPage  (req: Request, res: Response)  {
    res.render('home/dashboard');
  },
}