import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './pages/App.tsx';
import { initializeDataMigration } from './utils/dataMigration';

// Initialize data migration on app startup
initializeDataMigration();
import { createBrowserRouter, RouterProvider } from 'react-router';
import SingleTraining from '@/pages/trainings/singleTraining/SingleTraining.tsx';
import Trainings from '@/pages/trainings/Trainings.tsx';
import Layout from '@/components/Layout.tsx';
import {
  trainingsLoader,
  singleTrainingLoader,
} from '@/loaders/trainingLoaders.ts';

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Layout,
      unstable_middleware: [loggingMiddleware],
      children: [
        {
          index: true,
          Component: App,
        },
        {
          path: 'trainings',
          children: [
            {
              index: true,
              Component: Trainings,
              loader: trainingsLoader,
            },
            {
              path: ':id',
              loader: singleTrainingLoader,
              Component: SingleTraining,
            },
          ],
        },
      ],
    },
  ],
  {
    future: { unstable_middleware: true },
  },
);

/**
 * Middleware for logging navigation in React Router
 * Measures navigation duration and logs path information
 * @param request - Request object from React Router
 * @param next - Function to execute next middleware/loader
 */
async function loggingMiddleware(
  { request }: { request: Request },
  next: () => Promise<unknown>,
) {
  const url = new URL(request.url);
  console.log(`Starting navigation: ${url.pathname}${url.search}`);
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`Navigation completed in ${duration}ms`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
