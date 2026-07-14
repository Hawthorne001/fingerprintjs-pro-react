# Contributing to Fingerprint React integration

## Working with code

We prefer using [pnpm](https://pnpm.io/) for installing dependencies and running scripts.

The main branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues, first.

### Development playground

There are 4 demo pages for this integration:

1. In `/examples/create-react-app` folder. It is a rich demo with scenarios of using different caching strategies. You can find more info about configuration and starting demo in the [readme](examples/create-react-app/README.md).
2. In `/examples/next` folder. It is a demo built with NextJS that allows testing SSR scenarios. You can find more info about configuration and starting demo in the [readme](examples/next/README.md).
3. In `/examples/next-appDir` folder. It is the same demo built with NextJS, but with new `app` directory approach. You can find more info about configuration and starting demo in the [readme](examples/next-appDir/README.md).
4. In `/examples/preact` folder. It is a demo built with Preact. You can find more info about configuration and starting demo in the [readme](examples/preact/README.md).
5. In `/examples/webpack-based` folder. It is a simple demo built with raw webpack.

❗ Build projects before testing integration. First build the `@fingerprint/react` package, and then start any of the example apps.

### How to build

Just run:

```shell
pnpm build
```

### Code style

The code style is controlled by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Run to check that the code style is ok:

```shell
pnpm lint
```

You aren't required to run the check manually, the CI will do it. Run the following command to fix style issues (not all issues can be fixed automatically):

```shell
pnpm lint:fix
```

### How to test

Tests are located in `__tests__` folder and run by [vitest](https://vitest.dev/) in [jsdom](https://github.com/jsdom/jsdom) environment.

To run tests you can use IDE instruments or just run:

```shell
pnpm test
```

To check the distributive TypeScript declarations, build the project and run:

```shell
pnpm test:dts
```

### How to publish

Releases are managed with [changesets](https://github.com/changesets/changesets).

When you make a change that should be released, add a changeset to your pull request:

```shell
pnpm changeset
```

This prompts you to select the bump type (`major`, `minor`, or `patch`) and to write a summary that becomes the changelog entry. Commit the generated file in `.changeset/` along with your changes.

When PRs with changesets are merged to `main`, the [release workflow](.github/workflows/release.yml) opens (or updates) a "Version Packages" pull request that bumps the version and updates the changelog. Merging that pull request builds the package and publishes it to NPM.
