import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from '@/components/theme';
import { KeyboardShortcutsProvider } from '@/components/keyboard-shortcuts';
import { MathJaxConfig } from '@/components/latex';

import Home from '@/screens/home';

import '@/index.css';

const paths = [
    {
        path: '/',
        element: (
          <Home/>
        ),
    },
];

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
    return (
    <ThemeProvider>
      <KeyboardShortcutsProvider>
        <MantineProvider>
          <MathJaxConfig />
          <RouterProvider router={BrowserRouter}/>
        </MantineProvider>
      </KeyboardShortcutsProvider>
    </ThemeProvider>
    )
};

export default App;
