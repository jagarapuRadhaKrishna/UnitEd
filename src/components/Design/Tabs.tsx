import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabList = styled.div<{ variant: string }>`
  display: flex;
  gap: 2px;
  ${props => props.variant === 'pills' && `
    background-color: #f7fafc;
    padding: 4px;
    border-radius: 8px;
  `}
  ${props => props.variant === 'underline' && `
    border-bottom: 2px solid #e2e8f0;
  `}
`;

const TabButton = styled.button<{ isActive: boolean; variant: string }>`
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.isActive ? '#3182ce' : '#4a5568'};
  transition: all 0.2s;

  ${props => {
    switch (props.variant) {
      case 'pills':
        return `
          border-radius: 6px;
          background-color: ${props.isActive ? 'white' : 'transparent'};
          box-shadow: ${props.isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
        `;
      case 'underline':
        return `
          border-bottom: 2px solid ${props.isActive ? '#3182ce' : 'transparent'};
          margin-bottom: -2px;
        `;
      default:
        return `
          border-radius: 4px;
          &:hover {
            background-color: ${props.isActive ? '#ebf8ff' : '#f7fafc'};
          }
        `;
    }
  }}

  &:hover {
    color: #3182ce;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const TabPanel = styled(motion.div)`
  padding: 16px 0;
`;

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'default'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <TabsContainer>
      <TabList variant={variant}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={variant}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
      <TabPanel
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {tabs.find(tab => tab.id === activeTab)?.content}
      </TabPanel>
    </TabsContainer>
  );
};

export default Tabs;