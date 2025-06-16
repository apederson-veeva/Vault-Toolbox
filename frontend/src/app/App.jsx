import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import { SettingsProvider } from './context/SettingsContext';
import ComponentEditorPage from './pages/ComponentEditorPage';
import FileStagingBrowserPage from './pages/FileStagingBrowserPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import DataToolsPage from './pages/DataToolsPage';
import VaultInfoPage from './pages/VaultInfoPage';
import VqlEditorPage from './pages/VqlEditorPage';
import ProtectedRoutes from './utils/ProtectedRoute';

function App() {
    return (
        <SettingsProvider>
            <HashRouter>
                <Routes>
                    <Route element={<ProtectedRoutes />}>
                        <Route element={<Layout />}>
                            <Route path='/' element={<VaultInfoPage />} />
                            <Route path='component-editor' element={<ComponentEditorPage />} />
                            <Route path='vql-editor' element={<VqlEditorPage />} />
                            <Route path='data-tools' element={<DataToolsPage />} />
                            <Route path='file-staging-browser' element={<FileStagingBrowserPage />} />
                            <Route path='settings' element={<SettingsPage />} />
                        </Route>
                    </Route>
                    <Route path='/login' element={<LoginPage />} />
                </Routes>
            </HashRouter>
        </SettingsProvider>
    );
}

export default App;
