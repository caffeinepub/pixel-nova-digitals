import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import TextToImage from './pages/TextToImage';
import TextToVideo from './pages/TextToVideo';
import TextToVoiceover from './pages/TextToVoiceover';
import MyHistory from './pages/MyHistory';
import AdminHomeEditor from './pages/AdminHomeEditor';
import ProfileSetupDialog from './components/ProfileSetupDialog';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ProfileSetupDialog />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const textToImageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/text-to-image',
  component: TextToImage,
});

const textToVideoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/text-to-video',
  component: TextToVideo,
});

const textToVoiceoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/text-to-voiceover',
  component: TextToVoiceover,
});

const myHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-history',
  component: MyHistory,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminHomeEditor,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  textToImageRoute,
  textToVideoRoute,
  textToVoiceoverRoute,
  myHistoryRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
