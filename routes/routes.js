const express = require("express");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const mammoth = require("mammoth");
const { Document, Packer, Paragraph, TextRun } = require("docx");
const { buffer } = require("stream/consumers");

const router = express.Router();
const getFilePath = (filename) => path.join(__dirname, "..", "storage", filename);

router.get("/read", async (req, res) => {
    let fileName = req.query.filename;
    let filePath = getFilePath(fileName);
    if (!fileName)
        return res.status(400).json({error:"file name is required"});
    
    if (path.extname(fileName).toLowerCase() !== ".docx")
        return res.status(400).json({error:"Only docx files are allowed"});

    try 
    {
        let buffer = await fsp.readFile(filePath);
        let data = await mammoth.extractRawText({buffer:buffer});
        if (!data.value || data.value.trim() === "")
            return res.json({content:"file is empty"});
            
        return res.json({content:data.value});
    }
    
    catch
    {
        return res.status(500).json({error:"file not found"});
    }
});

router.post("/write", async (req, res) => {
    let filename = req.body.filename;
    let content = req.body.content;
    if (!filename || !content)
        return res.status(404).json({error:"file name and content are required"});
    
    if (path.extname(filename).toLowerCase() !== ".docx")
        return res.status(404).json({error:"only docx file allwoed"});

    try
    {
        let doc = new Document({
            sections:[
                {
                    properties:{},
                    children:[
                        new Paragraph({
                            children:[
                                new TextRun({text:content, color:"FF0000", size:80})
                            ]
                        })
                    ]
                }
            ]
        });
        
        let buffer = await Packer.toBuffer(doc);
        await fsp.writeFile(getFilePath(filename), buffer);
        return res.json({message:"write to file successfully"});
    }
    catch(err) 
    {
        return res.status(500).json({error:err.message});
    }
});

router.post("/append", async (req, res) => {
    let filename = req.body.filename;
    let content = req.body.content;
    if (!filename || !content)
        return res.status(404).json({error:"file name and content are required"});
    
    if (path.extname(filename).toLowerCase() !== ".docx")
        return res.status(404).json({error:"only docx file allwoed"});

    try
    {
        await fsp.access(getFilePath(filename));
        let buffer = await fsp.readFile(getFilePath(filename));
        let oldData =  (await mammoth.extractRawText({buffer})).value;

        let doc = new Document({
            sections:[
                {
                    properties:{},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({text:oldData, color:"FF0000", size:80}),
                                new TextRun({text: content, color:"FF0000", size:80})
                            ]
                        })
                    ]
                }
            ]
        });

        let newBuffer = await Packer.toBuffer(doc);
        await fsp.writeFile(getFilePath(filename), newBuffer);
        return res.json({message:"append to file successfully"});
    }
    
    catch(err) 
    {
        return res.status(500).json({error:err.message});
    }
});

router.put("/rename", async (req, res) => {
    let oldName = req.body.oldName;
    let newName = req.body.newName;
    if (!oldName || !newName)
        return res.status(404).json({error:"both file names are required."});
    if (path.extname(oldName).toLowerCase() !== ".docx" 
        || path.extname(newName).toLowerCase() !== ".docx")
        return res.status(404).json({error:"only docx files are allowed"});
    try
    {
        await fsp.rename(getFilePath(oldName), getFilePath(newName));
        return res.json({message:"file rename successfully."});
    }
    catch
    {
        return res.status(500).json({error:"file not found"});
    }

});

router.delete("/delete", async (req, res) => {
    let filename = req.body.filename; 
    if (!filename)
        return res.status(404).json({error:"file name is required"});
    if (path.extname(filename).toLowerCase() !== ".docx")
        return res.status(404).json({error:"only docx file is allowed"});

    try
    {
        await fsp.rm(getFilePath(filename));
        return res.json({message:"file deleted successfully"});
    }
    catch
    {
        return res.status(500).json({error:"file not found"});
    }
});

module.exports = router;