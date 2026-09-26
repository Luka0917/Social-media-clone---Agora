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

export const getBannerPresignedUrl = getPresignedUrl('banners');

export const getAvatarPresignedUrl = getPresignedUrl('avatars');

const saveMedia = (type: "avatars" | "banners") =>
    wrap(async (req: Request, res: Response) => {
        if(!req.user) throw new UnauthorizedError('You must be logged in to do this!');
        const { publicUrl, contentType } = req.body;
        if(!publicUrl) throw new BadRequestError('publicUrl missing in body')
        if(type === "avatars" && !contentType) throw new BadRequestError('contentType missing in body');
        type === "avatars"
            ? await UserService.saveAvatar(req.user.id, publicUrl, contentType)
            : await UserService.saveBanner(req.user.id, publicUrl);
        res.status(200).json({ success: true });
    });

export const saveAvatar = saveMedia('avatars');

export const saveBanner = saveMedia('banners');

export const setupProfile = wrap(async (req: Request, res: Response) => {
    if(!req.user) throw new UnauthorizedError('You must be logged in to do this!');

    const { username, firstName, lastName } = req.body;
    if(!firstName || !lastName) throw new BadRequestError('firstname and lastname are required!');

    const profile = await UserService.setupProfile(req.user.id, { username, firstName, lastName });
    return res.status(200).json(profile);
});

export const updateProfile = wrap(async (req: Request, res: Response) => {
    if(!req.user) throw new UnauthorizedError('You must be logged in to do this!');

    const { username, firstName, lastName, bio, status, occupation, education, dateOfBirth, gender } = req.body;

    const data: Record<string, unknown> = {};

    if(username !== undefined){
        if(typeof username !== 'string' || username.length < 3 || username.length > 20 || /\s|[<>]/.test(username)){
            throw new BadRequestError('Invalid username!');
        }
        data.username = username;
    }

    if(firstName !== undefined){
        if(typeof firstName !== 'string' || firstName.length < 1 || firstName.length > 50){
            throw new BadRequestError('Invalid firstname!');
        }
        data.firstName = firstName;
    }

    if(lastName !== undefined){
        if(typeof lastName !== 'string' || lastName.length < 1 || lastName.length > 50){
            throw new BadRequestError('Invalid lastname!');
        }
        data.lastName = lastName;
    }

    if(bio !== undefined){
        if(bio !== null && (typeof bio !== 'string' || bio.length > 500)){
            throw new BadRequestError('Invalid bio!');
        }
        data.bio = bio;
    }

    if(status !== undefined){
        const statusValues = [
            "single", "in_a_relationship", "engaged", "married",
            "in_a_civil_union", "its_complicated", "in_a_domestic_partnership",
            "in_an_open_relationship", "widowed", "separated", "divorced"
        ];
        if(status !== null && !statusValues.includes(status)) throw new BadRequestError('Invalid status!');
        data.status = status;
    }

    if(occupation !== undefined){
        if(occupation !== null && (typeof occupation !== 'string' || occupation.length > 100)){
            throw new BadRequestError('Invalid occupation!');
        }
        data.occupation = occupation;
    }

    if(education !== undefined){
        if(education !== null && (typeof education !== 'string' || education.length > 100)){
            throw new BadRequestError('Invalid education!');
        }
        data.education = education;
    }

    if(dateOfBirth !== undefined){
        if(dateOfBirth === null){
            data.dateOfBirth = null;
        }else{
            const parsed = new Date(dateOfBirth);
            if(isNaN(parsed.getTime())) throw new BadRequestError('Invalid dateOfBirth!');
            data.dateOfBirth = parsed;
        }
    }

    if(gender !== undefined){
        const genderValues = ['male', 'female', 'other'];
        if(gender !== null && !genderValues.includes(gender)) throw new BadRequestError('invalid gender!');
        data.gender = gender;
    }

    if(Object.keys(data).length === 0){
        throw new BadRequestError('No valid fields provided to update!');
    }

    await UserService.updateProfile(req.user.id, data);
    return res.status(200).json({ message: 'Profile updated successfully!' });
});

export const getMyProfile = wrap(async (req: Request, res: Response) => {
    if(!req.user) throw new UnauthorizedError('You must be logged in to do this!');

    const profile = await UserService.getProfile(req.user.id);
    return res.status(200).json(profile);
});

export const getUserProfile = wrap(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new BadRequestError('User id is request!');

    const profile = await UserService.getProfile(id as string);
    return res.status(200).json(profile);
})