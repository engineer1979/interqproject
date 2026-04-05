const express = require('express');
const pdf = require('html-pdf');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory database (for demo - use real DB in production)
const certificates = new Map();

// Generate PDF certificate
app.post('/api
