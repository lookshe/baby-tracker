import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import HookedRouter from './components/HookedRouter';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import NursingPage from './pages/NursingPage';
import DiaperPage from './pages/DiaperPage';
import SleepPage from './pages/SleepPage';
import FoodPage from './pages/FoodPage';
import HomePage from './pages/HomePage';
import SocketProvider from './components/SocketProvider';
import useLocalStorage from './hooks/useLocalStorage';
import useSocket from './hooks/useSocket';
import theme from './theme';
import GlobalStyle from './GlobalStyle';
import Footer from './components/Footer';

import dashboardIcon from './icons/dashboard.svg';
import nursingIcon from './icons/nursing.svg';
import diaperIcon from './icons/diaper.svg';
import sleepIcon from './icons/sleep.svg';
import foodIcon from './icons/food.svg';

const links = [
  {
    name: 'Dashboard',
    url: '/',
    icon: dashboardIcon
  },
  {
    name: 'Stillen',
    url: '/nursing',
    icon: nursingIcon
  },
  {
    name: 'Windel',
    url: '/diaper',
    icon: diaperIcon
  },
  {
    name: 'Schlaf',
    url: '/sleep',
    icon: sleepIcon
  },
  {
    name: 'Essen',
    url: '/food',
    icon: foodIcon
  }
];

function BabyJoin() {
  const [baby] = useLocalStorage('baby', null);
  const socket = useSocket();
  socket.on('reconnect', () => {
    if (baby !== null) {
      socket.emit('baby/join', baby.shortId, d => {});
    }
  });
  useEffect(() => {
    if (baby !== null) {
      socket.emit('baby/join', baby.shortId, d => {});
    }
  }, [baby, socket]);

  return null;
}

const Root = styled.div`
  position: absolute;
  top: 80px;
  bottom: 30px;
  left: 0;
  right: 0;
  overflow-y: auto;
`;

const Main = styled.main`
  display: block;
  padding: 12px 24px;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
`;

function App() {
  const [baby] = useLocalStorage('baby', null);
  return (
    <ThemeProvider theme={theme}>
      <HookedRouter>
        <GlobalStyle />
        <Root>
          <SocketProvider url={process.env.REACT_APP_SERVER}>
            {baby !== null ? (
              <>
                <BabyJoin />
                <Main>
                  <Navigation links={links} />
                  <Switch>
                    <Route exact path="/" component={DashboardPage} />
                    <Route exact path="/nursing" component={NursingPage} />
                    <Route exact path="/diaper" component={DiaperPage} />
                    <Route exact path="/sleep" component={SleepPage} />
                    <Route exact path="/food" component={FoodPage} />
                  </Switch>
                </Main>
              </>
            ) : (
              <HomePage />
            )}
            <Footer />
          </SocketProvider>
        </Root>
      </HookedRouter>
    </ThemeProvider>
  );
}

export default App;
