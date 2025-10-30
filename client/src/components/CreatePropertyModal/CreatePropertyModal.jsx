import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  Grid,
  Switch,
  Title
} from "@mantine/core";
import useCountries from "../../hooks/useCountries";
import { addPropertyDirect } from "../../utils/directFirebase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./CreatePropertyModal.css";

const CreatePropertyModal = ({ opened, setOpened, onPropertyCreated }) => {
  const { getAll } = useCountries();
  const countries = getAll();
  const { currentUser, userProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    address: "",
    city: "",
    country: "",
    image: "",
    facilities: {
      bedrooms: 1,
      bathrooms: 1,
      parking: false,
      gym: false,
      pool: false,
      garden: false,
      balcony: false,
      wifi: false,
      ac: false,
      heating: false
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFacilityChange = (facility, value) => {
    setFormData(prev => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        [facility]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = ["title", "description", "price", "address", "city", "country"];
      for (const field of requiredFields) {
        if (!formData[field]) {
          toast.error(`Please fill in the ${field} field`);
          return;
        }
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
        country: "",
        image: "",
        facilities: {
          bedrooms: 1,
          bathrooms: 1,
          parking: false,
          gym: false,
          pool: false,
          garden: false,
          balcony: false,
          wifi: false,
          ac: false,
          heating: false
        }
      });

      onPropertyCreated();
    } catch (error) {
      console.error("Error creating property:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Create New Property Listing"
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit} className="create-property-form">
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Property Title"
              placeholder="Enter property title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Description"
              placeholder="Describe your property"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              minRows={3}
              required
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <NumberInput
              label="Price (USD)"
              placeholder="Enter price"
              value={formData.price}
              onChange={(value) => handleInputChange("price", value || 0)}
              min={0}
              required
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              label="Country"
              placeholder="Select country"
              value={formData.country}
              onChange={(value) => handleInputChange("country", value)}
              data={countries.map(country => ({
                value: country.name,
                label: country.name
              }))}
              searchable
              required
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="City"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              label="Image URL"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={4} mb="md">Property Facilities</Title>
          </Grid.Col>

          <Grid.Col span={6}>
            <NumberInput
              label="Bedrooms"
              value={formData.facilities.bedrooms}
              onChange={(value) => handleFacilityChange("bedrooms", value || 1)}
              min={1}
              max={10}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <NumberInput
              label="Bathrooms"
              value={formData.facilities.bathrooms}
              onChange={(value) => handleFacilityChange("bathrooms", value || 1)}
              min={1}
              max={10}
            />
          </Grid.Col>

          {["parking", "gym", "pool", "garden", "balcony", "wifi", "ac", "heating"].map((facility) => (
            <Grid.Col key={facility} span={6}>
              <Switch
                label={facility.charAt(0).toUpperCase() + facility.slice(1)}
                checked={formData.facilities[facility]}
                onChange={(e) => handleFacilityChange(facility, e.currentTarget.checked)}
              />
            </Grid.Col>
          ))}
        </Grid>

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Property
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreatePropertyModal;
