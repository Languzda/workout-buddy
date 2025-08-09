import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './pages/App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import SingleTraining from '@/pages/trainings/singleTraining/SingleTraining.tsx';
import Trainings from '@/pages/trainings/Trainings.tsx';
import {
  trainingsLoader,
  singleTrainingLoader,
} from '@/loaders/trainingLoaders.ts';

const router = createBrowserRouter(
  [
    {
      path: '/',
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
