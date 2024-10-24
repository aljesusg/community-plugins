// Authentication

import { authenticationConfig } from './AuthenticationConfig';

// Icons
import { icons } from './Icons';

// Logos
import kialiLogoLight from '../assets/img/logo-lightbkg.svg';
import kialiLogoDark from '../assets/img/logo-darkbkg.svg';
import kialiIconLight from '../assets/img/icon-lightbkg.svg';
import kialiIconDark from '../assets/img/icon-darkbkg.svg';

// Paths
import { Paths } from './Paths';

// Jaeger Query
import { jaegerQuery } from './JaegerQuery';

// ServerConfig
export * from './ServerConfig';
export { parseHealthConfig } from './HealthConfig';
export {
  authenticationConfig,
  Paths,
  icons,
  kialiLogoLight,
  kialiLogoDark,
  kialiIconLight,
  kialiIconDark,
  jaegerQuery
};
