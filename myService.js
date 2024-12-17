const express = require('express');
const soap = require('strong-soap').soap;
const fs = require('fs');

const app = express();
const PORT = 3000;

// Load WSDL file
const wsdlPath = './service.wsdl';
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

// SOAP service definition for MyService
const myService = {
  MyService: {
    MyPort: {
      MyOperation: function (args) {
        console.log('SOAP request received:', args);

        // Ensure that args.input exists and is valid
        const input = args.input;
        if (!input) {
          throw new Error("Input parameter is missing or invalid");
        }

        // Return a valid SOAP response
        return {
          output: `Hello, ${input}`, // Ensure this matches the WSDL
        };
      },
    },
  },
};

// Start the server
const server = app.listen(PORT, () => {
  console.log(`SOAP Web Service running on http://localhost:${PORT}/soap`);
});

// Attach the SOAP listener to the server
soap.listen(server, '/soap', myService, wsdl);
