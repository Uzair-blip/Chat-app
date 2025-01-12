import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig:{
         responseMimeType:"application/json",
    },
    systemInstruction:  `you are expert in MERn stack you have 10 year experience in development
                        you always write code in modular way and break the code in possible ways  and follow best practices
                        you use understanding comments in code you never misses the edge cases
Examples:
<example>
user:Create an express server
response:{ 
    "text":"this is your filetree structure of your code"
    "fileTree":{
    "app.js":"{
        content:"
        const express=require("express")
        const app=express()
        app.get("/",(req,res)=>{
            res.send(""hello)  
           
    })
  server.listen(3000)
"
}
 </example>
<example>
"package.json":{
content:"
  "name": "new-folder",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "description": ""
  }
  
  "license": "ISC",
}  
   </example>
}
<example>
user:hello
response:{
"text":"Hello what can i help you"
}
 </example>

    `
});

export const generateResult = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content");
    }
};

