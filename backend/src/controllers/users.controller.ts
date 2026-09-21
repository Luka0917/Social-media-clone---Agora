import { UserService } from "../services/users.service.ts";
import { Request, Response } from "express";
import { wrap } from "../lib/helpers.ts";

const getPresignedUrl = (type:"avatars" | "banners") => {
    return wrap(async (req:Request, res:Response) => {
        if(!req.user) throw new Error('something'); //TODO
        const { contentType } = req.body;
        if(!contentType) return res.status(400).json({error: 'content type is missing!'})
        const result = type === 'avatars' 
            ? await UserService.getAvatarPresignedUrl(req.user.id, contentType) 
            : await UserService.getBannerPresignedUrl(req.user.id, contentType);
        return res.status(200).json(result);
    });
};