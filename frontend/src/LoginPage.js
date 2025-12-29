
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { toast, Toaster } from "react-hot-toast";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  FaSignInAlt, 
  FaEnvelope, 
  FaLock, 
  FaKey, 
  FaArrowRight,
  FaUserShield,
  FaBuilding,
  FaCheckCircle
} from 'react-icons/fa';

const API_BASE = "https://school-operation-app.onrender.com";

// Dark Mode Toggle Button
const ToggleButton = styled.button`
  position: fixed; /* Changed from absolute to fixed */
  top: 24px;
  right: 24px;
  z-index: 1000; /* Increased z-index */
  background: ${props => props.dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'};
  backdrop-filter: blur(12px);
  border: 1px solid ${props => props.dark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)'};
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: ${props => props.dark ? '#F8FAFC' : '#0F172A'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const glowAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const slideInFromRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Modern Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    -45deg,
    #EAF2FF,
    #F5F7FF,
    #EEF4FF,
    #F8FAFF
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 18s ease infinite;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3B82F6, #8B5CF6, #2DD4BF);
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const FloatingElement = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  backdrop-filter: blur(18px);
  animation: ${floatAnimation} ${props => props.duration || '20s'} ease-in-out infinite;

  &:nth-child(1) {
    width: 110px;
    height: 110px;
    top: 12%;
    left: 6%;
  }

  &:nth-child(2) {
    width: 90px;
    height: 90px;
    top: 68%;
    right: 10%;
    animation-duration: 26s;
  }

  &:nth-child(3) {
    width: 130px;
    height: 130px;
    bottom: 10%;
    left: 14%;
    animation-duration: 32s;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  backdrop-filter: blur(28px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 1;
  animation: ${slideInFromRight} 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 480px) {
    padding: 32px 24px;
    border-radius: 22px;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;

  img {
    height: 65px;
    margin-bottom: 20px;
    filter: drop-shadow(0 8px 18px rgba(59, 130, 246, 0.25));
  }

  h1 {
    font-size: 32px;
    margin: 0 0 8px;
    font-weight: 700;
    background: linear-gradient(135deg, #2563EB, #7C3AED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: #475569;
    font-size: 14px;
    font-weight: 500;
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(45, 212, 191, 0.18);
  border: 1px solid rgba(45, 212, 191, 0.35);
  border-radius: 14px;
  padding: 10px 18px;
  margin-bottom: 32px;

  span {
    color: #0F766E;
    font-size: 13px;
    font-weight: 600;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* Increased gap between label and input */

  label {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 20px 18px 52px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(203, 213, 225, 0.8);
  border-radius: 16px;
  font-size: 15px;
  color: #0F172A;
  transition: all 0.3s ease;
  box-sizing: border-box;
  padding-left: 60px !important; /* Increased padding for more gap */

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.85);
    border-color: #60A5FA;
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.25);
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
  font-size: 18px;
  z-index: 2;
`;

const DomainHint = styled.div`
  margin-top: 8px;
  padding: 10px 16px;
  background: rgba(96, 165, 250, 0.18);
  border: 1px solid rgba(96, 165, 250, 0.35);
  border-radius: 12px;

  span {
    color: #1D4ED8;
    font-size: 12px;
    font-weight: 500;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.35);
    background: linear-gradient(135deg, #60A5FA, #A78BFA);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #2563EB;
  }
`;

const Footer = styled.div`
  margin-top: 40px;
  text-align: center;

  p {
    color: #64748B;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
`;

const LoadingSpinner = styled.div`
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PasswordResetSection = styled.div`
  margin-top: 24px;
  padding-top: 28px;
  border-top: 1px solid rgba(203, 213, 225, 0.6);
`;

/* Dark Mode Styled Components */
const darkGradient = keyframes`
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
`;

const DarkContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #0B1120, #111827, #1E293B, #0F172A);
  background-size: 400% 400%;
  animation: ${darkGradient} 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
  overflow: hidden;
`;

const DarkCard = styled.div`
  background: rgba(17, 24, 39, 0.95);
  padding: 48px;
  border-radius: 28px; /* Increased to match light mode */
  width: 100%;
  max-width: 440px; /* Match light mode width */
  backdrop-filter: blur(28px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    padding: 32px 24px;
    border-radius: 22px;
  }
`;

const DarkInput = styled.input`
  width: 100%;
  padding: 18px 20px 18px 60px !important; /* Increased padding for more gap */
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(71, 85, 105, 0.4);
  border-radius: 16px;
  font-size: 15px;
  color: #F1F5F9;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    background: rgba(30, 41, 59, 0.9);
    border-color: #60A5FA;
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.25);
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const DarkButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #2563EB, #7C3AED);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.35);
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Dark mode floating elements
const DarkFloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const DarkFloatingElement = styled.div`
  position: absolute;
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(18px);
  animation: ${floatAnimation} ${props => props.duration || '20s'} ease-in-out infinite;

  &:nth-child(1) {
    width: 110px;
    height: 110px;
    top: 12%;
    left: 6%;
  }

  &:nth-child(2) {
    width: 90px;
    height: 90px;
    top: 68%;
    right: 10%;
    animation-duration: 26s;
  }

  &:nth-child(3) {
    width: 130px;
    height: 130px;
    bottom: 10%;
    left: 14%;
    animation-duration: 32s;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  
  // Load dark mode preference from localStorage on initial render
  const [dark, setDark] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);

  // Validate email for @onmyowntechnology.com domain
  const validateEmail = (email) => {
    return email.endsWith("@onmyowntechnology.com");
  };

  // Check if already logged in
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (storedRole && storedEmail) {
      if (storedRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/form", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Please use your official company email (@onmyowntechnology.com)");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/login`, { 
        email, 
        password 
      });

      if (res.data.success) {
        // Store user info
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userName", res.data.name || email.split('@')[0]);
        
        toast.success("Welcome back! Redirecting...", {
          icon: '🎉',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        // Clear form
        setEmail("");
        setPassword("");
        
        // Redirect based on role
        setTimeout(() => {
          if (res.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/form");
          }
        }, 1200);
      } else {
        toast.error(res.data.message || "Invalid credentials", {
          icon: '🔒',
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      
      let errorMessage = "Network error. Please try again.";
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      toast.error(errorMessage, {
        icon: '⚠️',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (!validateEmail(forgotEmail)) {
      toast.error("Please use your official company email (@onmyowntechnology.com)");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/forgot-password`, { 
        email: forgotEmail 
      });
      
      if (res.data.success) {
        const message = res.data.message || "Password reset instructions have been sent to your email.";
        toast.success(message, {
          icon: '📧',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        // Clear field and hide form after success
        setForgotEmail("");
        setTimeout(() => {
          setShowForgotPassword(false);
        }, 2000);
      } else {
        toast.error(res.data.message || "Failed to send reset email.", {
          icon: '❌',
        });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      
      let errorMessage = "Network error. Please try again.";
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      toast.error(errorMessage, {
        icon: '⚠️',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderDarkMode = () => {
    return (
      <DarkContainer>
        <ToggleButton dark={true} onClick={() => setDark(false)}>
          <FaSun />
          Light Mode
        </ToggleButton>
        
        <DarkFloatingElements>
          <DarkFloatingElement />
          <DarkFloatingElement />
          <DarkFloatingElement />
        </DarkFloatingElements>
        
        <DarkCard>
          <LogoSection>
            <img src="/OMOTEC.png" alt="OMOTEC Logo" style={{ filter: 'drop-shadow(0 8px 18px rgba(59, 130, 246, 0.35))' }} />
            <h1 style={{ 
              background: 'linear-gradient(135deg, #60A5FA, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>OMOTEC School Operations</h1>        
          </LogoSection>
                  
          {!showForgotPassword ? (
            <>
              <Form onSubmit={handleLogin}>
                <InputGroup>
                  <label style={{ color: "#CBD5E1" }}>
                    <FaEnvelope />
                    Enterprise Email
                  </label>
                  <InputWrapper>
                    <InputIcon style={{ color: "#94A3B8", left: '20px' }}>
                      <FaEnvelope />
                    </InputIcon>
                    <DarkInput
                      type="email"
                      placeholder="username@onmyowntechnology.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </InputWrapper>
                  {email && !validateEmail(email) && (
                    <div style={{ 
                      marginTop: '8px',
                      padding: '10px 16px',
                      background: 'rgba(96, 165, 250, 0.18)',
                      border: '1px solid rgba(96, 165, 250, 0.35)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaBuilding style={{ color: '#60A5FA' }} />
                      <span style={{ color: "#60A5FA", fontSize: '12px', fontWeight: '500' }}>
                        Must use official @onmyowntechnology.com email
                      </span>
                    </div>
                  )}
                </InputGroup>

                <InputGroup>
                  <label style={{ color: "#CBD5E1" }}>
                    <FaLock />
                    Password
                  </label>
                  <InputWrapper>
                    <InputIcon style={{ color: "#94A3B8", left: '20px' }}>
                      <FaLock />
                    </InputIcon>
                    <DarkInput
                      type="password"
                      placeholder="Enter your secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </InputWrapper>
                </InputGroup>

                <DarkButton 
                  type="submit" 
                  disabled={loading || !email || !password || !validateEmail(email)}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      Secure Login
                      <FaArrowRight style={{ marginLeft: 'auto' }} />
                    </>
                  )}
                </DarkButton>
              </Form>

              <ForgotPasswordLink 
                onClick={() => {
                  setShowForgotPassword(true);
                  setEmail("");
                  setPassword("");
                }}
                type="button"
                style={{ color: "#CBD5E1" }}
              >
                <FaKey />
                Forgot your password?
              </ForgotPasswordLink>
            </>
          ) : (
            <PasswordResetSection style={{ borderColor: 'rgba(71, 85, 105, 0.6)' }}>
              <h3 style={{ 
                marginBottom: '28px', 
                textAlign: 'center', 
                color: '#F8FAFC',
                fontSize: '22px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <FaKey />
                Password Recovery
              </h3>
              
              <Form onSubmit={handleForgotPassword}>
                <InputGroup>
                  <label style={{ color: "#CBD5E1" }}>
                    <FaEnvelope />
                    Recovery Email
                  </label>
                  <InputWrapper>
                    <InputIcon style={{ color: "#94A3B8", left: '20px' }}>
                      <FaEnvelope />
                    </InputIcon>
                    <DarkInput
                      type="email"
                      placeholder="username@onmyowntechnology.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </InputWrapper>
                  {forgotEmail && !validateEmail(forgotEmail) && (
                    <div style={{ 
                      marginTop: '8px',
                      padding: '10px 16px',
                      background: 'rgba(96, 165, 250, 0.18)',
                      border: '1px solid rgba(96, 165, 250, 0.35)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaBuilding style={{ color: '#60A5FA' }} />
                      <span style={{ color: "#60A5FA", fontSize: '12px', fontWeight: '500' }}>
                        Must use official @onmyowntechnology.com email
                      </span>
                    </div>
                  )}
                </InputGroup>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '28px',
                  flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
                }}>
                  <DarkButton 
                    type="submit" 
                    disabled={loading || !forgotEmail || !validateEmail(forgotEmail)}
                  >
                    {loading ? <LoadingSpinner /> : <FaCheckCircle />}
                    {loading ? "Sending..." : "Send Recovery Link"}
                  </DarkButton>
                  <DarkButton 
                    type="button" 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail("");
                    }}
                    style={{ 
                      background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
                      maxWidth: window.innerWidth <= 480 ? '100%' : '40%'
                    }}
                  >
                    Cancel
                  </DarkButton>
                </div>
              </Form>
            </PasswordResetSection>
          )}
          
          <Footer>
            <p style={{ color: "#94A3B8" }}>© {new Date().getFullYear()} OMOTEC Education Systems</p>
            <p style={{ color: "#94A3B8" }}>
              <FaUserShield style={{ marginRight: '6px' }} />
              Restricted Access • Enterprise Authentication Required
            </p>
          </Footer>
        </DarkCard>
      </DarkContainer>
    );
  };

  const renderLightMode = () => {
    return (
      <LoginContainer>
        <ToggleButton dark={false} onClick={() => setDark(true)}>
          <FaMoon />
          Dark Mode
        </ToggleButton>
        
        <FloatingElements>
          <FloatingElement />
          <FloatingElement />
          <FloatingElement />
        </FloatingElements>
        
        <LoginCard>
          <LogoSection>
            <img src="/OMOTEC.png" alt="OMOTEC Logo" />
            <h1>OMOTEC School Operations</h1>        
          </LogoSection>
                  
          {!showForgotPassword ? (
            <>
              <Form onSubmit={handleLogin}>
                <InputGroup>
                  <label>
                    <FaEnvelope />
                    Enterprise Email
                  </label>
                  <InputWrapper>
                    <InputIcon error={email && !validateEmail(email)}>
                      <FaEnvelope />
                    </InputIcon>
                    <Input
                      type="email"
                      placeholder="username@onmyowntechnology.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      error={email && !validateEmail(email)}
                    />
                  </InputWrapper>
                  {email && !validateEmail(email) && (
                    <DomainHint>
                      <FaBuilding />
                      <span>Must use official @onmyowntechnology.com email</span>
                    </DomainHint>
                  )}
                </InputGroup>

                <InputGroup>
                  <label>
                    <FaLock />
                    Password
                  </label>
                  <InputWrapper>
                    <InputIcon>
                      <FaLock />
                    </InputIcon>
                    <Input
                      type="password"
                      placeholder="Enter your secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </InputWrapper>
                </InputGroup>

                <Button 
                  type="submit" 
                  disabled={loading || !email || !password || !validateEmail(email)}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      Secure Login
                      <FaArrowRight style={{ marginLeft: 'auto' }} />
                    </>
                  )}
                </Button>
              </Form>

              <ForgotPasswordLink 
                onClick={() => {
                  setShowForgotPassword(true);
                  setEmail("");
                  setPassword("");
                }}
                type="button"
              >
                <FaKey />
                Forgot your password?
              </ForgotPasswordLink>
            </>
          ) : (
            <PasswordResetSection>
              <h3 style={{ 
                marginBottom: '28px', 
                textAlign: 'center', 
                color: '#0F172A',
                fontSize: '22px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <FaKey />
                Password Recovery
              </h3>
              
              <Form onSubmit={handleForgotPassword}>
                <InputGroup>
                  <label>
                    <FaEnvelope />
                    Recovery Email
                  </label>
                  <InputWrapper>
                    <InputIcon error={forgotEmail && !validateEmail(forgotEmail)}>
                      <FaEnvelope />
                    </InputIcon>
                    <Input
                      type="email"
                      placeholder="username@onmyowntechnology.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoComplete="email"
                      error={forgotEmail && !validateEmail(forgotEmail)}
                    />
                  </InputWrapper>
                  {forgotEmail && !validateEmail(forgotEmail) && (
                    <DomainHint>
                      <FaBuilding />
                      <span>Must use official @onmyowntechnology.com email</span>
                    </DomainHint>
                  )}
                </InputGroup>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '28px',
                  flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
                }}>
                  <Button 
                    type="submit" 
                    disabled={loading || !forgotEmail || !validateEmail(forgotEmail)}
                  >
                    {loading ? <LoadingSpinner /> : <FaCheckCircle />}
                    {loading ? "Sending..." : "Send Recovery Link"}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail("");
                    }}
                    style={{ 
                      background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                      maxWidth: window.innerWidth <= 480 ? '100%' : '40%'
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </PasswordResetSection>
          )}
          
          <Footer>
            <p>© {new Date().getFullYear()} OMOTEC Education Systems</p>
            <p>
              <FaUserShield style={{ marginRight: '6px' }} />
              Restricted Access • Enterprise Authentication Required
            </p>
          </Footer>
        </LoginCard>
      </LoginContainer>
    );
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: dark ? '#1F2937' : '#FFFFFF',
            color: dark ? '#F9FAFB' : '#1F2937',
            border: dark ? '1px solid #374151' : '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      {dark ? renderDarkMode() : renderLightMode()}
    </>
  );
};

export default LoginPage;