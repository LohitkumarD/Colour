import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ColorWheelPage = lazy(() => import('@/pages/ColorWheelPage'));
const ConverterPage = lazy(() => import('@/pages/ConverterPage'));
const HarmonyPage = lazy(() => import('@/pages/HarmonyPage'));
const TonesPage = lazy(() => import('@/pages/TonesPage'));
const GradientsPage = lazy(() => import('@/pages/GradientsPage'));
const MixerPage = lazy(() => import('@/pages/MixerPage'));
const ExtractPage = lazy(() => import('@/pages/ExtractPage'));
const ContrastPage = lazy(() => import('@/pages/ContrastPage'));
const BlindnessPage = lazy(() => import('@/pages/BlindnessPage'));
const PalettesPage = lazy(() => import('@/pages/PalettesPage'));
const AssistantPage = lazy(() => import('@/pages/AssistantPage'));
const LearnPage = lazy(() => import('@/pages/LearnPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'wheel', element: <ColorWheelPage /> },
      { path: 'converter', element: <ConverterPage /> },
      { path: 'harmony', element: <HarmonyPage /> },
      { path: 'tones', element: <TonesPage /> },
      { path: 'gradients', element: <GradientsPage /> },
      { path: 'mixer', element: <MixerPage /> },
      { path: 'extract', element: <ExtractPage /> },
      { path: 'contrast', element: <ContrastPage /> },
      { path: 'blindness', element: <BlindnessPage /> },
      { path: 'palettes', element: <PalettesPage /> },
      { path: 'assistant', element: <AssistantPage /> },
      { path: 'learn', element: <LearnPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
