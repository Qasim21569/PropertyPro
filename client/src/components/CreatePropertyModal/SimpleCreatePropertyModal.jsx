import React, { useState } from "react";
import { addPropertyDirect } from "../../utils/directFirebase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const SimpleCreatePropertyModal = ({ opened, setOpened, onPropertyCreated }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    address: "",
    city: "",
    country: "USA",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    facilities: {
      bedrooms: 2,
      bathrooms: 1,
      parking: false,
      gym: false,
      pool: false
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.description || !formData.price || !formData.address || !formData.city) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (formData.price <= 0) {
        toast.error("Please enter a valid price");
        return;
      }

      await addPropertyDirect(formData, currentUser.uid, currentUser.email);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: 0,
        address: "",
        city: "",
        country: "USA",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        facilities: { bedrooms: 2, bathrooms: 1, parking: false, gym: false, pool: false }
      });

      onPropertyCreated();
    } catch (error) {
      console.error("Error creating property:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!opened) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2>Create New Property</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Property Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Price (USD) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Country</label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setOpened(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleCreatePropertyModal;

