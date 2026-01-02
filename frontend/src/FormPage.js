import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { toast, Toaster } from 'react-hot-toast';
import {
  FaSave,
  FaSignOutAlt,
  FaSchool,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBook,
  FaCalendarAlt,
  FaBuilding,
  FaHashtag,
  FaComment,
  FaCheckCircle,
  FaUserCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE;

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Dark Mode Toggle Button
const ToggleButton = styled.button`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
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

// Dark Mode Components
const darkGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Light Mode Components
const LightContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #EAF2FF, #F5F7FF, #EEF4FF, #F8FAFF);
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

const DarkContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #0B1120, #111827, #1E293B, #0F172A);
  background-size: 400% 400%;
  animation: ${darkGradient} 15s ease infinite;
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
    background: linear-gradient(90deg, #2563EB, #7C3AED, #14B8A6);
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

// FIXED: Use destructuring syntax for props
const FloatingElement = styled.div`
  position: absolute;
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.45)'};
  border: 1px solid ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 24px;
  backdrop-filter: blur(18px);
  animation: ${floatAnimation} ${({ duration }) => duration || '20s'} ease-in-out infinite;
  
  &:nth-child(1) {
    width: 120px;
    height: 120px;
    top: 10%;
    left: 5%;
  }
  
  &:nth-child(2) {
    width: 80px;
    height: 80px;
    top: 70%;
    right: 10%;
    animation-duration: 25s;
  }
  
  &:nth-child(3) {
    width: 100px;
    height: 100px;
    bottom: 10%;
    left: 15%;
    animation-duration: 30s;
  }
`;

const MainCard = styled.div`
  background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 28px;
  padding: 48px;
  width: 100%;
  max-width: 1200px;
  box-shadow: 
    0 30px 80px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.12)'},
    inset 0 0 0 1px ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(28px);
  position: relative;
  z-index: 1;
  animation: ${slideInFromRight} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)'};
  
  @media (max-width: 1024px) {
    padding: 32px;
  }
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.6)'};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  img {
    height: 50px;
    filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05) rotate(-2deg);
      filter: drop-shadow(0 6px 20px rgba(59, 130, 246, 0.4));
    }
  }
  
  .header-text {
    h1 {
      color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
      font-size: 28px;
      margin: 0 0 6px 0;
      font-weight: 700;
      background: ${({ dark }) => dark
    ? 'linear-gradient(135deg, #60A5FA, #A78BFA)'
    : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      color: ${({ dark }) => dark ? '#94A3B8' : '#475569'};
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  border: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.6)'};
  border-radius: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(59, 130, 246, 0.4)'};
    background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
    
    .user-name {
      font-weight: 600;
      font-size: 15px;
      color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    }
    
    .user-role {
      font-size: 12px;
      color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
    }
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  background: ${props => {
    if (props.variant === 'primary') return 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)';
    if (props.variant === 'danger') return 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)';
    return props.dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)';
  }};
  color: ${props => !props.variant ? (props.dark ? '#CBD5E1' : '#334155') : 'white'};
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: ${props => props.variant === 'danger'
    ? '0 15px 30px rgba(220, 38, 38, 0.3)'
    : '0 15px 30px rgba(37, 99, 235, 0.3)'};
    
    ${props => {
    if (props.variant === 'primary') {
      return 'background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);';
    }
    if (props.variant === 'danger') {
      return 'background: linear-gradient(135deg, #EF4444 0%, #F87171 100%);';
    }
    if (props.dark) {
      return 'background: rgba(37, 99, 235, 0.1); color: #60A5FA;';
    }
    return 'background: rgba(59, 130, 246, 0.1); color: #2563EB;';
  }}
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover:not(:disabled)::after {
    left: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Content = styled.main`
  animation: ${fadeIn} 0.6s ease-out;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h2 {
    font-size: 32px;
    font-weight: 700;
    color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
  
  .subtitle {
    color: ${({ dark }) => dark ? '#94A3B8' : '#475569'};
    font-size: 16px;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const FormCard = styled.div`
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)'};
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.6)'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(59, 130, 246, 0.3)'};
    box-shadow: 0 10px 30px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 28px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;
const FormContainer = styled.div`
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ dark }) => dark ? '#CBD5E1' : '#334155'};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 20px 18px 60px !important;
  background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${({ error, dark }) => error
    ? 'rgba(220, 38, 38, 0.3)'
    : dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.8)'};
  border-radius: 16px;
  font-size: 15px;
  color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)'};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
  
  &::placeholder {
    color: ${({ dark }) => dark ? '#64748B' : '#94A3B8'};
  }
  
  &:hover:not(:focus) {
    border-color: ${({ dark }) => dark ? 'rgba(100, 116, 139, 0.5)' : 'rgba(148, 163, 184, 0.5)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 18px 20px 18px 60px !important;
  background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${({ error, dark }) => error
    ? 'rgba(220, 38, 38, 0.3)'
    : dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.8)'};
  border-radius: 16px;
  font-size: 15px;
  color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)'};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: ${({ dark }) => dark ? 'rgba(100, 116, 139, 0.5)' : 'rgba(148, 163, 184, 0.5)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  option {
    background: ${({ dark }) => dark ? '#1E293B' : '#FFFFFF'};
    color: ${({ dark }) => dark ? '#F8FAFC' : '#1F2937'};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ error, dark }) => error ? '#DC2626' : dark ? '#64748B' : '#64748B'};
  font-size: 18px;
  transition: color 0.3s ease;
  z-index: 2;
  pointer-events: none;
`;

const ErrorText = styled.span`
  color: #F87171;
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: ${fadeIn} 0.3s ease;
`;

const SuccessMessage = styled.div`
  background: ${({ dark }) => dark ? 'rgba(20, 184, 166, 0.1)' : 'rgba(20, 184, 166, 0.15)'};
  border: 1px solid ${({ dark }) => dark ? 'rgba(20, 184, 166, 0.2)' : 'rgba(20, 184, 166, 0.3)'};
  border-radius: 14px;
  padding: 16px 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ dark }) => dark ? '#14B8A6' : '#0F766E'};
  font-weight: 600;
  animation: ${fadeIn} 0.5s ease;
`;

const InfoCard = styled.div`
  background: ${({ dark }) => dark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  border: 1px solid ${({ dark }) => dark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)'};
  border-radius: 14px;
  padding: 16px 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ dark }) => dark ? '#60A5FA' : '#2563EB'};
  font-size: 14px;
  
  svg {
    flex-shrink: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)'};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.6)'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
    transform: translateY(-5px);
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    margin-bottom: 8px;
    background: ${({ dark }) => dark
    ? 'linear-gradient(135deg, #60A5FA, #A78BFA)'
    : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .stat-label {
    font-size: 14px;
    color: ${({ dark }) => dark ? '#94A3B8' : '#475569'};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const Footer = styled.footer`
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.6)'};
  text-align: center;
  
  p {
    color: ${({ dark }) => dark ? '#64748B' : '#64748B'};
    font-size: 12px;
    margin: 6px 0;
    font-weight: 500;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionButton = styled.button`
  padding: 16px;
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  border: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.6)'};
  border-radius: 14px;
  color: ${({ dark }) => dark ? '#94A3B8' : '#475569'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
    border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
    color: ${({ dark }) => dark ? '#60A5FA' : '#2563EB'};
    transform: translateY(-3px);
  }
  
  svg {
    font-size: 24px;
  }
`;

// Main Component
const FormPage = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [locations, setLocations] = useState([]);
  const [school, setSchool] = useState("");
  const [location, setLocation] = useState("");
  const [grade, setGrade] = useState("");
  const [term, setTerm] = useState("");
  const [workbook, setWorkbook] = useState("");
  const [workbookOptions, setWorkbookOptions] = useState([]);
  const [reportingBranch, setReportingBranch] = useState("");
  const [count, setCount] = useState("");
  const [remark, setRemark] = useState("");
  const [loading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [grades, setGrades] = useState([]);
  const [userName, setUserName] = useState("User");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [stats, setStats] = useState({
    totalEntries: 0,
    thisMonth: 0,
    pending: 0,
    completed: 0
  });

  // Dark mode state
  const [dark, setDark] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);

  // Check authentication
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedRole || !storedEmail || storedRole === "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Validate form
  useEffect(() => {
    const isValid = school && location && grade && term && workbook && count && remark;
    setFormValid(isValid);

    const newErrors = {};
    if (!school) newErrors.school = "School is required";
    if (!location) newErrors.location = "Location is required";
    if (!grade) newErrors.grade = "Grade is required";
    if (!term) newErrors.term = "Term is required";
    if (!workbook) newErrors.workbook = "Workbook is required";
    if (!count || count <= 0) newErrors.count = "Valid count is required";
    if (!remark || remark.trim().length < 3) newErrors.remark = "Valid remark is required (min 3 chars)";
    setErrors(newErrors);
  }, [school, location, grade, term, workbook, count, remark]);

  // Fetch Grades
  useEffect(() => {
    axios.get(`${API_BASE}/grades`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.schools || [];
        setSchools(data);
      })

      .catch(() => setGrades([]));
  }, []);

  // Fetch Workbook Options
  const fetchWorkbookOptions = async (g, s, loc) => {
    if (!g) {
      setWorkbookOptions([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/workbook_name`, {
        params: { grade: g, school: s, location: loc },
      });
      setWorkbookOptions(res.data.workbooks || []);
    } catch {
      setWorkbookOptions([]);
    }
  };

  // Fetch User Info
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${API_BASE}/user-info`, { params: { email: userEmail } })
        .then((res) => {
          if (res.data.success) {
            setUserName(res.data.name || userEmail.split('@')[0]);
          }
        })
        .catch(() => setUserName(userEmail.split('@')[0]));
    }
  }, [userEmail]);

  // Fetch Schools
  useEffect(() => {
    axios
      .get(`${API_BASE}/schools`)
      .then((res) => setSchools(res.data || []))
      .catch(() => setSchools([]));
  }, []);

  // Fetch Locations
  const fetchLocations = async (s) => {
    try {
      const res = await axios.get(`${API_BASE}/locations`, {
        params: { school: s },
      });
      const data = Array.isArray(res.data)
  ? res.data
  : res.data?.locations || [];
setLocations(data);

      if (res.data?.length === 1) {
        const onlyLoc = res.data[0];
        setLocation(onlyLoc);
        fetchReportingBranch(s, onlyLoc);
      }
    } catch {
      setLocations([]);
    }
  };

  // Fetch Reporting Branch
  const fetchReportingBranch = async (s, loc) => {
    try {
      const res = await axios.get(`${API_BASE}/reporting_branch`, {
        params: { school: s, location: loc },
      });
      setReportingBranch(res.data.reporting_branch || "");
    } catch {
      setReportingBranch("");
    }
  };

  // Fetch User Stats
  const fetchUserStats = async () => {
    if (!userEmail) return;

    try {
      const res = await axios.get(`${API_BASE}/user-stats`, {
        params: { email: userEmail }
      });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Handlers
  const handleSchoolChange = (s) => {
    setSchool(s);
    setLocation("");
    setReportingBranch("");
    setGrade("");
    setTerm("");
    setWorkbook("");
    setWorkbookOptions([]);
    fetchLocations(s);
  };

  const handleLocationChange = (loc) => {
    setLocation(loc);
    setGrade("");
    setTerm("");
    setWorkbook("");
    setWorkbookOptions([]);

    if (school && loc) {
      fetchReportingBranch(school, loc);
    } else {
      setReportingBranch("");
    }
  };

  const handleGradeChange = (g) => {
    setGrade(g);
    setWorkbook("");
    setWorkbookOptions([]);
    fetchWorkbookOptions(g, school, location);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE}/submit`, {
        school,
        location,
        grade,
        term,
        workbook,
        count,
        remark,
        submitted_by: userEmail,
      });

      if (response.data.success) {
        toast.success("Entry submitted successfully!", {
          icon: '🎉',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });

        setSuccessMessage("Entry submitted successfully! The form will reset in 2 seconds.");

        // Update stats
        fetchUserStats();

        setTimeout(() => {
          setSchool("");
          setLocation("");
          setGrade("");
          setTerm("");
          setWorkbook("");
          setWorkbookOptions([]);
          setReportingBranch("");
          setCount("");
          setRemark("");
          setLocations([]);
          setSuccessMessage("");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to submit entry");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Error submitting entry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleClearForm = () => {
    if (window.confirm("Clear all form fields?")) {
      setSchool("");
      setLocation("");
      setGrade("");
      setTerm("");
      setWorkbook("");
      setWorkbookOptions([]);
      setReportingBranch("");
      setCount("");
      setRemark("");
      setLocations([]);
      setErrors({});
      toast.success("Form cleared");
    }
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchUserStats();
  }, []);

  // Render function for the form page
  const renderFormPage = () => {
    const Container = dark ? DarkContainer : LightContainer;

    return (
      <Container>
        <ToggleButton dark={dark} onClick={() => setDark(!dark)}>
          {dark ? <FaSun /> : <FaMoon />}
          {dark ? "Light Mode" : "Dark Mode"}
        </ToggleButton>

        <FloatingElements>
          <FloatingElement dark={dark} />
          <FloatingElement dark={dark} duration="25s" />
          <FloatingElement dark={dark} duration="30s" />
        </FloatingElements>

        <MainCard dark={dark}>
          <Header dark={dark}>
            <LogoSection dark={dark}>
              <img src="/OMOTEC.png" alt="OMOTEC Logo" />
              <div className="header-text">
                <h1>OMOTEC School Operations</h1>
                <p>Workbook Entry System</p>
              </div>
            </LogoSection>

            <UserSection>
              <UserInfo dark={dark}>
                <div className="user-avatar">
                  <FaUserCircle />
                </div>
                <div className="user-details">
                  <div className="user-name">{userName}</div>
                  <div className="user-role">User</div>
                </div>
              </UserInfo>

              <Button variant="danger" onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </Button>
            </UserSection>
          </Header>

          <Content>
            <StatsGrid>
              <StatCard dark={dark}>
                <div className="stat-value">{stats.totalEntries}</div>
                <div className="stat-label">Total Entries</div>
              </StatCard>
              <StatCard dark={dark}>
                <div className="stat-value">{stats.thisMonth}</div>
                <div className="stat-label">This Month</div>
              </StatCard>
              <StatCard dark={dark}>
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </StatCard>
              <StatCard dark={dark}>
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">Pending Review</div>
              </StatCard>
            </StatsGrid>

            <FormHeader dark={dark}>
              <h2>
                <FaBook />
                Workbook Entry Form
              </h2>
              <p className="subtitle">
                Fill in the details below to submit a new workbook entry. All fields marked with * are required.
              </p>
            </FormHeader>

            {successMessage && (
              <SuccessMessage dark={dark}>
                <FaCheckCircle />
                {successMessage}
              </SuccessMessage>
            )}

            <InfoCard dark={dark}>
              <FaInfoCircle />
              Ensure all information is accurate before submission. You can track your submission history in the dashboard.
            </InfoCard>

            <FormCard dark={dark}>
              <FormContainer>
                <form onSubmit={handleSubmit}>
                  <FormGrid>
                    {/* School */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaSchool />
                        School *
                      </Label>
                      <InputWrapper>
                        <InputIcon error={errors.school} dark={dark}>
                          <FaSchool />
                        </InputIcon>
                        <Select
                          dark={dark}
                          value={school}
                          onChange={(e) => handleSchoolChange(e.target.value)}
                          error={errors.school}
                          disabled={loading}
                        >
                          <option value="">Select School</option>
                          {schools.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </InputWrapper>
                      {errors.school && (
                        <ErrorText>
                          <FaExclamationTriangle />
                          {errors.school}
                        </ErrorText>
                      )}
                    </FormGroup>

                    {/* Location */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaMapMarkerAlt />
                        Location *
                      </Label>
                      <InputWrapper>
                        <InputIcon error={errors.location} dark={dark}>
                          <FaMapMarkerAlt />
                        </InputIcon>
                        {locations.length > 1 ? (
                          <Select
                            dark={dark}
                            value={location}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            error={errors.location}
                            disabled={!school}
                          >
                            <option value="">Select Location</option>
                            {locations.map((l, i) => (
                              <option key={i} value={l}>
                                {l}
                              </option>
                            ))}
                          </Select>
                        ) : (
                          <Input
                            dark={dark}
                            value={location}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            placeholder="Location will auto-fill if only one exists"
                            error={errors.location}
                            disabled={!school}
                          />
                        )}
                      </InputWrapper>
                      {errors.location && (
                        <ErrorText>
                          <FaExclamationTriangle />
                          {errors.location}
                        </ErrorText>
                      )}
                    </FormGroup>

                    {/* Grade */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaGraduationCap />
                        Grade *
                      </Label>
                      <InputWrapper>
                        <InputIcon error={errors.grade} dark={dark}>
                          <FaGraduationCap />
                        </InputIcon>
                        <Select
                          dark={dark}
                          value={grade}
                          onChange={(e) => handleGradeChange(e.target.value)}
                          error={errors.grade}
                          disabled={!location}
                        >
                          <option value="">Select Grade</option>
                          {grades.map((g, i) => (
                            <option key={i} value={g}>
                              {g}
                            </option>
                          ))}
                        </Select>
                      </InputWrapper>
                      {errors.grade && (
                        <ErrorText>
                          <FaExclamationTriangle />
                          {errors.grade}
                        </ErrorText>
                      )}
                    </FormGroup>

                    {/* Term */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaCalendarAlt />
                        Term *
                      </Label>
                      <InputWrapper>
                        <InputIcon error={errors.term} dark={dark}>
                          <FaCalendarAlt />
                        </InputIcon>
                        <Select
                          dark={dark}
                          value={term}
                          onChange={(e) => setTerm(e.target.value)}
                          error={errors.term}
                          disabled={!grade}
                        >
                          <option value="">Select Term</option>
                          {[1, 2, 3].map((t) => (
                            <option key={t} value={t}>
                              Term {t}
                            </option>
                          ))}
                        </Select>
                      </InputWrapper>
                      {errors.term && (
                        <ErrorText>
                          <FaExclamationTriangle />
                          {errors.term}
                        </ErrorText>
                      )}
                    </FormGroup>

                    {/* Workbook */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaBook />
                        Workbook *
                      </Label>
                      <InputWrapper>
                        <InputIcon error={errors.workbook} dark={dark}>
                          <FaBook />
                        </InputIcon>
                        <Select
                          dark={dark}
                          value={workbook}
                          onChange={(e) => setWorkbook(e.target.value)}
                          error={errors.workbook}
                          disabled={!term || workbookOptions.length === 0}
                        >
                          <option value="">Select Workbook</option>
                          {workbookOptions.map((wb, i) => (
                            <option key={i} value={wb}>
                              {wb}
                            </option>
                          ))}
                        </Select>
                      </InputWrapper>
                      {errors.workbook && (
                        <ErrorText>
                          <FaExclamationTriangle />
                          {errors.workbook}
                        </ErrorText>
                      )}
                    </FormGroup>

                    {/* Reporting Branch */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaBuilding />
                        Reporting Branch
                      </Label>
                      <InputWrapper>
                        <InputIcon dark={dark}>
                          <FaBuilding />
                        </InputIcon>
                        <Input
                          dark={dark}
                          value={reportingBranch}
                          readOnly
                          placeholder="Auto-filled based on school and location"
                        />
                      </InputWrapper>
                    </FormGroup>

                    {/* Count */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaHashtag />
                        Count *
                      </Label>
                      <InputWrapper>
                        <InputIcon error={errors.count} dark={dark}>
                          <FaHashtag />
                        </InputIcon>
                        <Input
                          dark={dark}
                          type="number"
                          min="1"
                          value={count}
                          onChange={(e) => setCount(Math.max(1, e.target.value))}
                          placeholder="Enter count"
                          error={errors.count}
                        />
                      </InputWrapper>
                      {errors.count && (
                        <ErrorText>
                          <FaExclamationTriangle />
                          {errors.count}
                        </ErrorText>
                      )}
                    </FormGroup>

                    {/* Remark */}
                    <FormGroup>
                      <Label dark={dark}>
                        <FaComment />
                        Remark *
                      </Label>
                      <InputWrapper>
                        <InputIcon error={errors.remark} dark={dark}>
                          <FaComment />
                        </InputIcon>
                        <Input
                          dark={dark}
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          placeholder="Enter remarks (minimum 3 characters)"
                          error={errors.remark}
                        />
                      </InputWrapper>
                      {errors.remark && (
                        <ErrorText>
                          <FaExclamationTriangle />
                          {errors.remark}
                        </ErrorText>
                      )}
                    </FormGroup>
                  </FormGrid>

                  <ActionButtons>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!formValid || submitting}
                      style={{ flex: 1 }}
                    >
                      {submitting ? <LoadingSpinner /> : <FaSave />}
                      {submitting ? "Submitting..." : "Submit Entry"}
                    </Button>

                    <Button
                      type="button"
                      dark={dark}
                      onClick={handleClearForm}
                      disabled={submitting}
                    >
                      Clear Form
                    </Button>
                  </ActionButtons>
                </form>
              </FormContainer>
            </FormCard>

            <QuickActions>


              <QuickActionButton dark={dark} onClick={() => navigate("/help")}>
                <FaInfoCircle />
                Help & Guide
              </QuickActionButton>

              <QuickActionButton dark={dark} onClick={() => window.location.href = "mailto:support@onmyowntechnology.com"}>
                <FaComment />
                Contact Support
              </QuickActionButton>
            </QuickActions>
          </Content>

          <Footer dark={dark}>
            <p>© {new Date().getFullYear()} OMOTEC Education Systems</p>
            <p>Workbook Management System • Version 2.0.1</p>
            <p>Logged in as: {userEmail}</p>
          </Footer>
        </MainCard>
      </Container>
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
      {renderFormPage()}
    </>
  );
};

export default FormPage;