import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ChangeEvent, useState, JSX } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";


import { ChevronRight, ChevronLeft, Check } from "lucide-react"; // Make sure you have these icons

interface FormData {
  destinationName: string;
  description: string;
  systemType: string;
  sid: string;
  language: string;
  host: string;
  instance: string;
  client: string;
  username: string;
  password: string;
  isHana: boolean;
  isCentralUser: boolean;
  licenseCheck: boolean;
  enableCustomDB: boolean;
}

const steps = [
  { number: 1, title: "Basic Info" },
  { number: 2, title: "Connection" },
  { number: 3, title: "Advanced Options" },
  { number: 4, title: "Review & Confirm" },
];

export default function HorizontalLinearAlternativeLabelStepper() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    destinationName: "",
    description: "",
    systemType: "Online",
    sid: "",
    language: "EN",
    host: "",
    instance: "",
    client: "",
    username: "",
    password: "",
    isHana: false,
    isCentralUser: false,
    licenseCheck: false,
    enableCustomDB: false,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));
  };

  const renderStepContent = (): JSX.Element | null => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderConnection();
      case 2:
        return renderAdvancedOptions();
      case 3:
        return renderReview();
      default:
        return null;
    }
  };

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


  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleConfirm = () => {
    console.log("Form submitted:", formData);
    setFormData({
      destinationName: "",
      description: "",
      systemType: "Online",
      sid: "",
      language: "EN",
      host: "",
      instance: "",
      client: "",
      username: "",
      password: "",
      isHana: false,
      isCentralUser: false,
      licenseCheck: false,
      enableCustomDB: false,
    }); // Reset form after submission
    setCurrentStep(0); // Reset to step 1
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
      <Card>
        <CardHeader
          title="Add New SAP System"
          subheader="Enter the required details to connect to your SAP system"
        />
        <CardContent>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.number}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent()}
          <div
            className="mt-8 flex justify-between"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
                > 
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}
            </div>
            <div>
              {currentStep < steps.length - 1 ? (
                <button onClick={handleNext} className="btn btn-primary">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button onClick={handleConfirm} className="btn btn-success">
                  Confirm & Save
                  <Check className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
