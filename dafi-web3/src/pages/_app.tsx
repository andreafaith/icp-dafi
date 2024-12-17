import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import { Web3Provider } from '../contexts/Web3Context';
import { AuthProvider } from '../contexts/AuthContext';
import theme from '../theme';
import '../styles/globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ 
  Component, 
  pageProps, 
  emotionCache = clientSideEmotionCache 
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>DAFI - Decentralized Agricultural Finance Initiative</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Web3Provider>
            <Component {...pageProps} />
          </Web3Provider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
