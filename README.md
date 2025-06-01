<div align="center">
	<a href="https://npmjs.com/package/js-craftcms-api"  align="center">
		<img src="https://online-images-sr.netlify.app/assets/ts-craft.png"  alt="Npm Template">
	</a>
	<h1 align="center">js-craftcms-api</h1>
  <p align="center">
    Bring the Craft CMS Querybuilder to your favorite JS Framework.
  </p>
  <br />
</div>

<p align="center">
  <a href="https://npmjs.com/package/js-craftcms-api">
    <img src="https://img.shields.io/npm/v/js-craftcms-api?color=blue" alt="JS Craft CMS API latest version" />
  </a>
  <a href="https://npmjs.com/package/js-craftcms-api" rel="nofollow">
    <img src="https://img.shields.io/npm/d18m/js-craftcms-api?color=blue" alt="JS Craft CMS API downloads">
  </a>
  <a href="https://npmjs.com/package/js-craftcms-api" rel="nofollow">
    <img src="https://img.shields.io/github/license/samuelreichor/js-craftcms-api?color=blue" alt="JS Craft CMS API license">
  </a>
</p>

> [!WARNING]
> This package is no longer actively maintained. Please use the new **[`@query-api/js`](https://github.com/samuelreichor/query-api/tree/main/packages/js)** instead. It's designed to be a drop-in replacement.

-----

## Why the Change?

Hi there! If you've found this package, thanks so much for checking it out. I've recently re-evaluated my code architecture and decided to adopt a monorepo approach for all the JavaScript SDKs. This change allows for better maintainability and collaboration across related projects.

The package you're likely looking for is the new **[`@query-api/js`](https://github.com/samuelreichor/query-api/tree/main/packages/js)**. It's designed to seamlessly replace `js-craftcms-api`.

-----

## Migration Guide

Migrating to the new package is straightforward:

1.  **Update Imports:** Replace all instances of `js-craftcms` in your import statements with `@query-api/js`.
    ```typescript
    // Before
    import { someFeature } from 'js-craftcms';
    // After
    import { someFeature } from '@query-api/js';
    ```

-----

## Need Help?

I apologize for any inconvenience this transition may cause. If you encounter any issues during the migration or have questions, please don't hesitate to reach out\!

Happy coding!