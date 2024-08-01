"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parser_1 = require("./parser");
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const links = yield (0, parser_1.main)();
        res.send(`Links: ${links.join(', ')}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error parsing the page');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// import express, { Request, Response } from 'express';
// import { main } from './parser';
// const app = express();
// const port = 3000;
// app.get('/', async (req: Request, res: Response) => {
//   try {
//     const links = await main();
//     res.send(`Links: ${links.join(', ')}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error parsing the page');
//   }
// });
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
