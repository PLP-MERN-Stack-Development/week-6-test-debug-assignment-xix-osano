const express = require('express');
const Bug = require('../models/Bug');
const { validateBugData, sanitizeInput } = require('../utils/validation');

const router = express.Router();

// Get all bugs
router.get('/', async (req, res, next) => {
  try {
    const { status, severity, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;
    
    const sortOrder = order === 'desc' ? -1 : 1;
    
    const bugs = await Bug.find(query).sort({ [sortBy]: sortOrder });
    
    res.json({
      success: true,
      data: bugs,
      count: bugs.length
    });
  } catch (error) {
    next(error);
  }
});

// Get single bug
router.get('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    next(error);
  }
});

// Create new bug
router.post('/', async (req, res, next) => {
  try {
    // Sanitize input
    const sanitizedData = {
      title: sanitizeInput(req.body.title),
      description: sanitizeInput(req.body.description),
      reporter: sanitizeInput(req.body.reporter),
      assignee: sanitizeInput(req.body.assignee),
      severity: req.body.severity,
      status: req.body.status
    };
    
    // Validate data
    const validation = validateBugData(sanitizedData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const bug = new Bug(sanitizedData);
    await bug.save();
    
    res.status(201).json({
      success: true,
      data: bug,
      message: 'Bug created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update bug
router.put('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    // Sanitize input
    const sanitizedData = {
      title: sanitizeInput(req.body.title),
      description: sanitizeInput(req.body.description),
      reporter: sanitizeInput(req.body.reporter),
      assignee: sanitizeInput(req.body.assignee),
      severity: req.body.severity,
      status: req.body.status
    };
    
    // Validate data
    const validation = validateBugData(sanitizedData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedBug,
      message: 'Bug updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete bug
router.delete('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    await Bug.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Bug deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;