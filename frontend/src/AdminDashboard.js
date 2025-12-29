import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import styled, { keyframes } from "styled-components";
import { toast, Toaster } from 'react-hot-toast';
import { 
  FaSchool, FaUsers, FaClipboardList, FaBookOpen, FaSearch, FaTimes, 
  FaSignOutAlt, FaPlus, FaSave, FaTrash, FaEdit, FaCheck, FaTimesCircle, 
  FaCalendarAlt, FaDownload, FaMinus, FaUserCircle, FaCaretDown,
  FaDatabase, FaFilter, FaSync, FaChartBar, FaEye, FaEyeSlash, FaCog,
  FaArrowUp, FaArrowDown, FaHistory, FaBox, FaBell, FaHome, 
  FaChevronRight, FaLayerGroup, FaListAlt, FaWarehouse, FaRegClock,
  FaRegCheckCircle, FaRegTimesCircle, FaBars, FaChevronLeft,
  FaTachometerAlt, FaShieldAlt, FaFileExport, FaUserShield,
  FaMapMarkerAlt, FaBuilding, FaEnvelope, FaLock, FaGraduationCap, FaBook, FaHashtag,
  FaMoon, FaSun
} from 'react-icons/fa';

const API_BASE = "https://school-operation-app.onrender.com";

// Animations matching LoginPage
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const floatAndRotate = keyframes`
  0% {
    transform: translateY(-100px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
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

const darkGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Dark Mode Toggle Button
const ToggleButton = styled.button`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  background: ${({ dark }) => dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'};
  backdrop-filter: blur(12px);
  border: 1px solid ${({ dark }) => dark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)'};
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

// Light Mode Container
const LightContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(-45deg, #EAF2FF, #F5F7FF, #EEF4FF, #F8FAFF);
  background-size: 400% 400%;
  animation: ${gradientShift} 18s ease infinite;
  position: relative;
  overflow: hidden;
`;

// Dark Mode Container
const DarkContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(-45deg, #0B1120, #111827, #1E293B, #0F172A);
  background-size: 400% 400%;
  animation: ${darkGradient} 15s ease infinite;
  position: relative;
  overflow: hidden;
`;

const FloatingElements = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const FloatingElement = styled.div`
  position: absolute;
  background: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255, 255, 255, 0.45)'};
  border: 1px solid ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 20px;
  backdrop-filter: blur(10px);
  animation: ${floatAnimation} ${({ duration }) => duration || '20s'} ease-in-out infinite;
  
  &:nth-child(1) {
    width: 120px;
    height: 120px;
    top: 10%;
    left: 5%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    width: 80px;
    height: 80px;
    top: 70%;
    right: 10%;
    animation-delay: -5s;
    animation-duration: 25s;
  }
  
  &:nth-child(3) {
    width: 100px;
    height: 100px;
    bottom: 10%;
    left: 15%;
    animation-delay: -10s;
    animation-duration: 30s;
  }
`;

const Sidebar = styled.aside`
  width: 260px;
  background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-right: 1px solid ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(203, 213, 225, 0.3)'};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  animation: ${slideInFromRight} 0.4s ease-out;
  transition: transform 0.3s ease;
  backdrop-filter: blur(20px);
  box-shadow: ${({ dark }) => dark 
    ? '0 0 30px rgba(0, 0, 0, 0.2)' 
    : '0 0 30px rgba(0, 0, 0, 0.1)'};
  
  @media (max-width: 1024px) {
    transform: translateX(-100%);
    
    &.open {
      transform: translateX(0);
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
  display: flex;
  align-items: center;
  gap: 16px;
  
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    
    img {
      height: 40px;
      width: auto;
      filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05) rotate(-2deg);
        filter: drop-shadow(0 6px 20px rgba(59, 130, 246, 0.4));
      }
    }
    
          
      span {
        font-size: 0.75rem;
        color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
        font-weight: 500;
      }
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  
  @media (max-width: 1024px) {
    display: flex;
  }
  
  &:hover {
    border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.5)' : 'rgba(59, 130, 246, 0.4)'};
    color: ${({ dark }) => dark ? '#60A5FA' : '#2563EB'};
    transform: translateY(-2px);
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
`;

const NavItem = styled.div`
  padding: 0 16px;
  margin-bottom: 4px;
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 8px;
    color: ${({ active, dark }) => active 
      ? (dark ? '#F8FAFC' : '#0F172A') 
      : (dark ? '#94A3B8' : '#64748B')};
    background: ${({ active, dark }) => active 
      ? (dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.1)') 
      : 'transparent'};
    font-weight: ${({ active }) => active ? '600' : '500'};
    text-decoration: none;
    transition: all 0.2s ease;
    border: 1px solid ${({ active, dark }) => active 
      ? (dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.2)') 
      : 'transparent'};
    cursor: pointer;
    
    &:hover {
      background: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
      color: ${({ dark }) => dark ? '#60A5FA' : '#2563EB'};
      transform: translateX(4px);
      border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.2)'};
    }
    
    .nav-icon {
      font-size: 1.1rem;
    }
    
    .nav-text {
      flex: 1;
      font-size: 0.95rem;
    }
    
    .nav-badge {
      background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
      color: white;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }
  }
`;

const MainContent = styled.main`
  margin-left: 260px;
  padding: 24px;
  animation: ${fadeIn} 0.4s ease-out;
  flex: 1;
  max-width: calc(100vw - 260px);
  overflow-x: hidden;
  
  @media (max-width: 1024px) {
    margin-left: 0;
    max-width: 100vw;
  }
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 16px;
  margin-bottom: 32px;
  box-shadow: 
    0 10px 30px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.08)'},
    0 0 0 1px ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  backdrop-filter: blur(20px);
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
`;

const PageTitle = styled.div`
  flex: 1;
  
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .subtitle {
    font-size: 0.875rem;
    color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
    margin-top: 8px;
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.6)'};
  
  &:hover {
    border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(59, 130, 246, 0.4)'};
    background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
    transform: translateY(-2px);
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
    font-size: 1.25rem;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    
    .user-name {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    }
    
    .user-role {
      font-size: 0.8rem;
      color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
    }
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  background: ${props => {
    if (props.variant === 'primary') return 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)';
    if (props.variant === 'success') return 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)';
    if (props.variant === 'danger') return 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)';
    if (props.variant === 'warning') return 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)';
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
    box-shadow: 0 15px 30px ${props => props.variant === 'danger' 
      ? 'rgba(220, 38, 38, 0.3)' 
      : 'rgba(37, 99, 235, 0.3)'};
    filter: brightness(1.1);
    
    ${props => !props.variant && props.dark && 'background: rgba(37, 99, 235, 0.1); color: #60A5FA;'}
    ${props => !props.variant && !props.dark && 'background: rgba(59, 130, 246, 0.1); color: #2563EB;'}
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
  animation: ${spin} 1s linear infinite;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 10px 30px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.08)'},
    0 0 0 1px ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  border: 1px solid ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'};
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 20px 40px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.15)'},
      0 0 0 1px ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
    border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ color }) => color || 'linear-gradient(90deg, #2563EB, #7C3AED, #14B8A6)'};
  }
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${({ bgColor, dark }) => bgColor || (dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)')};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ iconColor, dark }) => iconColor || (dark ? '#60A5FA' : '#2563EB')};
    font-size: 1.25rem;
    border: 1px solid ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ trend }) => trend === 'up' ? '#14B8A6' : '#EF4444'};
    background: ${({ trend }) => trend === 'up' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid ${({ trend }) => trend === 'up' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    margin-bottom: 8px;
    line-height: 1;
    background: ${({ dark }) => dark 
      ? 'linear-gradient(135deg, #60A5FA, #A78BFA)' 
      : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  .stat-footer {
    margin-top: 20px;
    font-size: 0.75rem;
    color: ${({ dark }) => dark ? '#64748B' : '#94A3B8'};
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }
`;

const ContentSection = styled.section`
  background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 10px 30px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.08)'},
    0 0 0 1px ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  margin-bottom: 32px;
  border: 1px solid ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'};
  animation: ${fadeIn} 0.6s ease-out;
  backdrop-filter: blur(20px);
  max-width: 100%;
  overflow-x: hidden;
`;

const SectionHeader = styled.div`
  padding: 28px 32px;
  border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 16px;
    
    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
      margin: 0;
      background: ${({ dark }) => dark 
        ? 'linear-gradient(135deg, #60A5FA, #A78BFA)' 
        : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .section-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ dark }) => dark ? '#60A5FA' : '#2563EB'};
      font-size: 1.25rem;
      border: 1px solid ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
    }
  }
  
  .section-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
`;

const FormSection = styled.div`
  padding: 32px;
  border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  max-width: 100%;
  overflow-x: hidden;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  max-width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ dark }) => dark ? '#64748B' : '#64748B'};
  font-size: 18px;
  transition: color 0.3s ease;
  z-index: 2;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 16px 20px 16px 52px;
  background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${({ error, dark }) => error 
    ? 'rgba(220, 38, 38, 0.3)' 
    : dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.8)'};
  border-radius: 14px;
  font-size: 15px;
  color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)'};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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
  max-width: 100%;
  box-sizing: border-box;
  padding: 16px 20px 16px 52px;
  background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${({ error, dark }) => error 
    ? 'rgba(220, 38, 38, 0.3)' 
    : dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.8)'};
  border-radius: 14px;
  font-size: 15px;
  color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: ${({ dark }) => dark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)'};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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

const FilterBar = styled.div`
  padding: 20px 32px;
  border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100%;
  
  .search-container {
    flex: 1;
    min-width: 300px;
    position: relative;
    max-width: 100%;
    
    .search-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: ${({ dark }) => dark ? '#64748B' : '#64748B'};
      z-index: 1;
      font-size: 18px;
    }
    
    input {
      padding-left: 52px;
      width: 100%;
      max-width: 100%;
    }
  }
`;

const ActionBar = styled.div`
  padding: 20px 32px;
  border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
  background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 100%;
  
  .action-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

const DataTableContainer = styled.div`
  overflow-x: auto;
  min-height: 400px;
  background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  max-width: 100%;
  width: 100%;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ dark }) => dark ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.6)'};
    border-radius: 4px;
  }
  
  .rdt_Table {
    width: 100% !important;
    min-width: 100% !important;
  }
  
  .rdt_TableHead, .rdt_TableBody {
    width: 100% !important;
  }
`;

const ModernDataTable = styled(DataTable)`
  .rdt_Table {
    border: none;
    background: transparent;
    min-width: 1000px;
  }
  
  .rdt_TableHead {
    background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
    
    .rdt_TableHeadRow {
      border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
      min-height: 60px;
      background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
      
      .rdt_TableCol {
        font-weight: 600;
        font-size: 0.875rem;
        color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 16px 12px !important;
        border-right: none;
        white-space: nowrap;
        
        &:hover {
          background: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.05)' : 'rgba(59, 130, 246, 0.05)'};
        }
        
        &:first-child {
          padding-left: 20px !important;
        }
        
        &:last-child {
          padding-right: 20px !important;
        }
      }
    }
  }
  
  .rdt_TableBody {
    .rdt_TableRow {
      border-bottom: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
      min-height: 60px;
      background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
      transition: all 0.2s ease;
      
      &:hover {
        background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)'};
        transform: translateY(-1px);
        box-shadow: 0 4px 20px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .rdt_TableCell {
        padding: 16px 12px !important;
        font-size: 0.95rem;
        color: ${({ dark }) => dark ? '#F8FAFC' : '#1F2937'};
        border-right: none;
        white-space: normal;
        word-wrap: break-word;
        
        &:first-child {
          padding-left: 20px !important;
        }
        
        &:last-child {
          padding-right: 20px !important;
        }
        
        input, select {
          max-width: 100%;
          box-sizing: border-box;
        }
      }
    }
  }
  
  .rdt_Pagination {
    border-top: 1px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
    padding: 20px;
    background: ${({ dark }) => dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
    color: ${({ dark }) => dark ? '#F8FAFC' : '#1F2937'};
    
    button {
      &:hover:not(:disabled) {
        background: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
        color: ${({ dark }) => dark ? '#60A5FA' : '#2563EB'};
        border-color: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
      }
    }
    
    .MuiButtonBase-root {
      color: ${({ dark }) => dark ? '#F8FAFC' : '#1F2937'};
      
      &.Mui-selected {
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: white;
      }
    }
  }
`;

const StatusIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ status, dark }) => 
    status === 'Yes' || status === 'Delivered' ? 'rgba(20, 184, 166, 0.1)' :
    status === 'No' || status === 'Pending' ? 'rgba(239, 68, 68, 0.1)' :
    dark ? 'rgba(100, 116, 139, 0.1)' : 'rgba(148, 163, 184, 0.1)'};
  color: ${({ status }) => 
    status === 'Yes' || status === 'Delivered' ? '#14B8A6' :
    status === 'No' || status === 'Pending' ? '#EF4444' :
    '#94A3B8'};
  border: 1px solid ${({ status }) => 
    status === 'Yes' || status === 'Delivered' ? 'rgba(20, 184, 166, 0.2)' :
    status === 'No' || status === 'Pending' ? 'rgba(239, 68, 68, 0.2)' :
    'rgba(100, 116, 139, 0.2)'};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid ${({ dark }) => dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'};
    border-top-color: #2563EB;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 24px;
  }
  
  .loading-text {
    font-size: 1rem;
    color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
    font-weight: 500;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ dark }) => dark ? '#60A5FA' : '#2563EB'};
    font-size: 2rem;
    margin-bottom: 24px;
    border: 1px solid ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  }
  
  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    margin-bottom: 8px;
  }
  
  .empty-description {
    font-size: 0.95rem;
    color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
    max-width: 400px;
    margin-bottom: 24px;
    line-height: 1.6;
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  
  .error-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: rgba(239, 68, 68, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #EF4444;
    font-size: 2rem;
    margin-bottom: 24px;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  .error-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ dark }) => dark ? '#F8FAFC' : '#0F172A'};
    margin-bottom: 8px;
  }
  
  .error-description {
    font-size: 0.95rem;
    color: ${({ dark }) => dark ? '#94A3B8' : '#64748B'};
    max-width: 400px;
    margin-bottom: 24px;
    line-height: 1.6;
  }
`;

const Footer = styled.footer`
  margin-top: 40px;
  padding: 24px;
  text-align: center;
  background: ${({ dark }) => dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 16px;
  border: 1px solid ${({ dark }) => dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'};
  box-shadow: 
    0 10px 30px ${({ dark }) => dark ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.08)'},
    0 0 0 1px ${({ dark }) => dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  
  p {
    color: ${({ dark }) => dark ? '#64748B' : '#64748B'};
    font-size: 12px;
    margin: 6px 0;
    font-weight: 500;
  }
`;

// Main Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("submissions");
  const [adminName, setAdminName] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Dark mode state
  const [dark, setDark] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);
  
  // Data states
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [workbooks, setWorkbooks] = useState([]);
  
  // Loading states
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [loadingWorkbooks, setLoadingWorkbooks] = useState(false);
  
  // Error states
  const [errorSchools, setErrorSchools] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorSubmissions, setErrorSubmissions] = useState(null);
  const [errorWorkbooks, setErrorWorkbooks] = useState(null);
  
  // Form states
  const [newSchool, setNewSchool] = useState({
    school_name: "", location: "", reporting_branch: "", num_students: ""
  });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [newWorkbook, setNewWorkbook] = useState({
    grade: "", workbook_name: "", quantity: ""
  });
  
  // Edit states
  const [editingRow, setEditingRow] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  
  // Filter states
  const [filterText, setFilterText] = useState("");
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [adjustValues, setAdjustValues] = useState({});

  // Check authentication
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (!storedRole || !storedEmail || storedRole !== "admin") {
      navigate("/", { replace: true });
    } else {
      setAdminEmail(storedEmail);
      
      fetch(`${API_BASE}/user-info?email=${storedEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setAdminName(data.name);
        })
        .catch(() => setAdminName("Administrator"));
    }
  }, [navigate]);

  // Fetch data for active tab
  useEffect(() => {
    const fetchDataForTab = async () => {
      switch (activeTab) {
        case "schools":
          setLoadingSchools(true);
          setErrorSchools(null);
          try {
            const res = await fetch(`${API_BASE}/admin/entries`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setEntries(Array.isArray(data) ? data : []);
          } catch (error) {
            console.error("Error fetching schools:", error);
            setErrorSchools("Failed to load schools data");
            setEntries([]);
          } finally {
            setLoadingSchools(false);
          }
          break;

        case "users":
          setLoadingUsers(true);
          setErrorUsers(null);
          try {
            const res = await fetch(`${API_BASE}/admin/users`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
          } catch (error) {
            console.error("Error fetching users:", error);
            setErrorUsers("Failed to load users data");
            setUsers([]);
          } finally {
            setLoadingUsers(false);
          }
          break;

        case "submissions":
          setLoadingSubmissions(true);
          setErrorSubmissions(null);
          try {
            const res = await fetch(`${API_BASE}/admin/form-submissions`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const sortedSubs = Array.isArray(data) 
              ? [...data].sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0))
              : [];
            setSubmissions(sortedSubs);
          } catch (error) {
            console.error("Error fetching submissions:", error);
            setErrorSubmissions("Failed to load submissions data");
            setSubmissions([]);
          } finally {
            setLoadingSubmissions(false);
          }
          break;

        case "workbooks":
          setLoadingWorkbooks(true);
          setErrorWorkbooks(null);
          try {
            const res = await fetch(`${API_BASE}/admin/workbooks`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setWorkbooks(Array.isArray(data) ? data : []);
          } catch (error) {
            console.error("Error fetching workbooks:", error);
            setErrorWorkbooks("Failed to load workbooks data");
            setWorkbooks([]);
          } finally {
            setLoadingWorkbooks(false);
          }
          break;
      }
    };

    fetchDataForTab();
  }, [activeTab]);

  // Calculate stats
  const stats = useMemo(() => ({
    totalSubmissions: submissions.length,
    totalSchools: entries.length,
    totalUsers: users.length,
    totalWorkbooks: workbooks.reduce((sum, w) => sum + (parseInt(w.quantity) || 0), 0),
    pendingDeliveries: submissions.filter(s => s.delivered === 'No').length,
    todaySubmissions: submissions.filter(s => {
      const today = new Date().toDateString();
      const subDate = new Date(s.submitted_at).toDateString();
      return subDate === today;
    }).length,
    activeToday: users.length
  }), [entries, submissions, users, workbooks]);

  // Filter data
  const filteredData = useMemo(() => {
    const lowerFilter = filterText.toLowerCase();
    
    switch (activeTab) {
      case "schools":
        return entries.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(lowerFilter)
          )
        );
      case "users":
        return users.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(lowerFilter)
          )
        );
      case "submissions":
        let filtered = submissions;
        if (fromDate) {
          filtered = filtered.filter(s => 
            new Date(s.submitted_at) >= new Date(fromDate)
          );
        }
        if (toDate) {
          const toDateObj = new Date(toDate);
          toDateObj.setHours(23, 59, 59, 999);
          filtered = filtered.filter(s => 
            new Date(s.submitted_at) <= toDateObj
          );
        }
        return filtered.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(lowerFilter)
          )
        );
      case "workbooks":
        return workbooks.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(lowerFilter)
          )
        );
      default:
        return [];
    }
  }, [activeTab, entries, users, submissions, workbooks, filterText, fromDate, toDate]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items
  const navItems = [
    { key: "submissions", label: "Submissions", icon: <FaClipboardList />, badge: stats.todaySubmissions },
    { key: "schools", label: "Schools", icon: <FaSchool />, badge: stats.totalSchools },
    { key: "users", label: "Users", icon: <FaUsers />, badge: stats.totalUsers },
    { key: "workbooks", label: "Inventory", icon: <FaBookOpen />, badge: stats.totalWorkbooks },
  ];

  // Tab titles
  const tabTitles = {
    submissions: "Submissions Management",
    schools: "School Management",
    users: "User Management",
    workbooks: "Inventory Management"
  };

  // Tab icons
  const tabIcons = {
    submissions: <FaClipboardList />,
    schools: <FaSchool />,
    users: <FaUsers />,
    workbooks: <FaBookOpen />
  };

  // Add School
  const handleAddSchool = async () => {
    if (!newSchool.school_name || !newSchool.location || !newSchool.reporting_branch || !newSchool.num_students) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchool),
      });
      const data = await res.json();
      
      if (data.success) {
        setEntries(prev => [...prev, { ...newSchool, id: data.id }]);
        setNewSchool({ school_name: "", location: "", reporting_branch: "", num_students: "" });
        toast.success("School added successfully ✅");
      } else {
        toast.error("Failed to add school");
      }
    } catch (error) {
      console.error("Add school error:", error);
      toast.error("Error adding school");
    }
  };

  // Add User
  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      
      if (data.success) {
        setUsers(prev => [...prev, { ...newUser, id: data.id }]);
        setNewUser({ name: "", email: "", password: "" });
        toast.success("User added successfully ✅");
      } else {
        toast.error(data.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Add user error:", error);
      toast.error("Error adding user");
    }
  };

  // Add Workbook
  const handleAddWorkbook = async () => {
    const { grade, workbook_name, quantity } = newWorkbook;
    if (!grade || !workbook_name || !quantity) {
      toast.error("Please fill all required fields");
      return;
    }

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/workbooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, workbook_name, quantity: qtyNum }),
      });
      const data = await res.json();
      
      if (data.success) {
        setWorkbooks(prev => [...prev, { ...newWorkbook, id: data.id, quantity: qtyNum }]);
        setNewWorkbook({ grade: "", workbook_name: "", quantity: "" });
        toast.success("Workbook added successfully ✅");
      } else {
        toast.error("Failed to add workbook");
      }
    } catch (error) {
      console.error("Add workbook error:", error);
      toast.error("Error adding workbook");
    }
  };

  // Edit School
  const handleEditClick = (row) => {
    setEditingRow(row.id);
    setEditedRow({ ...row });
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditedRow({});
  };

  const handleSaveClick = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/update/${editedRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedRow),
      });
      const data = await res.json();
      
      if (data.success) {
        setEntries(prev => prev.map(e => e.id === editedRow.id ? editedRow : e));
        setEditingRow(null);
        toast.success("School updated successfully ✅");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating school");
    }
  };

  // Delete School
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/delete/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
        toast.success("School deleted successfully ✅");
      } else {
        toast.error("Failed to delete school");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting school");
    }
  };

  // Edit User
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditedUser({ ...user });
  };

  const handleCancelUser = () => {
    setEditingUser(null);
    setEditedUser({});
  };

  const handleSaveUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });
      const data = await res.json();
      
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === id ? editedUser : u));
        setEditingUser(null);
        toast.success("User updated successfully ✅");
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("Error updating user");
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success("User deleted successfully ✅");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Error deleting user");
    }
  };

  // Delete Submission
  const handleDeleteSubmission = async (ids) => {
    if (!ids || ids.length === 0) {
      toast.error("No entries selected");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${ids.length} entr${ids.length > 1 ? "ies" : "y"}?`)) return;

    try {
      const responses = await Promise.allSettled(
        ids.map(id =>
          fetch(`${API_BASE}/admin/form-submissions/${id}`, { method: "DELETE" })
        )
      );

      const deletedIds = [];
      responses.forEach((res, index) => {
        if (res.status === "fulfilled" && res.value.ok) {
          deletedIds.push(ids[index]);
        }
      });

      if (deletedIds.length > 0) {
        setSubmissions(prev => prev.filter(s => !deletedIds.includes(s.id)));
        setSelectedSubs([]);
        toast.success(`Deleted ${deletedIds.length} submission(s) successfully ✅`);
      }

      if (deletedIds.length !== ids.length) {
        toast.error("Some submissions could not be deleted.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete submissions.");
    }
  };

  // Mark as Delivered
  const updateDeliveredStatus = async (markDelivered) => {
    if (selectedSubs.length === 0) {
      toast.error("Select at least one entry");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/mark-delivered`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ids: selectedSubs, 
          delivered: markDelivered ? "Yes" : "No" 
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSubmissions(prev =>
          prev.map(s =>
            selectedSubs.includes(s.id) 
              ? { ...s, delivered: markDelivered ? "Yes" : "No" } 
              : s
          )
        );
        toast.success(markDelivered ? "Marked as Delivered ✅" : "Marked as Undelivered ✅");
        setSelectedSubs([]);
      } else {
        toast.error("Failed to update delivered status");
      }
    } catch (error) {
      console.error("Update delivered status error:", error);
      toast.error("Error updating status");
    }
  };

  // Toggle selection
  const toggleSelect = (row) => {
    setSelectedSubs(prev =>
      prev.includes(row.id)
        ? prev.filter(x => x !== row.id)
        : [...prev, row.id]
    );
  };

  // Download Excel
  const downloadExcel = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${activeTab}-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  // Adjust workbook quantity
  const handleAdjustQuantity = async (id, type) => {
    const adjust = parseInt(adjustValues[id] || 0, 10);
    if (isNaN(adjust) || adjust <= 0) {
      toast.error("Enter a valid positive number");
      return;
    }

    const workbook = workbooks.find(w => w.id === id);
    let newQty = parseInt(workbook.quantity, 10);
    if (type === "add") newQty += adjust;
    if (type === "sub") newQty -= adjust;
    
    if (newQty < 0) {
      toast.error("Quantity cannot be negative.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/workbooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      
      if (res.ok) {
        setWorkbooks(prev => prev.map(w => 
          w.id === id ? { ...w, quantity: newQty } : w
        ));
        setAdjustValues(prev => ({ ...prev, [id]: "" }));
        toast.success("Quantity updated successfully ✅");
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Adjust quantity error:", error);
      toast.error("Error updating quantity");
    }
  };

  // Delete Workbook
  const handleDeleteWorkbook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workbook?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/workbooks/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        setWorkbooks(prev => prev.filter(w => w.id !== id));
        toast.success("Workbook deleted successfully ✅");
      } else {
        toast.error("Failed to delete workbook");
      }
    } catch (error) {
      console.error("Delete workbook error:", error);
      toast.error("Error deleting workbook");
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  // Column definitions
  const schoolColumns = useMemo(() => [
    { 
      name: "#", 
      width: '70px',
      cell: (row, index) => index + 1,
      center: true
    },
    {
      name: "School Name",
      selector: row => row.school_name,
      sortable: true,
      minWidth: '200px',
      cell: row => editingRow === row.id ? (
        <Input
          dark={dark}
          value={editedRow.school_name || ""}
          onChange={(e) => setEditedRow(prev => ({ ...prev, school_name: e.target.value }))}
          style={{ width: '100%' }}
        />
      ) : row.school_name
    },
    {
      name: "Location",
      selector: row => row.location,
      sortable: true,
      width: '150px',
      cell: row => editingRow === row.id ? (
        <Input
          dark={dark}
          value={editedRow.location || ""}
          onChange={(e) => setEditedRow(prev => ({ ...prev, location: e.target.value }))}
          style={{ width: '100%' }}
        />
      ) : row.location
    },
    {
      name: "Reporting Branch",
      selector: row => row.reporting_branch,
      sortable: true,
      width: '180px',
      cell: row => editingRow === row.id ? (
        <Input
          dark={dark}
          value={editedRow.reporting_branch || ""}
          onChange={(e) => setEditedRow(prev => ({ ...prev, reporting_branch: e.target.value }))}
          style={{ width: '100%' }}
        />
      ) : row.reporting_branch
    },
    {
      name: "Students",
      selector: row => row.num_students,
      sortable: true,
      width: '120px',
      center: true,
      cell: row => editingRow === row.id ? (
        <Input
          dark={dark}
          type="number"
          value={editedRow.num_students || ""}
          onChange={(e) => setEditedRow(prev => ({ ...prev, num_students: e.target.value }))}
          style={{ width: '100%' }}
        />
      ) : row.num_students
    },
    {
      name: "Actions",
      width: '180px',
      cell: row => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
          {editingRow === row.id ? (
            <>
              <Button variant="success" onClick={handleSaveClick} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaSave /> Save
              </Button>
              <Button variant="danger" onClick={handleCancelClick} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaTimes /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => handleEditClick(row)} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaEdit /> Edit
              </Button>
              <Button variant="danger" onClick={() => handleDeleteClick(row.id)} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaTrash /> Delete
              </Button>
            </>
          )}
        </div>
      )
    }
  ], [editingRow, editedRow, dark]);

  const userColumns = useMemo(() => [
    { 
      name: "#", 
      width: '70px',
      cell: (row, index) => index + 1,
      center: true
    },
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
      minWidth: '180px',
      cell: row => editingUser === row.id ? (
        <Input
          dark={dark}
          value={editedUser.name || ""}
          onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
          style={{ width: '100%' }}
        />
      ) : row.name
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      minWidth: '250px',
      cell: row => editingUser === row.id ? (
        <Input
          dark={dark}
          type="email"
          value={editedUser.email || ""}
          onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
          style={{ width: '100%' }}
        />
      ) : row.email
    },
    {
      name: "Password",
      selector: row => row.password,
      sortable: true,
      width: '150px',
      cell: row => editingUser === row.id ? (
        <Input
          dark={dark}
          type="text"
          value={editedUser.password || ""}
          onChange={(e) => setEditedUser(prev => ({ ...prev, password: e.target.value }))}
          style={{ width: '100%' }}
        />
      ) : "••••••••"
    },
    {
      name: "Actions",
      width: '180px',
      cell: row => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
          {editingUser === row.id ? (
            <>
              <Button variant="success" onClick={() => handleSaveUser(row.id)} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaSave /> Save
              </Button>
              <Button variant="danger" onClick={handleCancelUser} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaTimes /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => handleEditUser(row)} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaEdit /> Edit
              </Button>
              <Button variant="danger" onClick={() => handleDeleteUser(row.id)} style={{ padding: '8px 12px', minWidth: '70px' }}>
                <FaTrash /> Delete
              </Button>
            </>
          )}
        </div>
      )
    }
  ], [editingUser, editedUser, dark]);

  const submissionColumns = useMemo(() => [
    { 
      name: "#", 
      width: '70px',
      cell: (row, index) => index + 1,
      center: true
    },
    {
      name: "Select",
      width: '80px',
      center: true,
      cell: row => (
        <input
          type="checkbox"
          checked={selectedSubs.includes(row.id)}
          onChange={() => toggleSelect(row)}
          style={{ 
            cursor: 'pointer', 
            transform: 'scale(1.2)',
            accentColor: '#2563EB'
          }}
        />
      )
    },
    {
      name: "School",
      selector: row => row.school_name,
      sortable: true,
      minWidth: '220px',
      wrap: true
    },
    {
      name: "Grade",
      selector: row => row.grade,
      sortable: true,
      width: '90px',
      center: true
    },
    {
      name: "Workbook",
      selector: row => row.workbook,
      sortable: true,
      minWidth: '200px',
      wrap: true
    },
    {
      name: "Qty",
      selector: row => row.count,
      sortable: true,
      width: '90px',
      center: true
    },
    {
      name: "Submitted By",
      selector: row => row.submitted_by,
      sortable: true,
      minWidth: '220px',
      wrap: true
    },
    {
      name: "Date",
      selector: row => new Date(row.submitted_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      sortable: true,
      width: '180px'
    },
    {
      name: "Status",
      selector: row => row.delivered,
      sortable: true,
      width: '120px',
      center: true,
      cell: row => <StatusIndicator dark={dark} status={row.delivered}>{row.delivered}</StatusIndicator>
    }
  ], [selectedSubs, dark]);

  const workbookColumns = useMemo(() => [
      { 
    name: "#", 
    width: '70px',
    cell: (row, index) => index + 1,
    center: true
  },
  {
    name: "Workbook Name",
    selector: row => row.workbook_name,
    sortable: true,
    minWidth: '150px',
    wrap: true
  },

  {
    name: "Current Stock",
    selector: row => row.quantity,
    sortable: true,
    width: '120px',
    center: true,
    cell: row => (
      <span style={{ 
        fontWeight: '700', 
        fontSize: '15px',
        color: row.quantity > 10 ? '#14B8A6' : row.quantity > 0 ? '#F59E0B' : '#EF4444'
      }}>
        {row.quantity}
      </span>
    )
  },
  
  {
    name: "Adjust Stock",
    width: '400px',
    cell: row => (
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'nowrap' }}>
        <div style={{ position: 'relative', width: '160px' }}>
          <Input
            dark={dark}
            type="number"
            min="0"
            placeholder="Enter Quantity"
            value={adjustValues[row.id] || ""}
            onChange={(e) => setAdjustValues(prev => ({ ...prev, [row.id]: e.target.value }))}
            style={{ 
              width: '100%',
              padding: '14px 16px',
              paddingLeft: '56px',
              fontSize: '15px',
              fontWeight: '600',
              color: dark ? '#F8FAFC' : '#0F172A',
              border: dark ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid rgba(148, 163, 184, 0.6)',
              background: dark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: dark ? '#CBD5E1' : '#475569',
            fontSize: '14px',
            fontWeight: '600',
            pointerEvents: 'none'
          }}>
            Qty:
          </div>
        </div>
        <Button 
          variant="success" 
          onClick={() => handleAdjustQuantity(row.id, "add")}
          style={{ 
            padding: '12px 16px',
            fontSize: '14px',
            minWidth: '90px',
            height: '48px'
          }}
        >
          <FaPlus /> Add
        </Button>
        <Button 
          variant="warning" 
          onClick={() => handleAdjustQuantity(row.id, "sub")}
          style={{ 
            padding: '12px 16px',
            fontSize: '14px',
            minWidth: '90px',
            height: '48px'
          }}
        >
          <FaMinus /> Subtract
        </Button>
      </div>
    )
  }
], [adjustValues, dark]);

  // Render Dashboard
  const renderDashboard = () => {
    const Container = dark ? DarkContainer : LightContainer;
    const SidebarStyled = Sidebar;
    const TopBarStyled = TopBar;
    const ContentSectionStyled = ContentSection;
    const StatCardStyled = StatCard;
    const FormSectionStyled = FormSection;
    const FilterBarStyled = FilterBar;
    const ActionBarStyled = ActionBar;
    const DataTableContainerStyled = DataTableContainer;
    const ModernDataTableStyled = ModernDataTable;
    const LoadingContainerStyled = LoadingContainer;
    const EmptyStateStyled = EmptyState;
    const ErrorStateStyled = ErrorState;
    const FooterStyled = Footer;

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
        
        <SidebarStyled dark={dark} className={sidebarOpen ? 'open' : ''}>
          <SidebarHeader dark={dark}>
            <div className="logo">
              <img src="/OMOTEC.png" alt="OMOTEC Logo" />
              
            </div>
            <MobileMenuButton dark={dark} onClick={() => setSidebarOpen(false)}>
              <FaChevronLeft />
            </MobileMenuButton>
          </SidebarHeader>
          
          <SidebarNav>
            {navItems.map((item) => (
              <NavItem 
                key={item.key} 
                active={activeTab === item.key}
                dark={dark}
              >
                <div 
                  className="nav-link"
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </div>
              </NavItem>
            ))}
          </SidebarNav>
          
          <div style={{ padding: '20px', borderTop: `1px solid ${dark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'}` }}>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              style={{ width: '100%' }}
            >
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        </SidebarStyled>
        
        <MainContent>
          <TopBarStyled dark={dark}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <MobileMenuButton dark={dark} onClick={toggleSidebar}>
                <FaBars />
              </MobileMenuButton>
              <PageTitle dark={dark}>
                <h1>
                  {tabIcons[activeTab]}
                  {tabTitles[activeTab]}
                </h1>
                <div className="subtitle">
                  Manage and monitor {activeTab} data efficiently
                </div>
              </PageTitle>
            </div>
            
            <TopBarActions>
              <UserMenu dark={dark}>
                <div className="user-avatar">
                  <FaUserShield />
                </div>
                <div className="user-info">                
                  <div className="user-role">Administrator</div>
                </div>
              </UserMenu>
            </TopBarActions>
          </TopBarStyled>
          
          <StatsGrid>
            <StatCardStyled 
              dark={dark}
              color="linear-gradient(90deg, #2563EB, #3B82F6)"
              bgColor={dark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)'}
              iconColor={dark ? '#60A5FA' : '#2563EB'}
              trend="up"
            >
              <div className="stat-header">
                <div className="stat-icon">
                  <FaClipboardList />
                </div>
                <div className="stat-trend">
                  <FaArrowUp /> Today
                </div>
              </div>
              <div className="stat-value">{stats.totalSubmissions}</div>
              <div className="stat-label">Total Submissions</div>
              <div className="stat-footer">
                <FaRegClock /> {stats.todaySubmissions} today
              </div>
            </StatCardStyled>
            
            <StatCardStyled 
              dark={dark}
              color="linear-gradient(90deg, #7C3AED, #8B5CF6)"
              bgColor={dark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139, 92, 246, 0.1)'}
              iconColor={dark ? '#A78BFA' : '#7C3AED'}
              trend="up"
            >
              <div className="stat-header">
                <div className="stat-icon">
                  <FaSchool />
                </div>
                <div className="stat-trend">
                  <FaArrowUp /> Active
                </div>
              </div>
              <div className="stat-value">{stats.totalSchools}</div>
              <div className="stat-label">Active Schools</div>
              <div className="stat-footer">
                <FaRegCheckCircle /> All operational
              </div>
            </StatCardStyled>
            
            <StatCardStyled 
              dark={dark}
              color="linear-gradient(90deg, #10B981, #34D399)"
              bgColor={dark ? 'rgba(20, 184, 166, 0.1)' : 'rgba(52, 211, 153, 0.1)'}
              iconColor={dark ? '#14B8A6' : '#10B981'}
              trend="up"
            >
              <div className="stat-header">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-trend">
                  <FaArrowUp /> Active
                </div>
              </div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Active Users</div>
              <div className="stat-footer">
                <FaUserCircle /> {stats.activeToday} active today
              </div>
            </StatCardStyled>
            
            <StatCardStyled 
              dark={dark}
              color="linear-gradient(90deg, #F59E0B, #FBBF24)"
              bgColor={dark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(251, 191, 36, 0.1)'}
              iconColor={dark ? '#F59E0B' : '#F59E0B'}
              trend={stats.pendingDeliveries > 0 ? "down" : "up"}
            >
              <div className="stat-header">
                <div className="stat-icon">
                  <FaBookOpen />
                </div>
                <div className="stat-trend">
                  {stats.pendingDeliveries > 0 ? <FaArrowDown /> : <FaArrowUp />}
                  {stats.pendingDeliveries > 0 ? `${stats.pendingDeliveries}` : '0'}
                </div>
              </div>
              <div className="stat-value">{stats.totalWorkbooks}</div>
              <div className="stat-label">Workbooks in Stock</div>
              <div className="stat-footer">
                {stats.pendingDeliveries > 0 ? (
                  <>
                    <FaRegTimesCircle /> {stats.pendingDeliveries} pending
                  </>
                ) : (
                  <>
                    <FaRegCheckCircle /> All fulfilled
                  </>
                )}
              </div>
            </StatCardStyled>
          </StatsGrid>
          
          <ContentSectionStyled dark={dark}>
            <SectionHeader dark={dark}>
              <div className="section-title">
                <div className="section-icon">
                  {tabIcons[activeTab]}
                </div>
                <h2>{tabTitles[activeTab]}</h2>
              </div>
              
              <div className="section-actions">
                {activeTab === "submissions" && (
                  <Button 
                    variant="primary" 
                    onClick={downloadExcel}
                  >
                    <FaDownload /> Export Excel
                  </Button>
                )}
              </div>
            </SectionHeader>
            
            {/* Add Forms for each tab */}
            {(activeTab === "schools" || activeTab === "users" || activeTab === "workbooks") && (
              <FormSectionStyled dark={dark}>
                <FormGrid>
                  {activeTab === "schools" && (
                    <>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaSchool /></InputIcon>
                        <Input
                          dark={dark}
                          placeholder="School Name"
                          value={newSchool.school_name}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, school_name: e.target.value }))}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaMapMarkerAlt /></InputIcon>
                        <Input
                          dark={dark}
                          placeholder="Location"
                          value={newSchool.location}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaBuilding /></InputIcon>
                        <Input
                          dark={dark}
                          placeholder="Reporting Branch"
                          value={newSchool.reporting_branch}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, reporting_branch: e.target.value }))}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaUsers /></InputIcon>
                        <Input
                          dark={dark}
                          type="number"
                          placeholder="Number of Students"
                          value={newSchool.num_students}
                          onChange={(e) => setNewSchool(prev => ({ ...prev, num_students: e.target.value }))}
                        />
                      </InputWrapper>
                      <Button 
                        variant="success" 
                        onClick={handleAddSchool}
                        style={{ gridColumn: '1 / -1', padding: '16px 28px' }}
                      >
                        <FaPlus /> Add School
                      </Button>
                    </>
                  )}
                  
                  {activeTab === "users" && (
                    <>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaUserCircle /></InputIcon>
                        <Input
                          dark={dark}
                          placeholder="Full Name"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaEnvelope /></InputIcon>
                        <Input
                          dark={dark}
                          type="email"
                          placeholder="Email Address"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaLock /></InputIcon>
                        <Input
                          dark={dark}
                          type="text"
                          placeholder="Password"
                          value={newUser.password}
                          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                        />
                      </InputWrapper>
                      <Button 
                        variant="success" 
                        onClick={handleAddUser}
                        style={{ gridColumn: '1 / -1', padding: '16px 28px' }}
                      >
                        <FaPlus /> Add User
                      </Button>
                    </>
                  )}
                  
                  {activeTab === "workbooks" && (
                    <>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaGraduationCap /></InputIcon>
                        <Input
                          dark={dark}
                          placeholder="Grade"
                          value={newWorkbook.grade}
                          onChange={(e) => setNewWorkbook(prev => ({ ...prev, grade: e.target.value }))}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaBook /></InputIcon>
                        <Input
                          dark={dark}
                          placeholder="Workbook Name"
                          value={newWorkbook.workbook_name}
                          onChange={(e) => setNewWorkbook(prev => ({ ...prev, workbook_name: e.target.value }))}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <InputIcon dark={dark}><FaHashtag /></InputIcon>
                        <Input
                          dark={dark}
                          type="number"
                          placeholder="Initial Quantity"
                          value={newWorkbook.quantity}
                          onChange={(e) => setNewWorkbook(prev => ({ ...prev, quantity: e.target.value }))}
                        />
                      </InputWrapper>
                      <Button 
                        variant="success" 
                        onClick={handleAddWorkbook}
                        style={{ gridColumn: '1 / -1', padding: '16px 28px' }}
                      >
                        <FaPlus /> Add Workbook
                      </Button>
                    </>
                  )}
                </FormGrid>
              </FormSectionStyled>
            )}
            
            {/* Bulk Actions for Submissions */}
            {activeTab === "submissions" && (
              <ActionBarStyled dark={dark}>
                <div className="action-group">
                  <InputWrapper style={{ width: '180px' }}>
                    <InputIcon dark={dark}><FaCalendarAlt /></InputIcon>
                    <Input
                      dark={dark}
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </InputWrapper>
                  <InputWrapper style={{ width: '180px' }}>
                    <InputIcon dark={dark}><FaCalendarAlt /></InputIcon>
                    <Input
                      dark={dark}
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </InputWrapper>
                </div>
                <div className="action-group">
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteSubmission(selectedSubs)}
                    disabled={selectedSubs.length === 0}
                  >
                    <FaTrash /> Delete ({selectedSubs.length})
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={() => updateDeliveredStatus(true)}
                    disabled={selectedSubs.length === 0}
                  >
                    <FaCheck /> Mark Delivered
                  </Button>
                  <Button 
                    variant="warning" 
                    onClick={() => updateDeliveredStatus(false)}
                    disabled={selectedSubs.length === 0}
                  >
                    <FaTimes /> Mark Undelivered
                  </Button>
                </div>
              </ActionBarStyled>
            )}
            
            {/* Filter Bar */}
            <FilterBarStyled dark={dark}>
              <div className="search-container">
                <FaSearch className="search-icon" />
                <Input
                  dark={dark}
                  placeholder={`Search ${activeTab}...`}
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              {activeTab !== "submissions" && (
                <Button 
                  dark={dark}
                  onClick={downloadExcel}
                >
                  <FaDownload /> Export Excel
                </Button>
              )}
            </FilterBarStyled>
            
            {/* Data Table */}
            <DataTableContainerStyled dark={dark}>
              {(() => {
                const isLoading = 
                  (activeTab === "schools" && loadingSchools) ||
                  (activeTab === "users" && loadingUsers) ||
                  (activeTab === "submissions" && loadingSubmissions) ||
                  (activeTab === "workbooks" && loadingWorkbooks);
                
                const error = 
                  (activeTab === "schools" && errorSchools) ||
                  (activeTab === "users" && errorUsers) ||
                  (activeTab === "submissions" && errorSubmissions) ||
                  (activeTab === "workbooks" && errorWorkbooks);
                
                const dataEmpty = filteredData.length === 0;
                
                if (isLoading) {
                  return (
                    <LoadingContainerStyled dark={dark}>
                      <div className="loading-spinner"></div>
                      <div className="loading-text">Loading {activeTab}...</div>
                    </LoadingContainerStyled>
                  );
                }
                
                if (error) {
                  return (
                    <ErrorStateStyled dark={dark}>
                      <div className="error-icon">
                        <FaTimesCircle />
                      </div>
                      <div className="error-title">Error Loading Data</div>
                      <div className="error-description">{error}</div>
                      <Button 
                        variant="primary" 
                        onClick={() => window.location.reload()}
                      >
                        <FaSync /> Retry
                      </Button>
                    </ErrorStateStyled>
                  );
                }
                
                if (dataEmpty) {
                  return (
                    <EmptyStateStyled dark={dark}>
                      <div className="empty-icon">
                        {tabIcons[activeTab]}
                      </div>
                      <div className="empty-title">No {activeTab} found</div>
                      <div className="empty-description">
                        {filterText 
                          ? "No matching records found. Try a different search term."
                          : activeTab === "schools" ? "Add your first school to get started."
                          : activeTab === "users" ? "Add your first user to get started."
                          : activeTab === "submissions" ? "No submissions have been made yet."
                          : "Add your first workbook to get started."
                        }
                      </div>
                      {(activeTab === "schools" || activeTab === "users" || activeTab === "workbooks") && (
                        <Button variant="primary">
                          <FaPlus /> Add Your First {activeTab === "schools" ? "School" : activeTab === "users" ? "User" : "Workbook"}
                        </Button>
                      )}
                    </EmptyStateStyled>
                  );
                }
                
                const columns = 
                  activeTab === "schools" ? schoolColumns :
                  activeTab === "users" ? userColumns :
                  activeTab === "submissions" ? submissionColumns :
                  workbookColumns;
                
                return (
                  <ModernDataTableStyled
                    dark={dark}
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    responsive
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    selectableRows={false}
                    theme={dark ? "dark" : "default"}
                    customStyles={{
                      headCells: {
                        style: {
                          backgroundColor: dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                          fontSize: '13px',
                          fontWeight: '600',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                        },
                      },
                      cells: {
                        style: {
                          backgroundColor: dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                          fontSize: '14px',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                        },
                      },
                      rows: {
                        style: {
                          backgroundColor: dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                          '&:hover': {
                            backgroundColor: dark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
                          },
                        },
                      },
                    }}
                  />
                );
              })()}
            </DataTableContainerStyled>
          </ContentSectionStyled>
          
          <FooterStyled dark={dark}>
            <p>© {new Date().getFullYear()} OMOTEC School Operations System</p>
            <p>Administrator Dashboard • Version 2.0.1 • Logged in as: {adminEmail}</p>
            <p>Last Updated: {new Date().toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </FooterStyled>
        </MainContent>
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
      {renderDashboard()}
    </>
  );
};

export default AdminDashboard;