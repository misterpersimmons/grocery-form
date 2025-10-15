import React, { useState, useRef } from 'react';
import { ChevronDown, Plus, Trash2, Send, Camera, X, Check } from 'lucide-react';

export default function GroceryRequestForm() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    storePreference: 'HEB',
    budgetCap: '',
    deliveryTime: 'flexible',
    categories: {
      produce: { items: '', instructions: '', photo: null },
      meat: { items: '', instructions: '', photo: null },
      pantry: { items: '', instructions: '', photo: null },
      frozen: { items: '', instructions: '', photo: null },
      household: { items: '', instructions: '', photo: null }
    },
    substitutions: '',
    notes: ''
  });

  const [cameraActive, setCameraActive] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const stores = ['H-E-B', 'Target', 'Costco', 'Whole Foods', 'Trader Joe\'s', 'Walmart'];
  const timeSlots = [
    { value: 'flexible', label: 'Flexible (ASAP)' },
    { value: 'morning', label: 'Morning (8am - 12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
    { value: 'evening', label: 'Evening (5pm - 8pm)' },
    { value: 'specific', label: 'Specific Time' }
  ];

  const categoryLabels = {
    produce: '🥕 Produce',
    meat: '🥩 Meat & Seafood',
    pantry: '🥫 Pantry',
    frozen: '❄️ Frozen',
    household: '🧼 Household'
  };

  const startCamera = async (category) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraActive(category);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Please allow camera access to take photos');
    }
  };

  const capturePhoto = (category) => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      const video = videoRef.current;
      
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      const photoData = canvasRef.current.toDataURL('image/jpeg');
      
      setFormData({
        ...formData,
        categories: {
          ...formData.categories,
          [category]: {
            ...formData.categories[category],
            photo: photoData
          }
        }
      });
      
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(null);
  };

  const deletePhoto = (category) => {
    setFormData({
      ...formData,
      categories: {
        ...formData.categories,
        [category]: {
          ...formData.categories[category],
          photo: null
        }
      }
    });
  };

  const handleStoreChange = (e) => {
    setFormData({ ...formData, storePreference: e.target.value });
  };

  const handleBudgetChange = (e) => {
    setFormData({ ...formData, budgetCap: e.target.value });
  };

  const handleTimeChange = (e) => {
    setFormData({ ...formData, deliveryTime: e.target.value });
  };

  const handleCategoryChange = (category, field, value) => {
    setFormData({
      ...formData,
      categories: {
        ...formData.categories,
        [category]: {
          ...formData.categories[category],
          [field]: value
        }
      }
    });
  };

  const handleSubstitutionsChange = (e) => {
    setFormData({ ...formData, substitutions: e.target.value });
  };

  const handleNotesChange = (e) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Grocery Request</h1>
          <p className="text-gray-600">Fill out your shopping preferences and take photos for reference</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Store & Budget Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Store Preference *</label>
              <select
                value={formData.storePreference}
                onChange={handleStoreChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Cap</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  placeholder="e.g., 150"
                  value={formData.budgetCap}
                  onChange={handleBudgetChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Preferred Delivery Time *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timeSlots.map(slot => (
                <label key={slot.value} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50">
                  <input
                    type="radio"
                    name="deliveryTime"
                    value={slot.value}
                    checked={formData.deliveryTime === slot.value}
                    onChange={handleTimeChange}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="ml-3 text-gray-700">{slot.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories with Photo Capture */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shopping by Category</h2>
            <div className="space-y-8">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
                    {formData.categories[key].photo ? (
                      <div className="flex items-center gap-2">
                        <Check className="text-green-500" size={20} />
                        <span className="text-sm text-green-600 font-medium">Photo captured</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Photo Section */}
                  <div className="mb-6 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    {formData.categories[key].photo ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={formData.categories[key].photo}
                          alt={`${key} reference`}
                          className="w-full max-w-xs h-40 object-cover rounded-lg"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => startCamera(key)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                          >
                            <Camera size={16} />
                            Retake Photo
                          </button>
                          <button
                            onClick={() => deletePhoto(key)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startCamera(key)}
                        className="w-full py-8 flex flex-col items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
                      >
                        <Camera size={32} />
                        <span className="font-medium">Take Photo</span>
                        <span className="text-sm text-gray-500">Tap to open camera</span>
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items to Purchase</label>
                    <textarea
                      placeholder="e.g., Organic apples, bananas, spinach..."
                      value={formData.categories[key].items}
                      onChange={(e) => handleCategoryChange(key, 'items', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                    <textarea
                      placeholder="e.g., Choose ripe but not overripe..."
                      value={formData.categories[key].instructions}
                      onChange={(e) => handleCategoryChange(key, 'instructions', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-16"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Substitutions */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Substitution Preferences</label>
            <textarea
              placeholder="e.g., If Tropicana OJ is out, get Simply Orange or skip. If grass-fed beef is unavailable, substitute with organic..."
              value={formData.substitutions}
              onChange={handleSubstitutionsChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Additional Notes</label>
            <textarea
              placeholder="Any other preferences or information..."
              value={formData.notes}
              onChange={handleNotesChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-20"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
              submitted
                ? 'bg-green-500'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Send size={20} />
            {submitted ? 'Request Submitted!' : 'Submit Grocery Request'}
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>We'll review your request and confirm delivery within 2 hours</p>
        </div>
      </div>

      {/* Camera Modal */}
      {cameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
            <div className="relative bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="p-6 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {categoryLabels[cameraActive]}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Position your item in the camera view and tap "Capture Photo"
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => capturePhoto(cameraActive)}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}