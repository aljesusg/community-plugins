import { createBackend } from '@backstage/backend-defaults';
import { kialiPlugin } from './plugin';

const backend = createBackend();

backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(kialiPlugin);

backend.start();
