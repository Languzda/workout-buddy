import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './pages/App.tsx';
import { TrainingProvider } from './context/TrainingProvider.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import SingleTraining, {
  SingleTrainingLoader,
} from '@/pages/trainings/singleTraining/SingleTraining.tsx';
import Trainings from '@/pages/trainings/Trainings.tsx';

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
            { index: true, Component: Trainings },
            {
              path: ':id',
              loader: SingleTrainingLoader,
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

async function loggingMiddleware({ request }: { request: Request }, next) {
  const url = new URL(request.url);
  console.log(`Starting navigation: ${url.pathname}${url.search}`);
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`Navigation completed in ${duration}ms`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TrainingProvider>
      <RouterProvider router={router} />
    </TrainingProvider>
  </StrictMode>,
);
