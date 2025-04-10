import "express";

declare module "express" {
  export interface Request {
    validated?: {
      body?: any;
      query?: any;
      params?: any;
    };
  }
}
