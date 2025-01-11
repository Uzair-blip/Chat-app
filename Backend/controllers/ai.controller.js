import * as ai from "../services/ai.service.js"
const getResult=async (req,res)=>{
    try {
        const { prompt } = req.query;
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }
        const result = await ai.generateResult(prompt);
        res.send(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in generating result"
        });
    }
}
export {getResult}