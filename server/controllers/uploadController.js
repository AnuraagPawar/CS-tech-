const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const Agent = require('../models/Agent');
const Record = require('../models/Record');


const uploadFile = async (req, res) => {
    try {
        console.log('Upload Request Received');
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log('File details:', req.file);

        
        const allowedExtensions = ['.csv', '.xlsx', '.xls'];
        const ext = path.extname(req.file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Invalid file type. Only CSV, XLSX, XLS allowed.' });
        }

        const agents = await Agent.find({}).sort({ createdAt: 1 });
        console.log(`Agents found: ${agents.length}`);

        if (agents.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: `No agents found in the system. Please create agents first.`
            });
        }

        const results = [];

        if (ext === '.csv') {
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    await distributeAndSave(results, agents, res, req.file.path);
                })
                .on('error', (err) => {
                    fs.unlinkSync(req.file.path);
                    res.status(500).json({ message: 'Error parsing CSV file' });
                });
        } else {
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            await distributeAndSave(jsonData, agents, res, req.file.path);
        }
    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

const distributeAndSave = async (data, agents, res, filePath) => {
    try {
        const recordsToSave = [];
        const agentCount = agents.length;

        data.forEach((row, index) => {
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                cleanRow[key.trim()] = row[key];
            });

            const firstName = cleanRow['FirstName'] || cleanRow['First Name'] || cleanRow['firstname'] || cleanRow['Name'] || cleanRow['name'] || cleanRow['Customer Name'];
            const phone = cleanRow['Phone'] || cleanRow['Mobile'] || cleanRow['phone'] || cleanRow['Number'] || cleanRow['number'] || cleanRow['Contact Number'];
            const notes = cleanRow['Notes'] || cleanRow['notes'] || '';

            if (!firstName || !phone) {
                return;
            }

            const agentIndex = index % agentCount;

            recordsToSave.push({
                firstName,
                phone,
                notes,
                assignedTo: agents[agentIndex]._id
            });
        });

        if (recordsToSave.length === 0) {
            throw new Error('No valid records found to import. Please check your column headers (Name, Number).');
        }

        await Record.insertMany(recordsToSave);

        fs.unlinkSync(filePath);

        res.json({
            message: 'File processed successfully',
            totalRecords: recordsToSave.length,
            distribution: `Distributed equally among ${agentCount} agents`
        });

    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
        res.status(400).json({ message: error.message });
    }
};

module.exports = { uploadFile };
