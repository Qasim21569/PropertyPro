import React, { useState } from "react";
import { Modal, TextInput, PasswordInput, Button, Group, Select, Text, Anchor } from "@mantine/core";
import { useAuth } from "../../context/AuthContext";
import { createUser } from "../../utils/firebaseApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthModal.css";

const AuthModal = ({ opened, setOpened }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "user"
  });

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
        setOpened(false);
        
        // Redirect to homepage - welcome banner will guide them to dashboard
        setTimeout(() => navigate("/"), 100);
      } else {
        // Sign up
        if (!formData.name.trim()) {
          toast.error("Please enter your name");
          return;
        }
        
        await signup(formData.email, formData.password, formData.name, formData.role);
        
        // Create user profile via API (to sync with backend)
        try {
          await createUser(formData.email, formData.name, formData.role);
        } catch (apiError) {
          console.error("Error creating user profile via API:", apiError);
        }
        
        toast.success(`Account created successfully as a ${formData.role}!`);
        setOpened(false);
        
        // Redirect to appropriate dashboard after signup
        const dashboardRoute = formData.role === "owner" ? "/dashboard/owner" : "/dashboard/user";
        setTimeout(() => navigate(dashboardRoute), 100);
      }

      // Reset form
      setFormData({ email: "", password: "", name: "", role: "user" });
    } catch (error) {
      console.error("Auth error:", error);
      
      // Handle specific Firebase auth errors
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address");
      } else {
        toast.error(isLogin ? "Login failed" : "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", name: "", role: "user" });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={isLogin ? "Sign In" : "Create Account"}
      centered
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              mb="sm"
            />

            <Select
              label="Account Type"
              placeholder="Select account type"
              value={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              data={[
                { value: "user", label: "Property Seeker" },
                { value: "owner", label: "Property Owner" }
              ]}
              required
              mb="sm"
            />
          </>
        )}

        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          mb="sm"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
          mb="md"
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {isLogin ? "Sign In" : "Create Account"}
        </Button>

        <Group justify="center" mt="md">
          <Text size="sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <Anchor
            size="sm"
            onClick={switchMode}
            style={{ cursor: "pointer" }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Anchor>
        </Group>
      </form>
    </Modal>
  );
};

export default AuthModal;
