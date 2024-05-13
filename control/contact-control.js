import { Contact } from "../Models/contact-module.js";

export const contactForm = async (req,res) =>{

    try {
        const response = req.body;
        await Contact.create(response);
        res.status(200).json({message:"message send successfully"}); 
    } catch (error) {
        res.status(500).json({message:"message not Delivered"});
    }

}
