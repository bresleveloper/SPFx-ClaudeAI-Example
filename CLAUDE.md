# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SharePoint Framework (SPFx) v1.19.0 solution built with TypeScript. The project creates client-side web parts that can be deployed to SharePoint Online, Microsoft Teams, and Microsoft 365.

## Environment Requirements

- **Node.js**: 18.17.1 or higher (< 19.0.0) - Project was generated with Node 20.19.5
- **SPFx Version**: 1.19.0
- **TypeScript**: 4.7.4
- **React**: Fluent UI React 8.x


## Build Commands

### Development Workflow
```bash
# Clean build artifacts
gulp clean

# Build TypeScript and bundle
gulp build

# Development build + bundle
npm run build

# Production bundle (minified)
gulp bundle --ship

# Create SharePoint package
gulp package-solution --ship

# Full production build pipeline
gulp build && gulp bundle --ship && gulp package-solution --ship

# Clean rebuild for production
gulp clean && gulp build && gulp bundle --ship && gulp package-solution --ship
```

### Testing
```bash
npm test
# or
gulp test
```

## Architecture

### Project Structure

```
src/webparts/              # Web part components
  └── [webPartName]/       # Individual web part folder
      ├── *.ts             # Web part class (extends BaseClientSideWebPart)
      ├── *.manifest.json  # Web part manifest with metadata
      ├── *.module.scss    # Scoped SCSS styles
      ├── loc/             # Localization resources
      │   ├── mystrings.d.ts    # String interface definitions
      │   └── [locale].js       # Locale-specific strings (e.g., en-us.js)
      └── assets/          # Images and static resources

config/                    # Build and deployment configuration
  ├── config.json          # Bundle and component configuration
  ├── package-solution.json # SharePoint package metadata
  └── serve.json           # Local dev server settings

lib/                       # Compiled TypeScript output (generated)
dist/                      # Bundled assets (generated)
temp/                      # Temporary build files (generated)
sharepoint/solution/       # Final .sppkg package (generated)
```

### Web Part Architecture

Web parts extend `BaseClientSideWebPart<TProps>` from `@microsoft/sp-webpart-base`:

1. **Lifecycle Methods**:
   - `onInit()`: Initialize web part, fetch data, set up context
   - `render()`: Render DOM (traditional HTML) or React component
   - `onThemeChanged()`: Handle theme changes (light/dark mode)

2. **Configuration**:
   - `getPropertyPaneConfiguration()`: Define property pane controls
   - Web part properties typed via interface passed as generic parameter

3. **Context Access**:
   - `this.context.pageContext`: User info, site context, web info
   - `this.context.sdks.microsoftTeams`: Teams context when hosted in Teams/Outlook/Office
   - `this.context.isServedFromLocalhost`: Detect local vs. production

4. **Multi-Platform Support**:
   - Web parts support SharePoint, Teams (Personal App & Tab), SharePoint Full Page
   - Defined in manifest's `supportedHosts` array
   - Use `this.context.sdks.microsoftTeams` to detect and handle Teams context

### Styling

- Uses SCSS modules with `@microsoft/sp-office-ui-fabric-core`
- Theme-aware via CSS custom properties: `--bodyText`, `--link`, `--linkHovered`
- TypeScript type definitions auto-generated for SCSS classes (`.module.scss.ts`)
- Import pattern: `import styles from './Component.module.scss'`

### Localization

- String resources defined in `loc/mystrings.d.ts` interface
- Implementations in `loc/[locale].js` (e.g., `en-us.js`)
- Module declaration pattern allows type-safe imports:
  ```typescript
  import * as strings from 'ComponentWebPartStrings';
  ```

### Bundle Configuration

The `config/config.json` defines how web parts are bundled:
- Maps entry points (`lib/**/*.js`) to source manifests (`src/**/*.manifest.json`)
- Externals configuration for shared dependencies
- Localized resource paths with `{locale}` placeholder

## TypeScript Configuration

### Compiler Options (tsconfig.json)
- Target: ES5 for broad compatibility
- Module: ESNext with node resolution
- JSX: React
- Decorators: Enabled (experimental)
- Output: `lib/` directory
- Extends: `@microsoft/rush-stack-compiler-4.7/includes/tsconfig-web.json`

### Suppressing Strict Checks

Per README, to suppress TypeScript strict errors (use sparingly):
```json
"compilerOptions": {
  "noUnusedLocals": false,
  "strictNullChecks": false
}
```

## ESLint Configuration

- Extends `@microsoft/eslint-config-spfx` with strict TypeScript rules
- Key enforced rules:
  - No `any` types (warning)
  - No floating promises (error)
  - Explicit function return types (warning)
  - No `var` keyword - use `let`/`const` (error)
  - Proper null/undefined handling via `@rushstack/no-new-null`

## Deployment

### Package Creation
1. Production bundle: `gulp bundle --ship`
2. Create package: `gulp package-solution --ship`
3. Package location: `sharepoint/solution/*.sppkg`

### Package Configuration
- **skipFeatureDeployment**: true - Allows tenant-wide deployment
- **includeClientSideAssets**: true - Assets bundled in package
- **isDomainIsolated**: false - Runs in standard context

### Deployment Target
Upload `.sppkg` file to SharePoint App Catalog for tenant-wide availability.

## SharePoint Deployment: Critical Cache-Busting Strategy

### The Problem: Aggressive Manifest Caching

SharePoint aggressively caches SPFx solution manifests and client-side assets. When you rebuild and redeploy a package **with the same version number**, SharePoint may continue serving the old cached version, leading to runtime errors.


**CRITICAL: Always increment the version number when redeploying a package to SharePoint.**

#### Step 1: Update Version in `config/package-solution.json`

Change both the solution version and feature version REVISION:

```json
{
  "solution": {
    "version": "1.0.1.0"  // Increment minor version: 1.0.0.0 → 1.0.1.0
  },
  "features": [
    {
      "version": "1.0.1.0"  // Must match solution version
    }
  ]
}
```

**Version Numbering Convention:**
- Format: `MAJOR.MINOR.PATCH.REVISION`
- **Patch increment** (1.0.0.0 → 1.0.1.0): Bug fixes, cache-busting rebuilds
- **Minor increment** (1.0.0.0 → 1.1.0.0): New features, non-breaking changes
- **Major increment** (1.0.0.0 → 2.0.0.0): Breaking changes, major refactoring
- update the actual version in ShnitzelTestWebPart innerHTML

## Additional Resources

- Full deployment guide: `rag/DEPLOYMENT.md`
- Implementation plan: `rag/plan.md`
- Implementation summary: `rag/summary.md`
