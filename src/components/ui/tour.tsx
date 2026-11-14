import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function startDemoTour() {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    popoverClass: 'driverjs-theme-dark',
    steps: [
      {
        element: '#tour-brand',
        popover: {
          title: 'Welcome to NovaSMM Demo',
          description:
            'A fully interactive SMM storefront simulation built with React 19, Tailwind CSS 4, and typed mock services.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-balance',
        popover: {
          title: 'Pre-Funded Demo Balance ($87.00)',
          description:
            'The demo customer account starts with exactly $87.00 stored as integer minor units in Dexie & persistent storage.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '#tour-categories',
        popover: {
          title: 'Client Service Categories',
          description:
            'Explore simulated Telegram Stars, Premium gifts, disposable virtual numbers with SMS OTPs, and social growth packages.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '#tour-payment',
        popover: {
          title: 'Pay by Visa or Mastercard Simulation',
          description:
            'Clicking the payment selector demonstrates the client-mandated "Pay by Visa or Mastercard" presentation without any real card collection.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  });

  driverObj.drive();
}
