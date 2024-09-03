# Kiali Development


# Backstage Setup with Kiali

First we need to make the setup of [backstage](https://github.com/backstage/backstage/)

Follow the [Get Started](https://backstage.io/docs/getting-started/) documentation.

You can execute these commands

```bash
# Create the environment for the project
PROJECT_BS_DIR=backstage
mkdir $PROJECT_BS_DIR
cd $PROJECT_BS_DIR
BS_PATH=$(pwd)
# Clone backstage repo
git clone https://github.com/backstage/backstage.git
# Create the backstage app with latest release
npx @backstage/create-app@latest
cd backstage
# Add the kiali plugin
yarn --cwd packages/app add @backstage-community/plugin-kiali@link:$BS_PATH/community-plugins/workspaces/kiali/plugins/kiali
yarn --cwd packages/backend add @backstage-community/plugin-kiali-backend@link:$BS_PATH/community-plugins/workspaces/kiali/plugins/kiali-backend
```

## Kiali Setup

### App

### Backend
Update `packages/backend/src/index` with the following

```ts
const backend = createBackend();

// ...

backend.add(import('@backstage-community/plugin-kiali-backend'));

// ...

backend.start();
```