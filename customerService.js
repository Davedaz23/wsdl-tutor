// customerService.js
const { soap } = require('strong-soap');
const fs = require('fs');

const wsdl = fs.readFileSync('./service.wsdl', 'utf8');

// In-memory database of customers
const customerDatabase = {
  "123456": "John Doe",
  "789012": "Jane Smith",
  "345678": "Alice Johnson",
};

const customerService = {
  CustomerService: {
    CustomerServicePortType: {
      GetCustomerFullName: function (args) {
        console.log('CustomerService SOAP request received:', args);

        // Ensure accountNumber exists
        const accountNumber = args.accountNumber;
        if (!accountNumber) {
          throw new Error("Account number is missing or invalid");
        }

        // Return the full name from the database
        const fullName = customerDatabase[accountNumber] || "Unknown Customer";

        // Return SOAP response in the correct format
        return {
          fullName: fullName, // This must match the WSDL structure
        };
      },
    },
  },
};

// SOAP server for CustomerService
const createService = (server) => {
  soap.listen(server, '/soap/customerservice', customerService, wsdl);
};

module.exports = createService;
