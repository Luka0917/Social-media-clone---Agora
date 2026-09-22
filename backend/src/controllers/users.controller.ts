import { UserService } from "../services/users.service.ts";
import { Request, Response } from "express";
import { wrap } from "../lib/helpers.ts";
import { BadRequestError, UnauthorizedError } from "../lib/Errors.ts";

export const getPresignedUrl = (type:"avatars" | "banners") => {
    return wrap(async (req: Request, res: Response) => {
        if(!req.user) throw new UnauthorizedError('You must be logged in to do this!');
        
        const { contentType } = req.body;
        if(!contentType) throw new BadRequestError('Content type is missing!');

        const result = type === 'avatars' 
            ? await UserService.getAvatarPresignedUrl(req.user.id, contentType) 
            : await UserService.getBannerPresignedUrl(req.user.id, contentType);
        return res.status(200).json(result);
    });
};

export const setupProfile = wrap(async (req: Request, res: Response) => {
    if(!req.user) throw new UnauthorizedError('You must be logged in to do this!');

    const { username, firstName, lastName } = req.body;
    if(!firstName || !lastName) throw new BadRequestError('firstname and lastname are required!');

    const profile = await UserService.setupProfile(req.user.id, { username, firstName, lastName });
    return res.status(200).json(profile);
});