import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder required by jsPDF
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
