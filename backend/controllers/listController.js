const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const List = require('../models/List');
const distributeLists = require('../utils/distributeLists');

const uploadList = async (req, res) => {
  try {
    console.log('=== UPLOAD START ===');
    console.log('Uploaded file:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let listData = [];

    console.log('File extension:', fileExtension);
    console.log('File path:', filePath);

    // Read file based on extension
    if (fileExtension === '.csv') {
      console.log('Reading CSV file...');
      listData = await readCSVFile(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      console.log('Reading Excel file...');
      listData = await readExcelFile(filePath);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    console.log('Raw data from file:', JSON.stringify(listData, null, 2));
    console.log('Number of records:', listData.length);

    // Validate data structure
    if (!isValidListData(listData)) {
      console.log('Data validation failed');
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: 'Invalid file format. Required columns: FirstName, Phone. Notes is optional.' 
      });
    }

    console.log('Data validation passed');

    // Process data to normalize column names
    const processedData = processListData(listData);
    console.log('Processed data count:', processedData.length);

    // Create list record
    const list = new List({
      filename: req.file.filename,
      originalName: req.file.originalname,
      totalRecords: processedData.length,
      uploadedBy: req.user.id,
      status: 'processing'
    });

    await list.save();
    console.log('List record created:', list._id);

    // Distribute lists among agents
    const distribution = await distributeLists(processedData, list._id, req.user.id);
    console.log('Distribution completed:', distribution);
    
    // Update list with distribution details
    list.distribution = distribution;
    list.status = 'distributed';
    await list.save();

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    console.log('=== UPLOAD SUCCESS ===');

    res.json({
      message: 'File uploaded and distributed successfully',
      list: {
        id: list._id,
        originalName: list.originalName,
        totalRecords: list.totalRecords,
        distribution: list.distribution
      }
    });

  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error details:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
};

const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header, index }) => header.trim(),
        skipEmptyLines: true,
        strict: false
      }))
      .on('data', (data) => {
        console.log('CSV row data:', data);
        results.push(data);
      })
      .on('end', () => {
        console.log('CSV parsing completed. Total rows:', results.length);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      });
  });
};

const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

const isValidListData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.log('Invalid data: Not an array or empty');
    return false;
  }
  
  const firstRow = data[0];
  console.log('First row keys:', Object.keys(firstRow));
  console.log('First row data:', firstRow);
  
  // Check for required columns (case insensitive)
  const hasFirstName = (
    firstRow.FirstName !== undefined || 
    firstRow.firstName !== undefined ||
    firstRow['First Name'] !== undefined ||
    firstRow['first name'] !== undefined
  );
  
  const hasPhone = (
    firstRow.Phone !== undefined || 
    firstRow.phone !== undefined ||
    firstRow.PhoneNumber !== undefined ||
    firstRow['Phone Number'] !== undefined
  );

  console.log('Has FirstName:', hasFirstName);
  console.log('Has Phone:', hasPhone);

  return hasFirstName && hasPhone;
};

const processListData = (data) => {
  return data.map((row, index) => {
    // Normalize column names
    const firstName = row.FirstName || row.firstName || row['First Name'] || row['first name'] || '';
    const phone = row.Phone || row.phone || row.PhoneNumber || row['Phone Number'] || '';
    const notes = row.Notes || row.notes || row.Note || row.note || '';

    return {
      FirstName: firstName.toString().trim(),
      Phone: phone.toString().trim(),
      Notes: notes.toString().trim()
    };
  }).filter(item => item.FirstName && item.Phone);
};

const getLists = async (req, res) => {
  try {
    const lists = await List.find()
      .populate('uploadedBy', 'name email')
      .populate('distribution.agent', 'name email')
      .sort({ createdAt: -1 });

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lists', error: error.message });
  }
};

const getListDistribution = async (req, res) => {
  try {
    const { id } = req.params;
    
    const list = await List.findById(id)
      .populate('uploadedBy', 'name email')
      .populate('distribution.agent', 'name email mobile');

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching list distribution', error: error.message });
  }
};

module.exports = { uploadList, getLists, getListDistribution };