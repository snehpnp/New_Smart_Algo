// import React, { useState } from 'react';
// import {Card, CardContent,CardHeader,CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';


import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { ChangeEvent, useState, JSX } from "react";
import Box from "@mui/material/Box";


const SAPSystemWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ 
    destinationName: '',
    description: '',
    systemType: 'Online',
    sid: '',
    language: 'EN',
    host: '',
    instance: '',
    client: '',
    username: '',  
    password: '',
    isHana: false,
    isCentralUser: false,
    licenseCheck: false,
    enableCustomDB: false
  });

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Connection' },
    { number: 3, title: 'Advanced Options' },
    { number: 4, title: 'Review & Confirm' }
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                ${currentStep >= step.number 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-white'}`}>
                {currentStep > step.number ? (
                  <Check className="w-5 h-5 text-blue-500" />
                ) : (
                  <span className={currentStep >= step.number ? 'text-blue-500' : 'text-gray-500'}>
                    {step.number}
                  </span>
                )}
              </div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm
                ${currentStep >= step.number ? 'text-blue-500' : 'text-gray-500'}">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-24 h-0.5 mx-2 ${
                currentStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Destination Name *</label>
        <input
          type="text"
          name="destinationName"
          value={formData.destinationName}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Enter destination name"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Optional description"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">System Type *</label>
          <select
            name="systemType"
            value={formData.systemType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="Online">Online</option>
            <option value="Standalone">Standalone</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SID *</label>
          <input
            type="text"
            name="sid"
            value={formData.sid}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            placeholder="System ID"
          />
        </div>
      </div>
    </div>
  );

  const renderConnection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Host *</label>
          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            placeholder="hostname.domain.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Instance/Port *</label>
          <input
            type="text"
            name="instance"
            value={formData.instance}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            placeholder="00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Client *</label>
        <input
          type="text"
          name="client"
          value={formData.client}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Enter client"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter password"
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedOptions = () => (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Is HANA System?</label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              name="isHana"
              checked={formData.isHana}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                formData.isHana ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                formData.isHana ? 'transform translate-x-6' : ''
              }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Enable Central User Repository?</label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              name="isCentralUser"
              checked={formData.isCentralUser}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                formData.isCentralUser ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                formData.isCentralUser ? 'transform translate-x-6' : ''
              }`}
            />
          </div>
        </div>

        {/* Additional toggles follow the same pattern */}
      </div>

      {/* {formData.isHana && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            Additional HANA-specific settings will be configured automatically.
          </AlertDescription>
        </Alert>
      )} */}
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h3 className="font-medium text-gray-900">Basic Information</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Destination Name</dt>
              <dd className="text-sm font-medium">{formData.destinationName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">System Type</dt>
              <dd className="text-sm font-medium">{formData.systemType}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">SID</dt>
              <dd className="text-sm font-medium">{formData.sid}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">Connection Details</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Host</dt>
              <dd className="text-sm font-medium">{formData.host}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Instance/Port</dt>
              <dd className="text-sm font-medium">{formData.instance}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Client</dt>
              <dd className="text-sm font-medium">{formData.client}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          Please review all details carefully before confirming. You can go back to make changes if needed.
        </AlertDescription>
      </Alert> */}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderConnection();
      case 3:
        return renderAdvancedOptions();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <Box
    sx={{
      width: "100%",
      maxWidth: "1320px",
      margin: "0 auto",
      padding: "20px",
    }}
  >
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader
          title="Add New SAP System"
          subheader="Enter the required details to connect to your SAP system"
        />
      
      <CardContent>
        {renderStepIndicator()}
        
        <div className="mt-8">
          {renderCurrentStep()}
        </div>

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="ml-auto flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={() => console.log('Form submitted:', formData)}
              className="ml-auto flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Confirm & Save
              <Check className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  </Box>
  );
};

export default SAPSystemWizard;