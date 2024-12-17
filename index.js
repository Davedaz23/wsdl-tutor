const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

// Sample data for demonstration
const customers = {
  '123456': 'John Doe',
  '654321': 'Jane Smith',
};

// Define the WSDL
const wsdl = `
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://example.com/bankservice"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             name="BankService"
             targetNamespace="http://example.com/bankservice">
  <types>
    <xsd:schema targetNamespace="http://example.com/bankservice">
      <xsd:element name="GetCustomerNameRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="accountNumber" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="GetCustomerNameResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="customerName" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>

  <message name="GetCustomerNameRequestMessage">
    <part name="parameters" element="tns:GetCustomerNameRequest"/>
  </message>
  <message name="GetCustomerNameResponseMessage">
    <part name="parameters" element="tns:GetCustomerNameResponse"/>
  </message>

  <portType name="BankServicePortType">
    <operation name="GetCustomerName">
      <input message="tns:GetCustomerNameRequestMessage"/>
      <output message="tns:GetCustomerNameResponseMessage"/>
    </operation>
  </portType>

  <binding name="BankServiceBinding" type="tns:BankServicePortType">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="GetCustomerName">
      <soap:operation soapAction="http://example.com/bankservice/GetCustomerName"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>

  <service name="BankService">
    <port name="BankServicePort" binding="tns:BankServiceBinding">
      <soap:address location="http://localhost:8080/bankservice"/>
    </port>
  </service>
</definitions>
`;

// Define the service methods
const service = {
  BankService: {
    BankServicePort: {
      GetCustomerName: function (args) {
        const accountNumber = args.accountNumber;
        const customerName = customers[accountNumber] || 'Customer not found';
        return { customerName }; // Ensure the response is structured correctly
      },
    },
  },
};

// Create SOAP server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a SOAP endpoint
soap.listen(app, '/bankservice', service, wsdl);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/bankservice?wsdl`);
});