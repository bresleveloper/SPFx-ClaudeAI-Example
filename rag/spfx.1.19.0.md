# SharePoint Framework (SPFx) 1.19.0 - Complete Developer Reference

## Table of Contents
1. [Overview](#overview)
2. [SPFx 1.19.0 Release Details](#spfx-1190-release-details)
3. [Environment Setup](#environment-setup)
4. [Compatibility Matrix](#compatibility-matrix)
5. [Architecture & Core Concepts](#architecture--core-concepts)
6. [Component Types](#component-types)
7. [Project Structure](#project-structure)
8. [Configuration Files](#configuration-files)
9. [Development Workflow](#development-workflow)
10. [APIs & SDK Reference](#apis--sdk-reference)
11. [React Development](#react-development)
12. [Property Pane Development](#property-pane-development)
13. [Styling & Theming](#styling--theming)
14. [Localization](#localization)
15. [Testing](#testing)
16. [Build & Deployment](#build--deployment)
17. [Performance Optimization](#performance-optimization)
18. [Security](#security)
19. [Teams Integration](#teams-integration)
20. [Troubleshooting](#troubleshooting)
21. [Code Examples](#code-examples)

---

## Overview

### What is SharePoint Framework (SPFx)?

SharePoint Framework (SPFx) is a page and web part model that provides full support for client-side SharePoint development with capabilities to extend Microsoft 365 platforms.

**Key Characteristics:**
- **Client-side JavaScript development** - Runs directly in browser context
- **Framework-agnostic** - Supports React, Angular, Vue.js, or no framework
- **No iFrame isolation** - Components run in the same DOM as the page
- **Automatic single sign-on** - Seamless authentication
- **Automatic hosting** - Solutions hosted in SharePoint infrastructure
- **Responsive and accessible** - Built-in support for modern web standards

**Supported Platforms:**
- SharePoint Online
- SharePoint Server 2016+
- Microsoft Teams
- Microsoft Viva Connections
- Outlook
- Office 365 applications

**Development Toolchain:**
- Node.js
- npm
- TypeScript
- Webpack 5 (as of v1.19)
- Gulp
- Yeoman

**Key Advantages:**
- Write once, deploy across multiple Microsoft 365 platforms
- Seamless integration with Microsoft Graph
- No additional operational costs
- Tenant administrator control over solutions
- Modern web development approach

---

## SPFx 1.19.0 Release Details

**Release Date:** April 30, 2024

**Installation:**
```bash
npm install @microsoft/generator-sharepoint@1.19.0 --global
```

Or for latest:
```bash
npm install @microsoft/generator-sharepoint@latest --global
```

### Major New Features

#### 1. Webpack 5 Upgrade
- **Upgraded from Webpack 4 to Webpack 5**
- Breaking change: Custom webpack configurations require migration
- Refer to official Webpack documentation for migration details
- Improved build performance and modern JavaScript support

#### 2. Data Visualization Card View for Adaptive Card Extensions
- New chart-based card view for Viva Connections
- Supports line, bar, pie, and donut charts
- Enables graphical dashboards directly in Viva Connections
- Ideal for business metrics visualization

#### 3. Decoupled Build Time Packages
- Build packages now release independently from SPFx releases
- Enables faster feature and fix releases
- Includes packages like:
  - `@microsoft/eslint-plugin-spfx`
  - `@microsoft/sp-module-interfaces`
  - Other build-time dependencies

### Property Pane Enhancements

New accessibility and functionality improvements:
- **PropertyPaneCheckbox:** Now supports `ariaLabel` property
- **PropertyPaneChoiceGroup:** Can specify `imageAlt` property for options
- **PropertyPaneDropdown:** Now supports `ariaDescription` property
- **PropertyPaneIconPicker & PropertyPaneThumbnailPicker:** Support `disabled` property
- **PropertyPaneToggle:** New `inlineLabel` property for inline label positioning
- **Search ACE:** Can skip footer for Search adaptive card extension

### Breaking Changes

**Node.js v16 No Longer Supported**
- SPFx 1.19 and forward require **Node.js v18**
- Projects must upgrade to Node.js v18 LTS

### Upgrade Process

```bash
# Uninstall previous version
npm uninstall @microsoft/generator-sharepoint --global

# Install v1.19
npm install @microsoft/generator-sharepoint@1.19.0 --global

# Verify installation
npm list --global --depth=0
```

**Recommended Tool:**
Use [CLI for Microsoft 365](https://aka.ms/o365cli) for step-by-step upgrade guidance.

---

## Environment Setup

### System Requirements

**Operating Systems:**
- Windows
- macOS
- Linux

**Required Software:**
- **Node.js:** LTS v18 (required for SPFx 1.19.0)
- **Modern Web Browser:** Microsoft Edge, Chrome, or Firefox
- **Code Editor:** Visual Studio Code (recommended), WebStorm, or any editor supporting client-side development

### Global Package Installation

```bash
# Install required global packages
npm install gulp-cli yo @microsoft/generator-sharepoint@1.19.0 --global
```

**Key Tools:**
- **Gulp:** JavaScript task runner for build automation
- **Yeoman (yo):** Scaffolding tool for project generation
- **SharePoint Yeoman Generator:** SPFx project creation

### Optional but Recommended Tools

- **Git:** Version control
- **Fiddler:** Network traffic debugging
- **Postman:** API testing
- **Windows Terminal:** Enhanced terminal experience
- **Teams Toolkit VS Code extension:** Teams integration development

### Development Certificate Trust

For local HTTPS development:
```bash
gulp trust-dev-cert
```

### Environment Variables

**Optional:** Set tenant domain for serve configurations:
```bash
# Windows
set SPFX_SERVE_TENANT_DOMAIN=contoso.sharepoint.com

# macOS/Linux
export SPFX_SERVE_TENANT_DOMAIN=contoso.sharepoint.com
```

### Verification

```bash
# Verify Node.js version
node --version
# Should output: v18.x.x

# Verify global packages
npm list --global --depth=0

# Create test project
yo @microsoft/sharepoint
```

---

## Compatibility Matrix

### SPFx 1.19.0 Exact Versions

| Dependency | Version(s) |
|------------|-----------|
| **Node.js (LTS)** | v18 |
| **TypeScript** | v4.5, v4.7 |
| **React** | v17.0.1 |
| **Webpack** | v5 |

### SPFx Runtime Dependencies (v1.19.0)

```json
{
  "@microsoft/sp-core-library": "1.19.0",
  "@microsoft/sp-lodash-subset": "1.19.0",
  "@microsoft/sp-office-ui-fabric-core": "1.19.0",
  "@microsoft/sp-webpart-base": "1.19.0",
  "@microsoft/sp-property-pane": "1.19.0",
  "@microsoft/sp-adaptive-card-extension-base": "1.19.0"
}
```

### Build Time Dependencies (v1.20.x)

**Note:** Build packages are decoupled from SPFx version starting with 1.19.

```json
{
  "@microsoft/sp-build-web": "1.20.2",
  "@microsoft/sp-module-interfaces": "1.20.2",
  "@microsoft/eslint-plugin-spfx": "1.20.2",
  "@microsoft/eslint-config-spfx": "1.20.2",
  "@rushstack/eslint-config": "4.0.1",
  "eslint": "8.57.0"
}
```

### TypeScript Experimental Support

While Microsoft hasn't officially confirmed support, TypeScript v5.3 appears to work with SPFx v1.19 in testing (considered experimental).

---

## Architecture & Core Concepts

### Client-Side Development Model

SPFx solutions are **purely client-side**:
- Execute in the browser context
- No server-side code execution
- All business logic runs in JavaScript/TypeScript
- Direct access to SharePoint and Microsoft Graph APIs

### Component Lifecycle

All SPFx components follow a consistent lifecycle:

1. **Initialization** (`onInit()`)
   - Called once when component loads
   - Ideal for service initialization
   - Promise-based (can be async)

2. **Rendering** (`render()`)
   - Called to render component UI
   - Required implementation for web parts
   - Can be called multiple times

3. **Property Changes** (`onPropertyPaneFieldChanged()`)
   - Called when property pane values change
   - Allows custom validation and logic

4. **Disposal** (`onDispose()`)
   - Called when component is removed
   - Clean up resources, event listeners, DOM elements

5. **Theme Changes** (`onThemeChanged()`)
   - Called when SharePoint theme changes
   - Update component styling accordingly

### Service Scopes

SPFx uses a hierarchical service scope pattern:
- **Root Service Scope:** Application-level services
- **Child Service Scope:** Created for each component
- Enables dependency injection and isolation

**Example:**
```typescript
import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';

export class MyService {
  public static readonly serviceKey: ServiceKey<MyService> =
    ServiceKey.create<MyService>('my-app:MyService', MyService);

  constructor(serviceScope: ServiceScope) {
    // Initialize service
  }
}
```

### Context Object

Every component receives a `context` object providing:
- **pageContext:** Page and site information
- **spHttpClient:** SharePoint REST API client
- **msGraphClientFactory:** Microsoft Graph client factory
- **aadHttpClientFactory:** Azure AD secured API client factory
- **serviceScope:** Service scope for dependency injection
- **dynamicDataProvider:** Dynamic data sharing
- **sdks:** Integration SDKs (Teams, etc.)

---

## Component Types

SPFx 1.19.0 supports **four main component types**:

### 1. Web Parts

**Purpose:** Reusable UI components for SharePoint pages

**Characteristics:**
- Displayed on SharePoint modern pages
- Configurable via property pane
- Can be added multiple times to a page
- Support both classic and modern pages

**Base Class:** `BaseClientSideWebPart<TProperties>`

**Basic Structure:**
```typescript
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `<div>Hello World</div>`;
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Settings' },
          groups: [
            {
              groupName: 'Basic',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
```

**Supported Hosts:**
- SharePoint pages
- Microsoft Teams tabs
- Viva Connections
- Outlook (select scenarios)

### 2. Extensions

**Purpose:** Extend SharePoint UI and functionality

#### 2.1 Application Customizer

**Purpose:** Add scripts and customize page placeholders

**Base Class:** `BaseApplicationCustomizer<TProperties>`

**Capabilities:**
- Access to top and bottom placeholders
- Execute code on page load
- Modify page-level UI elements

**Example:**
```typescript
import { BaseApplicationCustomizer, PlaceholderContent } from '@microsoft/sp-application-base';

export default class HelloWorldApplicationCustomizer
  extends BaseApplicationCustomizer<IHelloWorldApplicationCustomizerProperties> {

  public onInit(): Promise<void> {
    const topPlaceholder: PlaceholderContent =
      this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

    if (topPlaceholder) {
      topPlaceholder.domElement.innerHTML = `<div>Header Content</div>`;
    }

    return Promise.resolve();
  }
}
```

#### 2.2 Field Customizer

**Purpose:** Customize field rendering in list views

**Base Class:** `BaseFieldCustomizer<TProperties>`

**Capabilities:**
- Custom rendering for list columns
- Enhanced field visualization
- Interactive field displays

**Example:**
```typescript
import { BaseFieldCustomizer } from '@microsoft/sp-listview-extensibility';

export default class ColorFieldCustomizer
  extends BaseFieldCustomizer<IColorFieldCustomizerProperties> {

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    event.domElement.innerHTML = `
      <div style="background-color: ${event.fieldValue}; padding: 5px;">
        ${event.fieldValue}
      </div>
    `;
  }
}
```

#### 2.3 ListView Command Set

**Purpose:** Add custom commands to list toolbars and context menus

**Base Class:** `BaseListViewCommandSet<TProperties>`

**Capabilities:**
- Custom toolbar buttons
- Context menu items
- Batch operations on list items

**Example:**
```typescript
import { BaseListViewCommandSet } from '@microsoft/sp-listview-extensibility';

export default class HelloWorldCommandSet
  extends BaseListViewCommandSet<IHelloWorldCommandSetProperties> {

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        alert(`Selected items: ${event.selectedRows.length}`);
        break;
    }
  }
}
```

### 3. Adaptive Card Extensions (ACEs)

**Purpose:** Cards for Viva Connections and SharePoint dashboards

**New in 1.19.0:** Data Visualization Card View

**Base Class:** `BaseAdaptiveCardExtension<TProperties, TState>`

**Card Templates:**
- **Primary Text Card:** Simple text display
- **Image Card:** Image with text
- **Search Card:** Search functionality
- **Data Visualization Card (NEW in 1.19):** Charts and graphs

**Chart Types (v1.19):**
- Line charts
- Bar charts
- Pie charts
- Donut charts

**Example (Data Visualization):**
```typescript
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { LineChartCardView } from '@microsoft/sp-adaptive-card-extension-base';

export default class DataVisualizationAce
  extends BaseAdaptiveCardExtension<IDataVisualizationAceProps, IDataVisualizationAceState> {

  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    return LineChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'line',
        series: [{
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 25 },
            { x: 2, y: 15 }
          ],
          lastDataPointLabel: '15'
        }]
      }
    });
  }
}
```

### 4. Library Components

**Purpose:** Share code across multiple SPFx projects

**Characteristics:**
- Reusable TypeScript modules
- Deployed like web parts
- Referenced by other SPFx solutions
- Versioned independently

**Use Cases:**
- Common utilities
- Shared services
- UI component libraries
- Business logic modules

---

## Project Structure

### Typical SPFx Project Layout

```
my-webpart/
├── .vscode/                    # VS Code settings
│   └── launch.json            # Debug configuration
├── config/                     # Build configuration
│   ├── config.json            # General config
│   ├── package-solution.json  # SharePoint package config
│   ├── serve.json             # Local serve config
│   └── write-manifests.json   # Manifest writing config
├── node_modules/              # npm packages
├── src/                       # Source code
│   ├── webparts/              # Web parts
│   │   └── helloWorld/
│   │       ├── loc/           # Localization
│   │       │   ├── en-us.js
│   │       │   └── mystrings.d.ts
│   │       ├── HelloWorldWebPart.manifest.json
│   │       ├── HelloWorldWebPart.module.scss
│   │       ├── HelloWorldWebPart.ts
│   │       └── components/    # React components
│   │           ├── HelloWorld.tsx
│   │           └── HelloWorld.module.scss
│   └── index.ts               # Entry point
├── teams/                     # Teams manifest
├── .gitignore
├── .yo-rc.json               # Yeoman config
├── gulpfile.js               # Gulp tasks
├── package.json              # npm package definition
├── README.md
└── tsconfig.json             # TypeScript config
```

### Key Files Explained

#### Manifest File (`*.manifest.json`)

Every component has a manifest describing metadata and capabilities:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-web-part-manifest.schema.json",
  "id": "12345678-1234-1234-1234-123456789012",
  "alias": "HelloWorldWebPart",
  "componentType": "WebPart",
  "version": "*",
  "manifestVersion": 2,
  "requiresCustomScript": false,
  "supportedHosts": ["SharePointWebPart", "TeamsTab"],
  "preconfiguredEntries": [{
    "groupId": "5c03119e-3074-46fd-976b-c60198311f70",
    "group": { "default": "Advanced" },
    "title": { "default": "Hello World" },
    "description": { "default": "Hello World web part" },
    "officeFabricIconFontName": "Page",
    "properties": {
      "description": "Hello World"
    }
  }]
}
```

**Key Properties:**
- **id:** Unique GUID for component
- **alias:** Component class name
- **componentType:** WebPart, Extension, or Library
- **supportedHosts:** Where component can run
- **preconfiguredEntries:** Default configurations for toolbox

---

## Configuration Files

### package.json

Defines project metadata and dependencies:

```json
{
  "name": "my-webpart",
  "version": "0.0.1",
  "private": true,
  "main": "lib/index.js",
  "scripts": {
    "build": "gulp bundle",
    "clean": "gulp clean",
    "test": "gulp test"
  },
  "dependencies": {
    "@microsoft/sp-core-library": "1.19.0",
    "@microsoft/sp-lodash-subset": "1.19.0",
    "@microsoft/sp-office-ui-fabric-core": "1.19.0",
    "@microsoft/sp-property-pane": "1.19.0",
    "@microsoft/sp-webpart-base": "1.19.0",
    "react": "17.0.1",
    "react-dom": "17.0.1"
  },
  "devDependencies": {
    "@microsoft/sp-build-web": "1.20.2",
    "@microsoft/sp-module-interfaces": "1.20.2",
    "@microsoft/eslint-plugin-spfx": "1.20.2",
    "@microsoft/eslint-config-spfx": "1.20.2",
    "@rushstack/eslint-config": "4.0.1",
    "@types/react": "17.0.45",
    "@types/react-dom": "17.0.17",
    "typescript": "4.7.4",
    "eslint": "8.57.0"
  }
}
```

**Note on Version Differences:**
- Runtime dependencies: `1.19.0`
- Build dependencies: `1.20.x` (decoupled from SPFx version)

### serve.json

Controls local development server:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json",
  "port": 4321,
  "https": true,
  "initialPage": "https://{tenantDomain}/_layouts/workbench.aspx",
  "serveConfigurations": {
    "default": {
      "pageUrl": "https://{tenantDomain}/sites/dev/_layouts/workbench.aspx",
      "customActions": {
        "my-extension-id": {
          "location": "ClientSideExtension.ApplicationCustomizer",
          "properties": {
            "testMessage": "Test message"
          }
        }
      }
    }
  }
}
```

**Key Properties:**
- **port:** Development server port (default: 4321)
- **https:** Use HTTPS for local development
- **initialPage:** Page to open with `gulp serve`
- **{tenantDomain}:** Replaced by `SPFX_SERVE_TENANT_DOMAIN` environment variable

### config.json

Defines bundles and external dependencies:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/config.2.0.schema.json",
  "version": "2.0",
  "bundles": {
    "hello-world-web-part": {
      "components": [
        {
          "entrypoint": "./lib/webparts/helloWorld/HelloWorldWebPart.js",
          "manifest": "./src/webparts/helloWorld/HelloWorldWebPart.manifest.json"
        }
      ]
    }
  },
  "externals": {
    "react": {
      "path": "https://unpkg.com/react@17.0.1/umd/react.production.min.js",
      "globalName": "React"
    }
  },
  "localizedResources": {
    "HelloWorldWebPartStrings": "lib/webparts/helloWorld/loc/{locale}.js"
  }
}
```

**Key Sections:**
- **bundles:** JavaScript bundle definitions
- **externals:** External libraries loaded from CDN
- **localizedResources:** Localization file paths

### package-solution.json

SharePoint package configuration:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json",
  "solution": {
    "name": "my-webpart-client-side-solution",
    "id": "12345678-1234-1234-1234-123456789012",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "skipFeatureDeployment": true,
    "isDomainIsolated": false,
    "developer": {
      "name": "Contoso",
      "websiteUrl": "https://www.contoso.com",
      "privacyUrl": "https://www.contoso.com/privacy",
      "termsOfUseUrl": "https://www.contoso.com/terms"
    },
    "metadata": {
      "shortDescription": { "default": "My web part" },
      "longDescription": { "default": "Detailed description" },
      "screenshotPaths": [],
      "videoUrl": "",
      "categories": []
    },
    "features": [{
      "title": "my-webpart Feature",
      "description": "The feature that activates my-webpart",
      "id": "12345678-1234-1234-1234-123456789013",
      "version": "1.0.0.0"
    }]
  },
  "paths": {
    "zippedPackage": "solution/my-webpart.sppkg"
  },
  "webApiPermissionRequests": [
    {
      "resource": "Microsoft Graph",
      "scope": "User.ReadBasic.All"
    }
  ]
}
```

**Key Properties:**
- **includeClientSideAssets:** Package assets in .sppkg (true by default in v1.4+)
- **skipFeatureDeployment:** Enable tenant-wide deployment
- **isDomainIsolated:** Use isolated domain for security
- **webApiPermissionRequests:** Required API permissions

### tsconfig.json

TypeScript compiler configuration:

```json
{
  "extends": "./node_modules/@microsoft/rush-stack-compiler-4.7/includes/tsconfig-web.json",
  "compilerOptions": {
    "target": "es5",
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react",
    "declaration": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "outDir": "lib",
    "inlineSources": false,
    "noUnusedLocals": false,
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@microsoft"
    ],
    "types": [
      "webpack-env"
    ],
    "lib": [
      "es5",
      "dom",
      "es2015.collection",
      "es2015.promise"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ]
}
```

**Important Options:**
- **extends:** Rush Stack compiler configuration
- **experimentalDecorators:** Required for SPFx decorators
- **jsx:** "react" for React support
- **sourceMap:** Enables debugging

---

## Development Workflow

### Creating a New Project

#### Using Yeoman Generator

```bash
# Navigate to parent folder
cd C:\dev\spfx-projects

# Run Yeoman generator
yo @microsoft/sharepoint
```

**Generator Prompts:**

1. **Solution name:** `my-first-webpart`
2. **Baseline packages:** Latest version
3. **Target:** SharePoint Online only
4. **Place files:** Current folder
5. **Tenant admin:** No (N)
6. **Component type:** WebPart
7. **Web part name:** `HelloWorld`
8. **Description:** `My first web part`
9. **Framework:** React

**Generated Project:**
```
my-first-webpart/
├── config/
├── src/
│   └── webparts/
│       └── helloWorld/
├── package.json
├── tsconfig.json
└── gulpfile.js
```

### Installing Dependencies

```bash
# Navigate to project
cd my-first-webpart

# Install dependencies
npm install
```

### Local Development

#### Start Development Server

```bash
# Start local server and open workbench
gulp serve

# Start without opening browser
gulp serve --nobrowser

# Use specific locale
gulp serve --locale=fr-fr
```

**Development URLs:**
- Local Workbench: `https://localhost:4321/temp/workbench.html` (deprecated in v1.13+)
- Hosted Workbench: `https://{tenant}.sharepoint.com/_layouts/workbench.aspx`

**Note:** As of SPFx v1.13, local workbench is no longer supported. Use hosted workbench.

#### Live Reload

SPFx supports automatic reload when files change:
- Edit TypeScript/React files
- Save changes
- Browser automatically refreshes
- Changes visible immediately

### Debugging

#### Visual Studio Code

1. **Install Built-in Debugger** (no extension needed as of VS Code 1.46+)

2. **Configure `.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Local workbench",
      "type": "chrome",
      "request": "launch",
      "url": "https://localhost:4321/temp/workbench.html",
      "webRoot": "${workspaceRoot}",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///.././src/*": "${webRoot}/src/*",
        "webpack:///../../../src/*": "${webRoot}/src/*",
        "webpack:///../../../../src/*": "${webRoot}/src/*",
        "webpack:///../../../../../src/*": "${webRoot}/src/*"
      },
      "runtimeArgs": [
        "--remote-debugging-port=9222",
        "-incognito"
      ]
    },
    {
      "name": "Hosted workbench",
      "type": "chrome",
      "request": "launch",
      "url": "https://{tenant}.sharepoint.com/_layouts/workbench.aspx",
      "webRoot": "${workspaceRoot}",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///.././src/*": "${webRoot}/src/*",
        "webpack:///../../../src/*": "${webRoot}/src/*"
      },
      "runtimeArgs": [
        "--remote-debugging-port=9222"
      ]
    }
  ]
}
```

**Note for v1.21+:** Development URL changed to `https://localhost:4321/temp/build/manifests.js`

3. **Set Breakpoints:**
   - Click margin next to line number, or
   - Press F9 on desired line

4. **Start Debugging:**
   - Run `gulp serve --nobrowser`
   - Press F5 in VS Code
   - Select configuration

#### Browser DevTools

Source maps are generated in debug mode:
- Open browser DevTools (F12)
- Navigate to Sources tab
- Find TypeScript source files
- Set breakpoints directly

**Production Builds:**
Source maps are NOT generated with `--ship` flag for security.

### Gulp Tasks

#### Core Tasks

```bash
# Clean build artifacts
gulp clean

# Compile TypeScript
gulp build

# Bundle JavaScript (debug mode)
gulp bundle

# Bundle for production (minified)
gulp bundle --ship

# Package solution
gulp package-solution

# Package for production
gulp package-solution --ship

# Run tests
gulp test

# Serve locally
gulp serve
```

#### Build Modes

**DEBUG Mode (default):**
- Non-minified bundles
- Source maps included
- Output to `dist/` folder
- Larger file sizes
- Easier debugging

**SHIP Mode (production):**
- Minified bundles
- No source maps
- Output to `temp/deploy/` folder
- Optimized file sizes
- Production-ready

#### Task Chaining

```bash
# Clean, build, and bundle
gulp clean && gulp bundle

# Full production build
gulp clean && gulp bundle --ship && gulp package-solution --ship
```

#### Custom Gulp Tasks

Create in `gulpfile.js`:

```javascript
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

// Custom task
const myTask = build.subTask('my-task', function(gulp, buildOptions, done) {
  console.log('Running custom task');
  done();
});

// Add to build pipeline
build.rig.addPostBuildTask(myTask);

build.initialize(gulp);
```

### Package Output

After running `gulp package-solution --ship`:

```
sharepoint/solution/
└── my-webpart.sppkg
```

**SPPKG Contents:**
- Compiled JavaScript bundles
- Static assets (if `includeClientSideAssets: true`)
- Manifest files
- Feature definitions

---

## APIs & SDK Reference

### SPHttpClient

**Purpose:** Communicate with SharePoint REST API

**Import:**
```typescript
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
```

**Usage:**
```typescript
// GET request
this.context.spHttpClient
  .get(
    `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Documents')/items`,
    SPHttpClient.configurations.v1
  )
  .then((response: SPHttpClientResponse) => {
    return response.json();
  })
  .then((data: any) => {
    console.log('Items:', data.value);
  });

// POST request
const body: string = JSON.stringify({
  '__metadata': { 'type': 'SP.Data.DocumentsItem' },
  'Title': 'New Document'
});

this.context.spHttpClient
  .post(
    `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Documents')/items`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-type': 'application/json;odata=nometadata',
        'odata-version': ''
      },
      body: body
    }
  )
  .then((response: SPHttpClientResponse) => {
    console.log('Created:', response.status);
  });
```

**Key Features:**
- Automatic digest management for writes
- Default headers
- Telemetry collection
- Only works with SharePoint REST API

### MSGraphClientV3

**Purpose:** Access Microsoft Graph API

**Import:**
```typescript
import { MSGraphClientV3 } from '@microsoft/sp-http';
```

**Usage:**
```typescript
// Get current user
this.context.msGraphClientFactory
  .getClient('3')
  .then((client: MSGraphClientV3) => {
    return client
      .api('/me')
      .get();
  })
  .then((user: any) => {
    console.log('User:', user);
  });

// Get user's emails
client
  .api('/me/messages')
  .top(10)
  .select('subject,from,receivedDateTime')
  .orderBy('receivedDateTime DESC')
  .get()
  .then((emails: any) => {
    console.log('Emails:', emails.value);
  });

// Upload file to OneDrive
const file = new Blob(['Hello World'], { type: 'text/plain' });

client
  .api('/me/drive/root:/test.txt:/content')
  .put(file)
  .then((response: any) => {
    console.log('File uploaded:', response);
  });
```

**Permissions:**
Require approval in `package-solution.json`:

```json
{
  "webApiPermissionRequests": [
    {
      "resource": "Microsoft Graph",
      "scope": "User.ReadBasic.All"
    },
    {
      "resource": "Microsoft Graph",
      "scope": "Mail.Read"
    }
  ]
}
```

**Admin Approval:**
1. Deploy solution to app catalog
2. Navigate to SharePoint Admin Center
3. Go to Advanced > API Access
4. Approve pending requests

### AadHttpClient

**Purpose:** Call Azure AD-secured custom APIs

**Import:**
```typescript
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
```

**Usage:**
```typescript
this.context.aadHttpClientFactory
  .getClient('https://contoso.azurewebsites.net')
  .then((client: AadHttpClient) => {
    return client.get(
      'https://contoso.azurewebsites.net/api/orders',
      AadHttpClient.configurations.v1
    );
  })
  .then((response: HttpClientResponse) => {
    return response.json();
  })
  .then((data: any) => {
    console.log('Orders:', data);
  });
```

**Permissions:**
```json
{
  "webApiPermissionRequests": [
    {
      "resource": "contoso-api",
      "scope": "user_impersonation"
    }
  ]
}
```

### HttpClient

**Purpose:** Call public APIs (no authentication)

**Import:**
```typescript
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
```

**Usage:**
```typescript
this.context.httpClient
  .get(
    'https://api.example.com/data',
    HttpClient.configurations.v1
  )
  .then((response: HttpClientResponse) => {
    return response.json();
  })
  .then((data: any) => {
    console.log('Data:', data);
  });
```

### Context API Reference

**PageContext Properties:**
```typescript
// Current user
this.context.pageContext.user.displayName
this.context.pageContext.user.email
this.context.pageContext.user.loginName

// Current site
this.context.pageContext.web.absoluteUrl
this.context.pageContext.web.title
this.context.pageContext.web.id

// Current list (if applicable)
this.context.pageContext.list.title
this.context.pageContext.list.id

// Locale
this.context.pageContext.cultureInfo.currentCultureName
this.context.pageContext.cultureInfo.currentUICultureName
```

**Teams Context (when hosted in Teams):**
```typescript
if (this.context.sdks.microsoftTeams) {
  const teamsContext = this.context.sdks.microsoftTeams.context;
  console.log('Team ID:', teamsContext.teamId);
  console.log('Channel ID:', teamsContext.channelId);
  console.log('User ID:', teamsContext.userObjectId);
}
```

### PnPjs Integration

**Installation:**
```bash
npm install @pnp/sp @pnp/graph --save
```

**Configuration (Recommended Pattern):**

Create `pnpjsConfig.ts`:
```typescript
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import { graphfi, GraphFI, SPFx as graphSPFx } from '@pnp/graph';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/graph/users";

let _sp: SPFI | null = null;
let _graph: GraphFI | null = null;

export const getSP = (context?: WebPartContext): SPFI => {
  if (_sp === null && context !== null) {
    _sp = spfi().using(SPFx(context));
  }
  return _sp!;
};

export const getGraph = (context?: WebPartContext): GraphFI => {
  if (_graph === null && context !== null) {
    _graph = graphfi().using(graphSPFx(context));
  }
  return _graph!;
};
```

**Usage in Web Part:**
```typescript
import { getSP } from './pnpjsConfig';

export default class MyWebPart extends BaseClientSideWebPart<IMyWebPartProps> {

  protected async onInit(): Promise<void> {
    await super.onInit();
    getSP(this.context); // Initialize PnPjs
  }

  private async _getListItems(): Promise<void> {
    const sp = getSP();

    // Get list items
    const items = await sp.web.lists
      .getByTitle('Documents')
      .items
      .select('Title', 'Modified')
      .top(10)();

    console.log('Items:', items);
  }
}
```

**PnPjs v4 Compatibility:**
- SPFx 1.19 supports PnPjs v4
- PnPjs v4 requires Node.js v18+
- Recommended for new projects

---

## React Development

### React Version in SPFx 1.19.0

**React:** v17.0.1
**React DOM:** v17.0.1

### Functional Components with Hooks

While Yeoman generator creates class components by default, **functional components with hooks are recommended** for new development.

#### Class Component (Generator Default)

```typescript
import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';

export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}
```

#### Functional Component with Hooks

```typescript
import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';

const HelloWorld: React.FC<IHelloWorldProps> = (props) => {
  const [count, setCount] = React.useState<number>(0);
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Component mounted - equivalent to componentDidMount
    loadData();

    // Cleanup - equivalent to componentWillUnmount
    return () => {
      console.log('Component unmounting');
    };
  }, []); // Empty array = run once on mount

  React.useEffect(() => {
    // Runs when count changes - equivalent to componentDidUpdate
    console.log('Count changed:', count);
  }, [count]); // Run when count changes

  const loadData = async (): Promise<void> => {
    // Load data
  };

  return (
    <div className={styles.helloWorld}>
      <h1>{props.title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default HelloWorld;
```

### Common React Hooks

#### useState

```typescript
const [value, setValue] = React.useState<string>('initial');
const [items, setItems] = React.useState<any[]>([]);
const [loading, setLoading] = React.useState<boolean>(false);
```

#### useEffect

```typescript
// Run once on mount
React.useEffect(() => {
  console.log('Mounted');
}, []);

// Run when dependencies change
React.useEffect(() => {
  console.log('Props changed:', props.title);
}, [props.title]);

// Cleanup on unmount
React.useEffect(() => {
  const timer = setInterval(() => {}, 1000);

  return () => clearInterval(timer); // Cleanup
}, []);
```

#### useCallback

```typescript
const handleClick = React.useCallback(() => {
  console.log('Clicked');
}, []); // Memoized callback

const handleItemClick = React.useCallback((id: number) => {
  console.log('Item clicked:', id);
}, [items]); // Recreate when items change
```

#### useMemo

```typescript
const expensiveValue = React.useMemo(() => {
  return items.reduce((sum, item) => sum + item.value, 0);
}, [items]); // Recalculate when items change
```

#### useRef

```typescript
const inputRef = React.useRef<HTMLInputElement>(null);

const focusInput = (): void => {
  inputRef.current?.focus();
};

return <input ref={inputRef} />;
```

### React Context API in SPFx

**Purpose:** Avoid prop drilling, share data across components

#### Create Context

```typescript
// SPFxContext.ts
import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISPFxContext {
  context: WebPartContext;
  theme?: string;
}

export const SPFxContext = React.createContext<ISPFxContext | undefined>(undefined);
```

#### Provide Context

```typescript
// HelloWorldWebPart.ts
import { SPFxContext } from './SPFxContext';

export default class HelloWorldWebPart extends BaseClientSideWebPart<IProps> {
  public render(): void {
    const element: React.ReactElement<IProps> = React.createElement(
      SPFxContext.Provider,
      { value: { context: this.context, theme: 'light' } },
      React.createElement(HelloWorld, { title: this.properties.title })
    );

    ReactDom.render(element, this.domElement);
  }
}
```

#### Consume Context

```typescript
// ChildComponent.tsx
import { SPFxContext } from './SPFxContext';

const ChildComponent: React.FC = () => {
  const spfxContext = React.useContext(SPFxContext);

  if (!spfxContext) {
    return <div>No context available</div>;
  }

  return (
    <div>
      <p>Site URL: {spfxContext.context.pageContext.web.absoluteUrl}</p>
      <p>User: {spfxContext.context.pageContext.user.displayName}</p>
    </div>
  );
};
```

### Custom Hooks

#### useSPFx Hook

```typescript
// hooks/useSPFx.ts
import { useContext } from 'react';
import { SPFxContext } from '../SPFxContext';

export const useSPFx = () => {
  const context = useContext(SPFxContext);
  if (!context) {
    throw new Error('useSPFx must be used within SPFxContext.Provider');
  }
  return context;
};

// Usage
const MyComponent: React.FC = () => {
  const { context } = useSPFx();
  return <div>{context.pageContext.web.title}</div>;
};
```

#### useSharePointData Hook

```typescript
// hooks/useSharePointData.ts
import { useState, useEffect } from 'react';
import { getSP } from '../pnpjsConfig';

export const useSharePointData = <T,>(listName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sp = getSP();
        const items = await sp.web.lists.getByTitle(listName).items();
        setData(items);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [listName]);

  return { data, loading, error };
};

// Usage
const MyComponent: React.FC = () => {
  const { data, loading, error } = useSharePointData<any>('Documents');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(item => <li key={item.Id}>{item.Title}</li>)}
    </ul>
  );
};
```

---

## Property Pane Development

### Property Pane Configuration

```typescript
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-property-pane';

protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: 'Configuration Settings'
        },
        groups: [
          {
            groupName: 'Basic Settings',
            groupFields: [
              PropertyPaneTextField('title', {
                label: 'Title',
                description: 'Web part title',
                multiline: false,
                resizable: false,
                placeholder: 'Enter title...'
              }),
              PropertyPaneTextField('description', {
                label: 'Description',
                multiline: true,
                rows: 4
              })
            ]
          },
          {
            groupName: 'Display Options',
            groupFields: [
              PropertyPaneCheckbox('showImage', {
                text: 'Show image',
                checked: true,
                // New in v1.19
                ariaLabel: 'Toggle to show or hide image'
              }),
              PropertyPaneToggle('enableFeature', {
                label: 'Enable feature',
                onText: 'On',
                offText: 'Off',
                // New in v1.19
                inlineLabel: true // Position label inline with toggle
              }),
              PropertyPaneDropdown('layout', {
                label: 'Layout',
                options: [
                  { key: 'grid', text: 'Grid' },
                  { key: 'list', text: 'List' },
                  { key: 'compact', text: 'Compact' }
                ],
                selectedKey: 'grid',
                // New in v1.19
                ariaDescription: 'Select the layout style for displaying items'
              }),
              PropertyPaneChoiceGroup('theme', {
                label: 'Theme',
                options: [
                  {
                    key: 'light',
                    text: 'Light',
                    // New in v1.19
                    imageAlt: 'Light theme preview'
                  },
                  {
                    key: 'dark',
                    text: 'Dark',
                    imageAlt: 'Dark theme preview'
                  }
                ]
              }),
              PropertyPaneSlider('itemCount', {
                label: 'Items to display',
                min: 1,
                max: 20,
                value: 10,
                step: 1,
                showValue: true
              })
            ]
          }
        ]
      }
    ]
  };
}
```

### SPFx 1.19.0 Property Pane Enhancements

```typescript
import {
  PropertyPaneIconPicker,
  PropertyPaneThumbnailPicker
} from '@microsoft/sp-property-pane';

PropertyPaneIconPicker('icon', {
  label: 'Select icon',
  currentIcon: this.properties.icon,
  // New in v1.19
  disabled: !this.properties.showIcon, // Can disable the picker
  onPropertyChange: this.onPropertyPaneFieldChanged,
  properties: this.properties,
  key: 'iconPickerId'
}),

PropertyPaneThumbnailPicker('thumbnail', {
  label: 'Select thumbnail',
  currentThumbnail: this.properties.thumbnail,
  // New in v1.19
  disabled: false,
  onPropertyChange: this.onPropertyPaneFieldChanged,
  properties: this.properties,
  key: 'thumbnailPickerId'
})
```

### Property Pane Field Changes

```typescript
protected onPropertyPaneFieldChanged(
  propertyPath: string,
  oldValue: any,
  newValue: any
): void {
  // Update property
  super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

  // Custom logic
  if (propertyPath === 'layout' && newValue === 'compact') {
    this.properties.itemCount = 5; // Auto-adjust item count
  }

  // Re-render web part
  this.render();
}
```

### Custom Property Pane Controls

```typescript
// Custom control interface
export interface IPropertyPaneColorPickerProps {
  label: string;
  selectedColor: string;
  onPropertyChange: (propertyPath: string, newValue: any) => void;
}

// Custom control component
export class PropertyPaneColorPicker implements IPropertyPaneField<IPropertyPaneColorPickerProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneColorPickerProps;

  constructor(targetProperty: string, properties: IPropertyPaneColorPickerProps) {
    this.targetProperty = targetProperty;
    this.properties = properties;
  }

  public render(): void {
    // Render custom control
  }
}

// Factory function
export function PropertyPaneColorPicker(
  targetProperty: string,
  properties: IPropertyPaneColorPickerProps
): IPropertyPaneField<IPropertyPaneColorPickerProps> {
  return new PropertyPaneColorPicker(targetProperty, properties);
}
```

### PnP Reusable Property Pane Controls

```bash
npm install @pnp/spfx-property-controls --save
```

**Available Controls:**
- PropertyFieldListPicker
- PropertyFieldPeoplePicker
- PropertyFieldDateTimePicker
- PropertyFieldColorPicker
- PropertyFieldTermPicker
- Many more...

**Usage:**
```typescript
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

PropertyFieldListPicker('listId', {
  label: 'Select a list',
  selectedList: this.properties.listId,
  includeHidden: false,
  orderBy: PropertyFieldListPickerOrderBy.Title,
  disabled: false,
  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
  properties: this.properties,
  context: this.context,
  deferredValidationTime: 0,
  key: 'listPickerFieldId'
})
```

---

## Styling & Theming

### CSS Modules

SPFx uses CSS Modules for component-scoped styling:

**HelloWorld.module.scss:**
```scss
.helloWorld {
  background-color: $ms-color-themeLighter;
  padding: 20px;

  .title {
    @include ms-font-xl;
    color: $ms-color-themePrimary;
    margin-bottom: 10px;
  }

  .description {
    @include ms-font-m;
    color: $ms-color-neutralPrimary;
  }

  .button {
    @include ms-bgColor-themePrimary;
    @include ms-fontColor-white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;

    &:hover {
      @include ms-bgColor-themeDark;
    }
  }
}
```

**Component Usage:**
```typescript
import styles from './HelloWorld.module.scss';

const HelloWorld: React.FC<IProps> = (props) => {
  return (
    <div className={styles.helloWorld}>
      <h1 className={styles.title}>{props.title}</h1>
      <p className={styles.description}>{props.description}</p>
      <button className={styles.button}>Click Me</button>
    </div>
  );
};
```

**Generated HTML:**
```html
<div class="helloWorld_a1b2c3d4">
  <h1 class="title_e5f6g7h8">My Title</h1>
</div>
```

### SharePoint Theme Variables

Access theme colors in SCSS:

```scss
@import '~@microsoft/sp-office-ui-fabric-core/dist/sass/SPFabricCore.scss';

.myComponent {
  background-color: $ms-color-themePrimary;
  color: $ms-color-white;
  border: 1px solid $ms-color-themeDark;

  &:hover {
    background-color: $ms-color-themeDarker;
  }
}
```

**Available Theme Variables:**
- `$ms-color-themePrimary`
- `$ms-color-themeLighter`
- `$ms-color-themeLight`
- `$ms-color-themeTertiary`
- `$ms-color-themeDark`
- `$ms-color-themeDarker`
- `$ms-color-neutralPrimary`
- `$ms-color-white`
- And many more...

### Accessing Theme in TypeScript

```typescript
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export default class MyWebPart extends BaseClientSideWebPart<IProps> {
  private _theme: IReadonlyTheme | undefined;

  protected onInit(): Promise<void> {
    this._theme = this.context.sdks?.microsoftTeams?.context?.theme ||
                  this.context.theme;

    return super.onInit();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;

    this._theme = currentTheme;

    // Apply theme to component
    const { semanticColors } = currentTheme;
    this.domElement.style.setProperty('--primaryColor', semanticColors.primaryButtonBackground);
    this.domElement.style.setProperty('--textColor', semanticColors.bodyText);
  }

  public render(): void {
    const element = React.createElement(HelloWorld, {
      title: this.properties.title,
      theme: this._theme
    });

    ReactDom.render(element, this.domElement);
  }
}
```

### Fluent UI (Office UI Fabric React)

SPFx includes Fluent UI components:

```typescript
import {
  PrimaryButton,
  DefaultButton,
  TextField,
  Dropdown,
  IDropdownOption,
  Stack,
  Icon,
  Label
} from '@fluentui/react';

const MyComponent: React.FC = () => {
  const [text, setText] = React.useState('');
  const [selected, setSelected] = React.useState<string>();

  const options: IDropdownOption[] = [
    { key: 'option1', text: 'Option 1' },
    { key: 'option2', text: 'Option 2' },
    { key: 'option3', text: 'Option 3' }
  ];

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <TextField
        label="Enter text"
        value={text}
        onChange={(_, value) => setText(value || '')}
      />

      <Dropdown
        label="Select option"
        options={options}
        selectedKey={selected}
        onChange={(_, option) => setSelected(option?.key as string)}
      />

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <PrimaryButton text="Primary" onClick={() => alert('Primary clicked')} />
        <DefaultButton text="Default" onClick={() => alert('Default clicked')} />
      </Stack>

      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 5 }}>
        <Icon iconName="CheckMark" />
        <Label>Success!</Label>
      </Stack>
    </Stack>
  );
};
```

### Fluent UI v9 Integration

```bash
npm install @fluentui/react-components --save
```

**Provider Setup:**
```typescript
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

const MyWebPart: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <MyComponent />
    </FluentProvider>
  );
};
```

**Components:**
```typescript
import {
  Button,
  Input,
  Label,
  makeStyles
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }
});

const MyComponent: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Label>Enter name:</Label>
      <Input placeholder="Name..." />
      <Button appearance="primary">Submit</Button>
    </div>
  );
};
```

### Responsive Design

```scss
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}
```

### Global CSS Targeting

Use `:global` for non-module CSS:

```scss
.myComponent {
  // Module-scoped
  padding: 10px;

  :global {
    // Global scope - affects Fluent UI classes
    .ms-Button {
      margin: 5px;
    }

    .ms-TextField-field {
      border-radius: 4px;
    }
  }
}
```

---

## Localization

### Resource File Structure

SPFx maintains localized resources in `loc/` folder:

```
src/webparts/helloWorld/loc/
├── mystrings.d.ts    # TypeScript definitions
├── en-us.js          # English (US)
├── fr-fr.js          # French
├── de-de.js          # German
└── es-es.js          # Spanish
```

### Type Definition File

**mystrings.d.ts:**
```typescript
declare interface IHelloWorldWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  WelcomeMessage: string;
  ItemsLabel: string;
  LoadingMessage: string;
  ErrorMessage: string;
}

declare module 'HelloWorldWebPartStrings' {
  const strings: IHelloWorldWebPartStrings;
  export = strings;
}
```

### Resource Files

**en-us.js:**
```javascript
define([], function() {
  return {
    "PropertyPaneDescription": "Configuration settings",
    "BasicGroupName": "Basic Settings",
    "DescriptionFieldLabel": "Description",
    "WelcomeMessage": "Welcome to the web part!",
    "ItemsLabel": "items",
    "LoadingMessage": "Loading data...",
    "ErrorMessage": "An error occurred while loading data."
  }
});
```

**fr-fr.js:**
```javascript
define([], function() {
  return {
    "PropertyPaneDescription": "Paramètres de configuration",
    "BasicGroupName": "Paramètres de base",
    "DescriptionFieldLabel": "Description",
    "WelcomeMessage": "Bienvenue dans le composant WebPart!",
    "ItemsLabel": "éléments",
    "LoadingMessage": "Chargement des données...",
    "ErrorMessage": "Une erreur s'est produite lors du chargement des données."
  }
});
```

### Using Localized Strings

```typescript
import * as strings from 'HelloWorldWebPartStrings';

export default class HelloWorldWebPart extends BaseClientSideWebPart<IProps> {
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div>
        <h1>${strings.WelcomeMessage}</h1>
        <p>${this.properties.itemCount} ${strings.ItemsLabel}</p>
      </div>
    `;
  }
}
```

### Using in React Components

```typescript
import * as strings from 'HelloWorldWebPartStrings';

const HelloWorld: React.FC<IProps> = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  if (loading) {
    return <div>{strings.LoadingMessage}</div>;
  }

  if (error) {
    return <div>{strings.ErrorMessage}</div>;
  }

  return (
    <div>
      <h1>{strings.WelcomeMessage}</h1>
    </div>
  );
};
```

### Configuration

**config.json:**
```json
{
  "localizedResources": {
    "HelloWorldWebPartStrings": "lib/webparts/helloWorld/loc/{locale}.js"
  }
}
```

### Testing with Different Locales

```bash
# Serve with French locale
gulp serve --locale=fr-fr

# Serve with German locale
gulp serve --locale=de-de
```

### Current Locale Detection

```typescript
const currentLocale = this.context.pageContext.cultureInfo.currentCultureName;
// Returns: "en-US", "fr-FR", "de-DE", etc.

const currentUILocale = this.context.pageContext.cultureInfo.currentUICultureName;
```

---

## Testing

### Jest Configuration for SPFx 1.19

#### Installation

```bash
npm install jest @types/jest ts-jest identity-obj-proxy --save-dev

# Optional: React Testing Library
npm install @testing-library/react @testing-library/jest-dom --save-dev
```

#### Jest Configuration

**jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Mock CSS modules
    '\\.(css|scss)$': 'identity-obj-proxy',

    // Mock SPFx modules
    '@microsoft/sp-core-library': '<rootDir>/__mocks__/spMocks.ts',
    '@microsoft/sp-webpart-base': '<rootDir>/__mocks__/spMocks.ts',
    '@microsoft/sp-http': '<rootDir>/__mocks__/spMocks.ts',
    '@microsoft/sp-lodash-subset': 'lodash'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: '<rootDir>/coverage',
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)',
    '**/*.test.(ts|tsx)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

#### Mock Files

**__mocks__/spMocks.ts:**
```typescript
export class SPHttpClient {
  public static configurations = {
    v1: {}
  };

  public get(url: string, config: any): Promise<any> {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ value: [] })
    });
  }

  public post(url: string, config: any, options: any): Promise<any> {
    return Promise.resolve({
      ok: true,
      status: 201
    });
  }
}

export class HttpClient {
  public static configurations = {
    v1: {}
  };
}

export class MSGraphClientV3 {
  public api(endpoint: string): any {
    return {
      get: () => Promise.resolve({}),
      select: () => this,
      expand: () => this,
      filter: () => this
    };
  }
}
```

**jest.setup.js:**
```javascript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

#### Example Tests

**Component Test:**
```typescript
// HelloWorld.test.tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HelloWorld from './HelloWorld';
import { IHelloWorldProps } from './IHelloWorldProps';

describe('HelloWorld Component', () => {
  const mockProps: IHelloWorldProps = {
    title: 'Test Title',
    description: 'Test Description',
    context: {} as any
  };

  it('renders title correctly', () => {
    render(<HelloWorld {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description correctly', () => {
    render(<HelloWorld {...mockProps} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles button click', () => {
    const { container } = render(<HelloWorld {...mockProps} />);
    const button = container.querySelector('button');

    expect(button).toBeInTheDocument();
    fireEvent.click(button!);

    // Assert expected behavior
  });
});
```

**Service Test:**
```typescript
// DataService.test.ts
import { DataService } from './DataService';
import { SPHttpClient } from '@microsoft/sp-http';

describe('DataService', () => {
  let service: DataService;
  let mockHttpClient: SPHttpClient;

  beforeEach(() => {
    mockHttpClient = new SPHttpClient({} as any);
    service = new DataService(mockHttpClient);
  });

  it('fetches list items successfully', async () => {
    const mockData = { value: [{ Id: 1, Title: 'Item 1' }] };

    jest.spyOn(mockHttpClient, 'get').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData)
    } as any);

    const result = await service.getListItems('Documents');

    expect(result).toEqual(mockData.value);
    expect(mockHttpClient.get).toHaveBeenCalled();
  });

  it('handles fetch error', async () => {
    jest.spyOn(mockHttpClient, 'get').mockRejectedValue(new Error('Network error'));

    await expect(service.getListItems('Documents')).rejects.toThrow('Network error');
  });
});
```

**Hook Test:**
```typescript
// useSharePointData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useSharePointData } from './useSharePointData';

describe('useSharePointData', () => {
  it('loads data successfully', async () => {
    const { result } = renderHook(() => useSharePointData('Documents'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });
});
```

#### Running Tests

**package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Run Tests:**
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Build & Deployment

### Build Process

#### Development Build

```bash
# Clean previous builds
gulp clean

# Build TypeScript
gulp build

# Bundle JavaScript (debug mode)
gulp bundle

# Combined
gulp clean && gulp build && gulp bundle
```

**Output:** `dist/` folder with non-minified bundles

#### Production Build

```bash
# Bundle for production (minified)
gulp bundle --ship

# Package solution
gulp package-solution --ship

# Combined
gulp clean && gulp bundle --ship && gulp package-solution --ship
```

**Output:**
- `temp/deploy/` - Minified bundles and assets
- `sharepoint/solution/*.sppkg` - SharePoint package

### Package Configuration

**package-solution.json:**
```json
{
  "solution": {
    "name": "my-webpart-client-side-solution",
    "id": "12345678-1234-1234-1234-123456789012",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "skipFeatureDeployment": true,
    "isDomainIsolated": false
  },
  "paths": {
    "zippedPackage": "solution/my-webpart.sppkg"
  }
}
```

**Key Settings:**

- **includeClientSideAssets: true**
  - Assets packaged inside .sppkg
  - Automatically hosted from Office 365 CDN or app catalog
  - Default since SPFx v1.4
  - Recommended for most scenarios

- **skipFeatureDeployment: true**
  - Enables tenant-wide deployment
  - Web parts immediately available across all sites
  - No need to install per site
  - Recommended for organization-wide solutions

- **isDomainIsolated: false**
  - Set to `true` for isolated web parts
  - Runs in unique domain for security
  - Required for specific API permissions

### Deployment to App Catalog

#### Upload to Tenant App Catalog

1. **Build Package:**
   ```bash
   gulp bundle --ship && gulp package-solution --ship
   ```

2. **Navigate to App Catalog:**
   - Go to SharePoint Admin Center
   - Select "More features" > "Apps" > "Open"
   - Click "App Catalog"

3. **Upload Package:**
   - Drag `sharepoint/solution/*.sppkg` to "Apps for SharePoint"
   - Or click "Upload" and select file

4. **Deploy:**
   - Check "Make this solution available to all sites"
   - Click "Deploy"

5. **Approve API Permissions (if required):**
   - Go to SharePoint Admin Center
   - Select "Advanced" > "API access"
   - Approve pending requests

#### Site Collection App Catalog

For site-specific deployment:

1. Enable site collection app catalog on target site
2. Upload .sppkg to site collection app catalog
3. Deploy to that site only

### CDN Hosting Options

#### Option 1: Office 365 CDN (Recommended)

**Enable Office 365 CDN:**
```powershell
# Connect to SharePoint Online
Connect-SPOService -Url https://contoso-admin.sharepoint.com

# Enable CDN
Set-SPOTenantCdnEnabled -CdnType Public -Enable $true

# Verify
Get-SPOTenantCdnEnabled -CdnType Public
```

**Configuration:**
- Set `includeClientSideAssets: true` in package-solution.json
- Assets automatically served from CDN
- Best performance for global users

#### Option 2: Azure CDN

**write-manifests.json:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/write-manifests.schema.json",
  "cdnBasePath": "https://mycdn.azureedge.net/spfx/"
}
```

**package-solution.json:**
```json
{
  "solution": {
    "includeClientSideAssets": false
  }
}
```

**Deploy Assets:**
```bash
# Build
gulp bundle --ship

# Upload temp/deploy/ contents to Azure CDN
# Use Azure Storage Explorer or CLI
```

#### Option 3: SharePoint Library

**Not recommended** - Use CDN for better performance

### Versioning

**Increment Version:**

Update `package-solution.json`:
```json
{
  "solution": {
    "version": "1.0.1.0"
  }
}
```

**Semantic Versioning:**
- **Major.Minor.Patch.Revision**
- Example: 1.2.3.0
  - Major: Breaking changes
  - Minor: New features
  - Patch: Bug fixes
  - Revision: Build number

### Upgrade Existing Solution

1. Increment version in `package-solution.json`
2. Build and package
3. Upload new .sppkg to app catalog
4. Click "Replace" when prompted
5. Users automatically receive update

### CI/CD Pipeline Example

**Azure DevOps pipeline.yml:**
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  npm_config_cache: $(Pipeline.Workspace)/.npm

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    restoreKeys: |
      npm | "$(Agent.OS)"
    path: $(npm_config_cache)
  displayName: 'Cache npm'

- script: |
    npm install
  displayName: 'Install dependencies'

- script: |
    gulp bundle --ship
  displayName: 'Bundle solution'

- script: |
    gulp package-solution --ship
  displayName: 'Package solution'

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.SourcesDirectory)/sharepoint/solution'
    ArtifactName: 'drop'
  displayName: 'Publish artifacts'
```

---

## Performance Optimization

### Bundle Size Reduction

#### 1. Analyze Bundle

```bash
# Install webpack-bundle-analyzer
npm install webpack-bundle-analyzer --save-dev
```

**gulpfile.js:**
```javascript
const bundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if (process.env.ANALYZE) {
      generatedConfiguration.plugins.push(new bundleAnalyzer({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: true
      }));
    }
    return generatedConfiguration;
  }
});
```

**Run Analysis:**
```bash
set ANALYZE=true
gulp bundle --ship
```

#### 2. Tree Shaking

Ensure ES6 imports for tree shaking:

```typescript
// ❌ Bad - imports entire library
import * as _ from 'lodash';

// ✅ Good - imports specific function
import { debounce } from 'lodash-es';

// ❌ Bad
import moment from 'moment';

// ✅ Good - use date-fns (smaller)
import { format } from 'date-fns';
```

#### 3. Code Splitting with React.lazy

```typescript
import * as React from 'react';

// Lazy load component
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

const MyComponent: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </React.Suspense>
  );
};
```

#### 4. External Dependencies

**config.json:**
```json
{
  "externals": {
    "react": {
      "path": "https://unpkg.com/react@17.0.1/umd/react.production.min.js",
      "globalName": "React"
    },
    "react-dom": {
      "path": "https://unpkg.com/react-dom@17.0.1/umd/react-dom.production.min.js",
      "globalName": "ReactDOM"
    }
  }
}
```

**Benefits:**
- Reduces bundle size
- Libraries loaded from CDN
- Shared across web parts

#### 5. Remove Unused Dependencies

```bash
# Audit dependencies
npm ls --all

# Remove unused packages
npm uninstall <package-name>
```

### Rendering Performance

#### 1. React.memo

```typescript
import * as React from 'react';

interface IItemProps {
  title: string;
  description: string;
}

const Item: React.FC<IItemProps> = React.memo((props) => {
  console.log('Rendering Item:', props.title);
  return (
    <div>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  );
});

export default Item;
```

#### 2. useCallback and useMemo

```typescript
const MyComponent: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState('');

  // Memoize expensive calculation
  const filteredItems = React.useMemo(() => {
    return items.filter(item =>
      item.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  // Memoize callback
  const handleItemClick = React.useCallback((id: number) => {
    console.log('Clicked:', id);
  }, []);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filteredItems.map(item => (
        <Item key={item.id} {...item} onClick={handleItemClick} />
      ))}
    </div>
  );
};
```

#### 3. Virtualization for Long Lists

```bash
npm install react-window --save
```

```typescript
import { FixedSizeList } from 'react-window';

const MyList: React.FC<{ items: any[] }> = ({ items }) => {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      {items[index].title}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### Data Loading Optimization

#### 1. Batch Requests

```typescript
import { getSP } from './pnpjsConfig';

// ❌ Bad - Multiple requests
const getItems = async () => {
  const sp = getSP();
  const list1 = await sp.web.lists.getByTitle('List1').items();
  const list2 = await sp.web.lists.getByTitle('List2').items();
  const list3 = await sp.web.lists.getByTitle('List3').items();
};

// ✅ Good - Batched requests
const getItems = async () => {
  const sp = getSP();
  const [list1, list2, list3] = await Promise.all([
    sp.web.lists.getByTitle('List1').items(),
    sp.web.lists.getByTitle('List2').items(),
    sp.web.lists.getByTitle('List3').items()
  ]);
};
```

#### 2. Select Only Required Fields

```typescript
// ❌ Bad - Returns all fields
const items = await sp.web.lists
  .getByTitle('Documents')
  .items();

// ✅ Good - Returns only needed fields
const items = await sp.web.lists
  .getByTitle('Documents')
  .items
  .select('Id', 'Title', 'Modified')
  .top(10)();
```

#### 3. Caching

```typescript
class CacheService {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  public get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  public set(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlMinutes * 60 * 1000)
    });
  }
}

// Usage
const cache = new CacheService();

const getListItems = async (): Promise<any[]> => {
  const cacheKey = 'list-items';
  const cached = cache.get<any[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const sp = getSP();
  const items = await sp.web.lists.getByTitle('Documents').items();

  cache.set(cacheKey, items, 5); // Cache for 5 minutes

  return items;
};
```

### Image Optimization

```typescript
// Use srcset for responsive images
const OptimizedImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <img
      src={src}
      srcSet={`
        ${src}?width=320 320w,
        ${src}?width=640 640w,
        ${src}?width=1024 1024w
      `}
      sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px"
      loading="lazy"
      alt="Optimized"
    />
  );
};
```

---

## Security

### Content Security Policy (CSP)

SharePoint Online implements CSP to protect against attacks:

**Current State (as of 2024):**
- CSP rolling out in SharePoint Online
- Violations logged, but scripts not blocked yet
- Prepare solutions for future enforcement

**Best Practices:**
- Avoid inline scripts
- Use nonce-based script loading
- Avoid `eval()` and `Function()` constructor
- Load resources from trusted sources only

### API Permissions

#### Requesting Permissions

**package-solution.json:**
```json
{
  "solution": {
    "webApiPermissionRequests": [
      {
        "resource": "Microsoft Graph",
        "scope": "User.ReadBasic.All"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "Mail.Read"
      },
      {
        "resource": "SharePoint",
        "scope": "MyFiles.Write"
      },
      {
        "resource": "contoso-api",
        "scope": "user_impersonation"
      }
    ]
  }
}
```

#### Admin Approval Process

1. **Deploy solution** to app catalog
2. **Navigate** to SharePoint Admin Center
3. **Go to** Advanced > API access
4. **Review** pending permission requests
5. **Approve** or reject each request

**Important:**
- Permissions apply tenant-wide
- Admin approval required
- Users consent automatically after admin approval

#### Changes in 2025

Starting March 2025, Microsoft transitions from:
- **Old:** SharePoint Online Client Extensibility Web Application Principal
- **New:** SharePoint Online Web Client Extensibility

Existing permissions migrate automatically.

### Isolated Web Parts

**Purpose:** Run web parts in isolated domain for enhanced security

**Configuration:**

**package-solution.json:**
```json
{
  "solution": {
    "isDomainIsolated": true
  }
}
```

**Characteristics:**
- Runs in unique domain (`app-{guid}.svc.ms`)
- Hosted in iFrame
- Stricter security boundary
- Recommended for sensitive scenarios
- Required for certain API scopes

**Trade-offs:**
- Slightly lower performance (iFrame overhead)
- Cannot access parent page DOM
- Limited communication with page

### Secure Coding Practices

#### 1. Input Validation

```typescript
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const handleUserInput = (userInput: string): void => {
  const sanitized = sanitizeInput(userInput);
  // Use sanitized input
};
```

#### 2. Avoid Dangerous Functions

```typescript
// ❌ Bad - XSS vulnerability
this.domElement.innerHTML = userInput;

// ✅ Good - Safe
this.domElement.textContent = userInput;

// ❌ Bad - Code injection
eval(userCode);

// ✅ Good - Avoid eval entirely
```

#### 3. Secure Data Storage

```typescript
// ❌ Bad - Sensitive data in property bag
this.properties.apiKey = 'secret-key';

// ✅ Good - Store in Azure Key Vault, retrieve via backend API
```

#### 4. HTTPS Only

Always use HTTPS for external API calls:

```typescript
// ❌ Bad
const url = 'http://api.example.com/data';

// ✅ Good
const url = 'https://api.example.com/data';
```

### Secrets Management

**Never commit secrets to source control:**

```typescript
// ❌ Bad
const apiKey = 'pk_live_12345';

// ✅ Good - Use environment-specific configuration
const apiKey = this.context.pageContext.web.absoluteUrl.includes('production')
  ? await this.getSecretFromBackend('PROD_API_KEY')
  : await this.getSecretFromBackend('DEV_API_KEY');
```

**Use Azure Key Vault:**
1. Store secrets in Key Vault
2. Create backend Azure Function
3. Function retrieves secret from Key Vault
4. SPFx calls Function via AadHttpClient
5. Never expose secrets in client code

---

## Teams Integration

### Hosting SPFx in Microsoft Teams

#### Configuration

**Manifest File:**
```json
{
  "supportedHosts": ["SharePointWebPart", "TeamsTab", "TeamsPersonalApp"]
}
```

**Supported Hosts:**
- `SharePointWebPart` - SharePoint pages
- `TeamsTab` - Teams channel/group tab
- `TeamsPersonalApp` - Teams personal app
- `TeamsAppPage` - Teams app page
- `SharePointFullPage` - SharePoint full page

#### Detecting Teams Context

```typescript
export default class MyWebPart extends BaseClientSideWebPart<IProps> {
  private _isTeams: boolean = false;

  protected onInit(): Promise<void> {
    this._isTeams = !!this.context.sdks.microsoftTeams;

    if (this._isTeams) {
      const teamsContext = this.context.sdks.microsoftTeams.context;
      console.log('Running in Teams');
      console.log('Team ID:', teamsContext.teamId);
      console.log('Channel ID:', teamsContext.channelId);
      console.log('User ID:', teamsContext.userObjectId);
      console.log('Theme:', teamsContext.theme);
    }

    return super.onInit();
  }

  public render(): void {
    const element = React.createElement(MyComponent, {
      title: this.properties.title,
      isTeams: this._isTeams,
      teamsContext: this.context.sdks.microsoftTeams?.context
    });

    ReactDom.render(element, this.domElement);
  }
}
```

#### Teams Theme Support

```typescript
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export default class MyWebPart extends BaseClientSideWebPart<IProps> {
  private _theme: IReadonlyTheme | undefined;

  protected onInit(): Promise<void> {
    // Get Teams theme
    if (this.context.sdks.microsoftTeams) {
      this._theme = this.context.sdks.microsoftTeams.context.theme;

      // Listen for theme changes
      this.context.sdks.microsoftTeams.teamsJs.registerOnThemeChangeHandler(
        (theme: string) => {
          console.log('Teams theme changed:', theme);
          this._updateTheme(theme);
        }
      );
    }

    return super.onInit();
  }

  private _updateTheme(theme: string): void {
    // Apply theme-specific styling
    switch (theme) {
      case 'default':
        // Light theme
        break;
      case 'dark':
        // Dark theme
        break;
      case 'contrast':
        // High contrast theme
        break;
    }

    this.render();
  }
}
```

#### Deployment Options

**Option 1: Automatic (Recommended)**
- Set `skipFeatureDeployment: true`
- SharePoint automatically creates Teams manifest
- Solution available in Teams app catalog

**Option 2: Custom Teams Manifest**
- Create custom `teams/` folder with manifest
- Customize Teams app branding
- More control over Teams experience

**teams/manifest.json:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.14/MicrosoftTeams.schema.json",
  "manifestVersion": "1.14",
  "id": "12345678-1234-1234-1234-123456789012",
  "version": "1.0.0",
  "packageName": "com.contoso.myapp",
  "developer": {
    "name": "Contoso",
    "websiteUrl": "https://www.contoso.com",
    "privacyUrl": "https://www.contoso.com/privacy",
    "termsOfUseUrl": "https://www.contoso.com/terms"
  },
  "name": {
    "short": "My App",
    "full": "My Full App Name"
  },
  "description": {
    "short": "Short description",
    "full": "Full description of the app"
  },
  "icons": {
    "outline": "outline.png",
    "color": "color.png"
  },
  "accentColor": "#004578",
  "staticTabs": [
    {
      "entityId": "myTab",
      "name": "My Tab",
      "contentUrl": "https://{teamSiteDomain}/_layouts/15/TeamsLogon.aspx?SPFX=true&dest=/_layouts/15/teamshostedapp.aspx%3Fteams%26personal%26componentId=12345678-1234-1234-1234-123456789012",
      "scopes": ["personal"]
    }
  ],
  "validDomains": [
    "*.sharepoint.com",
    "*.sharepoint-df.com"
  ]
}
```

#### Meeting Apps

SPFx supports Teams meeting apps (added in v1.12):

```typescript
if (this.context.sdks.microsoftTeams) {
  const meetingContext = this.context.sdks.microsoftTeams.context;

  if (meetingContext.meetingId) {
    console.log('Running in Teams meeting');
    console.log('Meeting ID:', meetingContext.meetingId);
    console.log('User role:', meetingContext.userMeetingRole);
  }
}
```

---

## Troubleshooting

### Common SPFx 1.19.0 Issues

#### Issue 1: Build Errors with "[object Object]"

**Symptom:**
Upgrading from 1.18.2 to 1.19.0 causes webpack build errors showing `[object Object]` instead of actual error messages.

**Cause:**
Webpack 5 upgrade changes error handling.

**Solutions:**
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check for incompatible dependencies
3. Review custom webpack configurations

#### Issue 2: PnP Package Compatibility

**Symptom:**
`@pnp/spfx-controls-react` and `@pnp/spfx-property-controls` fail with SPFx 1.19.0.

**Cause:**
PnP packages need version 4.x for SPFx 1.19.

**Solution:**
```bash
npm install @pnp/spfx-controls-react@4.0.0 --save
npm install @pnp/spfx-property-controls@4.0.0 --save
```

Or use beta versions:
```json
{
  "dependencies": {
    "@pnp/spfx-controls-react": "4.0.0-beta.6059083",
    "@pnp/spfx-property-controls": "4.0.0-beta.6059131"
  }
}
```

#### Issue 3: pdf.js Library Breaks

**Symptom:**
After upgrading to SPFx 1.19 (with `@microsoft/sp-build-web@1.20.1`), pdf.js throws "Unexpected token 'catch'" error.

**Cause:**
Webpack 5 stricter parsing of legacy JavaScript.

**Solutions:**
1. Update pdf.js to latest version
2. Use alternative PDF library
3. Configure Webpack to transpile pdf.js

#### Issue 4: Node v16 Not Supported

**Symptom:**
Build fails or warnings about Node version.

**Cause:**
SPFx 1.19 requires Node.js v18.

**Solution:**
```bash
# Install Node v18
nvm install 18
nvm use 18

# Verify
node --version
# Should output: v18.x.x
```

### General Troubleshooting

#### Clear SPFx Cache

```bash
# Clear gulp cache
gulp clean

# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Breakpoints Not Working

**Check sourceMapPathOverrides in `.vscode/launch.json`:**
```json
{
  "sourceMapPathOverrides": {
    "webpack:///.././src/*": "${webRoot}/src/*",
    "webpack:///../../../src/*": "${webRoot}/src/*",
    "webpack:///../../../../src/*": "${webRoot}/src/*",
    "webpack:///../../../../../src/*": "${webRoot}/src/*"
  }
}
```

**Note:** For SPFx 1.21+, development URL changed to `https://localhost:4321/temp/build/manifests.js`

#### Certificate Trust Issues

```bash
# Untrust old certificate
gulp untrust-dev-cert

# Trust new certificate
gulp trust-dev-cert
```

#### TypeScript Errors

**Check TypeScript version compatibility:**
- SPFx 1.19 supports TypeScript 4.5 and 4.7
- Experimental support for TypeScript 5.3

```bash
# Check installed version
npx tsc --version

# Install specific version
npm install typescript@4.7.4 --save-dev
```

#### API Permission Issues

**Symptoms:**
- 401 Unauthorized errors
- "Forbidden" errors with Microsoft Graph

**Solutions:**
1. Verify permissions in `package-solution.json`
2. Check admin approved permissions (SharePoint Admin Center > API Access)
3. Redeploy solution after permission changes
4. Clear browser cache

#### Workbench Not Loading

**Symptoms:**
- Blank page
- "Unable to load web part" error

**Solutions:**
1. Check browser console for errors
2. Verify `gulp serve` is running
3. Check `https://localhost:4321` is accessible
4. Trust development certificate
5. Use hosted workbench instead of local (v1.13+)

#### CORS Errors

**Symptom:**
CORS errors when calling external APIs.

**Solution:**
External API must support CORS. Configure on API server:
```
Access-Control-Allow-Origin: https://*.sharepoint.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Debugging Tips

#### Enable Verbose Logging

```bash
# Verbose build output
gulp bundle --verbose

# Webpack stats
gulp bundle --stats
```

#### Source Maps in Production

**Not recommended** for security, but for troubleshooting:

**gulpfile.js:**
```javascript
build.configureWebpack.mergeConfig({
  additionalConfiguration: (config) => {
    if (process.env.ENABLE_SOURCEMAPS === 'true') {
      config.devtool = 'source-map';
    }
    return config;
  }
});
```

```bash
set ENABLE_SOURCEMAPS=true
gulp bundle --ship
```

#### Network Inspection

Use browser DevTools Network tab to inspect:
- API request/response
- Status codes
- Headers
- Payloads

---

## Code Examples

### Complete Web Part Example (React + PnPjs)

**HelloWorldWebPart.ts:**
```typescript
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import { getSP } from './pnpjsConfig';

export interface IHelloWorldWebPartProps {
  title: string;
  description: string;
  itemCount: number;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Initialize PnPjs
    getSP(this.context);
  }

  public render(): void {
    const element: React.ReactElement<IHelloWorldProps> = React.createElement(
      HelloWorld,
      {
        title: this.properties.title,
        description: this.properties.description,
        itemCount: this.properties.itemCount,
        context: this.context,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Configuration'
          },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Title'
                }),
                PropertyPaneTextField('description', {
                  label: 'Description',
                  multiline: true
                }),
                PropertyPaneSlider('itemCount', {
                  label: 'Items to display',
                  min: 1,
                  max: 20,
                  value: 10,
                  showValue: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
```

**IHelloWorldProps.ts:**
```typescript
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IHelloWorldProps {
  title: string;
  description: string;
  itemCount: number;
  context: WebPartContext;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
```

**HelloWorld.tsx:**
```typescript
import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { DisplayMode } from '@microsoft/sp-core-library';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { getSP } from '../pnpjsConfig';

interface IHelloWorldState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const HelloWorld: React.FC<IHelloWorldProps> = (props) => {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadItems();
  }, [props.itemCount]);

  const loadItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const sp = getSP();
      const listItems = await sp.web.lists
        .getByTitle('Documents')
        .items
        .select('Id', 'Title', 'Modified')
        .top(props.itemCount)();

      setItems(listItems);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string): void => {
    props.updateProperty(value);
  };

  return (
    <div className={styles.helloWorld}>
      {props.displayMode === DisplayMode.Edit ? (
        <TextField
          value={props.title}
          onChange={(_, value) => handleTitleChange(value || '')}
          placeholder="Enter title..."
        />
      ) : (
        <h1 className={styles.title}>{props.title}</h1>
      )}

      <p className={styles.description}>{props.description}</p>

      <PrimaryButton text="Refresh" onClick={loadItems} disabled={loading} />

      {loading && (
        <Spinner size={SpinnerSize.large} label="Loading items..." />
      )}

      {error && (
        <MessageBar messageBarType={MessageBarType.error}>
          {error}
        </MessageBar>
      )}

      {!loading && !error && (
        <div className={styles.itemList}>
          <h3>Items ({items.length})</h3>
          <ul>
            {items.map(item => (
              <li key={item.Id}>
                {item.Title} - {new Date(item.Modified).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HelloWorld;
```

**pnpjsConfig.ts:**
```typescript
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let _sp: SPFI | null = null;

export const getSP = (context?: WebPartContext): SPFI => {
  if (_sp === null && context !== null) {
    _sp = spfi().using(SPFx(context));
  }
  return _sp!;
};
```

### Application Customizer Example

**MyApplicationCustomizer.ts:**
```typescript
import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import Header from './components/Header';

export interface IMyApplicationCustomizerProperties {
  headerMessage: string;
}

export default class MyApplicationCustomizer
  extends BaseApplicationCustomizer<IMyApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    // Add handler for placeholder changes
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    // Render placeholders
    this._renderPlaceHolders();

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    // Try to create top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      if (!this._topPlaceholder) {
        console.error('Top placeholder not available');
        return;
      }

      // Render React component
      const element = React.createElement(Header, {
        message: this.properties.headerMessage
      });

      ReactDom.render(element, this._topPlaceholder.domElement);
    }
  }

  private _onDispose = (): void => {
    if (this._topPlaceholder?.domElement) {
      ReactDom.unmountComponentAtNode(this._topPlaceholder.domElement);
    }
  }
}
```

### Data Visualization ACE Example (SPFx 1.19)

**DataVisualizationAce.ts:**
```typescript
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { LineChartCardView } from '@microsoft/sp-adaptive-card-extension-base';

export default class DataVisualizationAce
  extends BaseAdaptiveCardExtension<IProps, IState> {

  protected async onInit(): Promise<void> {
    this.state = {
      chartData: await this.loadChartData()
    };

    return Promise.resolve();
  }

  private async loadChartData(): Promise<any[]> {
    // Load data from SharePoint or external source
    return [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 15 },
      { x: 3, y: 30 },
      { x: 4, y: 20 }
    ];
  }

  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    return LineChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'line',
        series: [
          {
            data: this.state.chartData,
            lastDataPointLabel: this.state.chartData[this.state.chartData.length - 1]?.y.toString()
          }
        ]
      }
    });
  }

  protected get iconProperty(): string {
    return require('./assets/icon.png');
  }
}
```

---

## Additional Resources

### Official Documentation
- [SharePoint Framework Overview](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)
- [SPFx 1.19 Release Notes](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.19)
- [Set Up Development Environment](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)
- [SPFx Compatibility Matrix](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility)

### Community Resources
- [PnP SPFx Samples](https://pnp.github.io/sp-dev-fx-webparts/)
- [PnP SPFx Controls](https://pnp.github.io/sp-dev-fx-controls-react/)
- [PnP SPFx Property Controls](https://pnp.github.io/sp-dev-fx-property-controls/)
- [PnPjs Documentation](https://pnp.github.io/pnpjs/)

### Tools
- [CLI for Microsoft 365](https://pnp.github.io/cli-microsoft365/)
- [SharePoint Framework Toolkit](https://github.com/pnp/vscode-viva)
- [Rencore SPFx Script Check](https://rencore.com/products/script-check/)

### Blogs & Articles
- [Voitanos SPFx Articles](https://www.voitanos.io/blog/)
- [I am GuidoZam](https://iamguidozam.blog/)
- [SharePoint Maven](https://sharepointmaven.com/blog/)

---

**Document Version:** 1.0
**SPFx Version:** 1.19.0
**Last Updated:** January 2025

This comprehensive guide covers all major aspects of SharePoint Framework 1.19.0 development. Use this as a reference for building, deploying, and maintaining SPFx solutions.