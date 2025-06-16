import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from './components/shared/ui-components/provider';
import { AuthProvider } from './context/AuthContext';
import veevaTheme from './utils/VeevaTheme';

const index = (
    <Provider theme={veevaTheme}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Provider>
);

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(index);
