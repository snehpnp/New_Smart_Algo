import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
const steps = [
  { number: 1, title: "Basic Info" },
  { number: 2, title: "Connection" },
  { number: 3, title: "Advanced Options" },
  { number: 4, title: "Review & Confirm" },
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    destinationName: "",
    description: "",
    systemType: "Online",
    sid: "",
    isHana: false,
    isCentralUser: false,
    host: "",
    instance: "",
    client: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let validationErrors = {};
    if (currentStep == 1) {
      if (!formData.destinationName)
        validationErrors.destinationName = "Destination Name is required.";
      if (!formData.sid) validationErrors.sid = "System ID (SID) is required.";
    } else if (currentStep == 2) {
      if (!formData.host) validationErrors.host = "Host is required.";
      if (!formData.instance)
        validationErrors.instance = "Instance/Port is required.";
      if (!formData.username)
        validationErrors.username = "Username is required.";
      if (!formData.password)
        validationErrors.password = "Password is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 4) {
      if (validate()) {
        alert("Form Submitted", JSON.stringify(formData, null, 2));
        setIsSubmitted(true);
      }
    } else {
      console.log("currentStep", currentStep);

      if (validate()) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, "--", type, "==", value);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    // <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200">
    <div className="flex justify-center items-center ">
      <div className="bg-white p-8 shadow-2xl rounded-xl w-full max-w-3xl">
        <h2 className="text-4xl font-semibold text-center mb-6 text-gray-800">
          Add New SAP System
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Please complete the following steps to set up your SAP system.
        </p>

        {/* Progress Bar */}
        <div className={`flex mb-6 space-x-6 sap-step step-${currentStep}`}>
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center space-x-2 sap-step-number">
              {/* Step Title and Number Container */}
              <div className="flex flex-col items-center space-y-2">
                {/* Step Number */}
                <div className={`sap-cirlce flex items-center justify-center rounded-full font-semibold border-2 mb-2 transition-all duration-300 ease-in-out transform ${
                    step.number <= currentStep
                      ? "bg-blue-700 text-white border-blue-500 scale-105"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  { step.number <= currentStep ? <Check  />: step.number}
                </div>

                {/* Step Title */}
                <div
                  className={`text-sm font-medium ${
                    step.number <= currentStep
                      ? "text-blue-500"
                      : "text-gray-500"
                  } transition-all duration-300 ease-in-out sap-step-title`}
                >
                  {step.title}
                </div>
              </div>

              {/* Line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={`sap-line w-12 h-1 transition-all duration-300 ease-in-out ${
                    step.number < currentStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
            
          ))}
        </div>

        {/* Form Content */}
        <form className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Destination Name *
                </label>
                <input
                  type="text"
                  name="destinationName"
                  value={formData.destinationName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.destinationName ? "border-red-500" : ""
                  }`}
                  placeholder="Enter destination name"
                />
                {errors.destinationName && (
                  <span className="text-red-500 text-sm">
                    {errors.destinationName}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                />
              </div>
              <div className="mt-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    System Type *
                  </label>
                  <select
                    name="systemType"
                    value={formData.systemType}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    SID *
                  </label>
                  <input
                    type="text"
                    name="sid"
                    value={formData.sid}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.sid ? "border-red-500" : ""
                    }`}
                    placeholder="System ID"
                  />
                  {errors.sid && (
                    <span className="text-red-500 text-sm">{errors.sid}</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Step 2: Connection */}
          {currentStep === 2 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Host *
                  </label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.host ? "border-red-500" : ""
                    }`}
                    placeholder="Enter host"
                    name="host"
                    onChange={handleChange}
                    value={formData.host}
                  />
                  {errors.host && (
                    <span className="text-red-500 text-sm">{errors.host}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Instance/Port *
                  </label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.instance ? "border-red-500" : ""
                    }`}
                    placeholder="Enter instance/port"
                    name="instance"
                    onChange={handleChange}
                    value={formData.instance}
                  />
                  {errors.instance && (
                    <span className="text-red-500 text-sm">
                      {errors.instance}
                    </span>
                  )}
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mt-4">
                Client
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter client"
                name="client"
                onChange={handleChange}
                value={formData.client}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    name="username"
                    placeholder="Enter username"
                    onChange={handleChange}
                    value={formData.username}
                  />
                  {errors.username && (
                    <span className="text-red-500 text-sm">
                      {errors.username}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    className={`w-full p-3 border rounded-md mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Enter password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Advanced Options */}
          {currentStep === 3 && (
            <div className="p-6 bg-gray-100 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Advanced Options
              </h3>
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700 font-medium">
                  Is HANA System?
                </label>
                <label className="switch inline-block ml-4">
                  <input
                    type="checkbox"
                    checked={formData.isHana}
                    onChange={() =>
                      setFormData({ ...formData, isHana: !formData.isHana })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">
                  Enable Central User Repository?
                </label>
                <label className="switch inline-block ml-4">
                  <input
                    type="checkbox"
                    checked={formData.isCentralUser}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        isCentralUser: !formData.isCentralUser,
                      })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {currentStep === 4 && (
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                {/* Basic Info Section */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Basic Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  {/* Destination Name */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Destination Name
                    </h4>
                    <p className="text-gray-800">{formData.destinationName}</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Description
                    </h4>
                    <p className="text-gray-800">
                      {formData.description || "No description provided"}
                    </p>
                  </div>

                  {/* SID */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">SID</h4>
                    <p className="text-gray-800">{formData.sid}</p>
                  </div>
                </div>

                {/* Connection Section */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Connection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  {/* System Type */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      System Type
                    </h4>
                    <p className="text-gray-800">{formData.systemType}</p>
                  </div>

                  {/* Host */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Host</h4>
                    <p className="text-gray-800">{formData.host}</p>
                  </div>

                  {/* Instance/Port */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Instance/Port
                    </h4>
                    <p className="text-gray-800">{formData.instance}</p>
                  </div>
                </div>

                {/* Advanced Options Section */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Advanced Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Client */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Client
                    </h4>
                    <p className="text-gray-800">{formData.client}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 text-white px-6 py-3 rounded-md"
            >
              {currentStep === totalSteps ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
