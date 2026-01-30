const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const Agent = require('../models/Agent');
const Record = require('../models/Record');

const deleteFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fsPromises.unlink(filePath);
        }
    } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err.message);
        // On Windows, sometimes the file is still locked. 
        // We'll try one more time after a short delay if it's a lock issue.
        if (err.code === 'EBUSY' || err.code === 'EPERM') {
            setTimeout(async () => {
                try {
                    if (fs.existsSync(filePath)) await fsPromises.unlink(filePath);
                } catch (retryErr) {
                    console.error('Final retry for file deletion failed:', retryErr.message);
                }
            }, 1000);
        }
    }
};

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
            await deleteFile(req.file.path);
            return res.status(400).json({ message: 'Invalid file type. Only CSV, XLSX, XLS allowed.' });
        }

        const agents = await Agent.find({}).sort({ createdAt: 1 });
        console.log(`Agents found: ${agents.length}`);

        if (agents.length === 0) {
            await deleteFile(req.file.path);
            return res.status(400).json({
                message: `No agents found in the system. Please create agents first.`
            });
        }

        let results = [];

        if (ext === '.csv') {
            const stream = fs.createReadStream(req.file.path);

            await new Promise((resolve, reject) => {
                stream.pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => {
                        stream.destroy(); // Manually destroy the stream to release handle
                        resolve();
                    })
                    .on('error', (err) => {
                        stream.destroy();
                        reject(err);
                    });
            });

            await distributeAndSave(results, agents, res, req.file.path);
        } else {
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            results = XLSX.utils.sheet_to_json(sheet);
            await distributeAndSave(results, agents, res, req.file.path);
        }
    } catch (error) {
        console.error('Upload error:', error);
        if (req.file && req.file.path) await deleteFile(req.file.path);
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
        await deleteFile(filePath);

        res.json({
            message: 'File processed successfully',
            totalRecords: recordsToSave.length,
            distribution: `Distributed equally among ${agentCount} agents`
        });

    } catch (error) {
        console.error('Distribution error:', error);
        await deleteFile(filePath);
        res.status(400).json({ message: error.message });
    }
};

module.exports = { uploadFile };
