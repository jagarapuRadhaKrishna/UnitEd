import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import AuthenticatedNavbar from './AuthenticatedNavbar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FFFFFF;
`;

const Main = styled.main`
  flex: 1;
  padding-top: 64px;
  
  @media (min-width: 768px) {
    padding-top: 64px;
  }

  @media (min-width: 1024px) {
    padding-top: 64px;
  }
`;

const MainLayout: React.FC = () => {
  return (
    <LayoutContainer>
      <AuthenticatedNavbar />
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};

export default MainLayout;