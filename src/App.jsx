import React, { useState } from 'react';
import { ArrowRight, Droplet, Leaf, Thermometer, CloudRain, Sun, Info, HelpCircle } from 'lucide-react';
import axios from 'axios';

export default function CropRecommendationSystem() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call (replace with actual axios call in production)
      // setTimeout(() => {
      //   // Mock response for demonstration
      //   const crops = [
      //     { name: "Rice", suitability: "High", notes: "Thrives in humid conditions with abundant water" },
      //     { name: "Wheat", suitability: "Medium", notes: "Prefers moderate temperatures and well-drained soil" },
      //     { name: "Maize", suitability: "High", notes: "Grows best in warm, sunny areas with moderate rainfall" },
      //     { name: "Cotton", suitability: "Medium", notes: "Requires warm weather and at least 180 frost-free days" },
      //     { name: "Sugarcane", suitability: "High", notes: "Needs tropical climate with plenty of sunlight" }
      //   ];
      //   const randomIndex = Math.floor(Math.random() * crops.length);
      //   setResult(crops[randomIndex]);
      //   setLoading(false);
      // }, 1500);
      // Uncomment for actual API call:
      // const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      const response = await axios.post('https://crops-detection-server.onrender.com/predict', formData);
      setResult({ name: response.data.crop, suitability: response.data.suitability, notes: response.data.notes });
      setLoading(false);
   
    } catch (error) {
      console.error(error);
      setResult({ error: 'Error occurred while predicting.' });
      setLoading(false);
    }
  };

  const tooltips = {
    N: "Nitrogen is essential for leaf growth and the green color in plants. Optimal range varies by crop.",
    P: "Phosphorus helps with root growth and flower/fruit development. Critical for energy transfer in plants.",
    K: "Potassium improves overall plant health and disease resistance. Essential for water regulation.",
    temperature: "The average temperature of your field area. Most crops have specific temperature ranges for optimal growth.",
    humidity: "The relative humidity affects transpiration and water requirements. Some crops prefer humid conditions.",
    ph: "Soil pH affects nutrient availability. Most crops prefer slightly acidic to neutral soil (6.0-7.0).",
    rainfall: "Annual rainfall in your region. Different crops have varying water requirements."
  };

  const inputFields = [
    { name: 'N', label: 'Nitrogen (N)', icon: <Leaf className="text-green-500" />, unit: 'mg/kg', min: 0, max: 200 },
    { name: 'P', label: 'Phosphorus (P)', icon: <Leaf className="text-green-600" />, unit: 'mg/kg', min: 0, max: 200 },
    { name: 'K', label: 'Potassium (K)', icon: <Leaf className="text-green-700" />, unit: 'mg/kg', min: 0, max: 200 },
    { name: 'temperature', label: 'Temperature', icon: <Thermometer className="text-red-500" />, unit: '°C', min: -10, max: 60 },
    { name: 'humidity', label: 'Humidity', icon: <Droplet className="text-blue-500" />, unit: '%', min: 0, max: 100 },
    { name: 'ph', label: 'pH Level', icon: <Droplet className="text-blue-600" />, unit: 'pH', min: 0, max: 14, step: 0.1 },
    { name: 'rainfall', label: 'Rainfall', icon: <CloudRain className="text-blue-400" />, unit: 'mm', min: 0, max: 5000 }
  ];

  const getSuitabilityColor = (suitability) => {
    switch (suitability) {
      case 'High': return 'text-green-700';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-orange-600';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-white p-3 rounded-full shadow-md">
              <Leaf className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Recommendation System</h1>
          <p className="mt-2 text-lg text-gray-600">Enter your soil and environmental conditions to find the ideal crop for your field</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Soil & Environmental Parameters</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inputFields.map((field) => (
                      <div key={field.name} className="relative">
                        <label htmlFor={field.name} className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <span className="mr-2">{field.icon}</span>
                          {field.label}
                          <button 
                            type="button"
                            className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            onMouseEnter={() => setActiveTooltip(field.name)}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <HelpCircle size={14} />
                          </button>
                        </label>
                        {activeTooltip === field.name && (
                          <div className="absolute z-10 bg-gray-800 text-white text-sm rounded p-2 shadow-lg max-w-xs">
                            {tooltips[field.name]}
                          </div>
                        )}
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="number"
                            name={field.name}
                            id={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md"
                            placeholder="0"
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">{field.unit}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                          Analyzing soil data...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Find Optimal Crop
                          <ArrowRight className="ml-2" size={18} />
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="lg:col-span-1">
                <div className="h-full flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendation</h2>
                  
                  {!result && !loading && (
                    <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 text-center">
                      <Sun className="h-12 w-12 text-yellow-400 mb-4" />
                      <p className="text-gray-600">Fill in the parameters and click "Find Optimal Crop" to get your personalized recommendation</p>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600">Analyzing soil data and weather conditions...</p>
                    </div>
                  )}
                  
                  {result && !loading && !result.error && (
                    <div className="flex-grow bg-green-50 border border-green-100 rounded-lg p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{result.name}</h3>
                      <div className="flex justify-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuitabilityColor(result.suitability)} bg-opacity-20 bg-green-100`}>
                          {result.suitability} Suitability
                        </span>
                      </div>
                      <p className="text-gray-700 text-center">{result.notes}</p>
                      
                      <div className="mt-6 pt-4 border-t border-green-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Info size={14} className="mr-1" />
                          Growing Tips
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Ensure proper drainage for best results</li>
                          <li>• Monitor soil moisture regularly</li>
                          <li>• Consider crop rotation practices</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {result && result.error && (
                    <div className="flex-grow bg-red-50 border border-red-100 rounded-lg p-6 text-center">
                      <p className="text-red-600">{result.error}</p>
                      <p className="text-sm text-gray-600 mt-2">Please check your inputs and try again.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-500">
              <p>Data is processed locally and not stored on any server.</p>
              <div className="mt-2 md:mt-0 flex items-center">
                <span>Need help?</span>
                <button className="ml-2 text-green-600 hover:text-green-800 font-medium">View Guide</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}