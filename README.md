# TableFloatingHeader

Creates a clone of the initial table (adds a `.fixed` class to the floating header table and deletes its TBODY), wraps them both into a `div.aggregatedTableContainer` and sets up a resize and scroll listeners.
On resize it recalculates header cells widths and on scroll it checks if the table is hidden under the top of viewport and displays the cloned header. They both use `requestAnimationFrame` for performance on draws.
This function can be called on any aggregated table. It's advised to be used on vertically long tables or in cases when the vertical screen space is quite narrow (e.g. on mobiles). 

## Browser support

Usage of `requestAnimationFrame` limits this script usage to the following browsers

| Browser        | Version       |
| -------------- |--------------:|
| IE             | **10+**           |
| Edge           | 12+           | 
| Chrome         | 10+           |
| Firefox        | 4+            |
| Firefox Android| 49            |
| Safari         | 6+            |
| Opera          | 15+           |
| iOS Safari     | 6.1+          |
| Opera Mini     | **NO**        |
| Opera Mobile   | 37            |
| Android        | **4.4+**          |
| Chrome Android | 53            |
| IE Mobile      | 10            |
| UC Browser Android| 11            |
| Samsung Internet    | 4             |


## Usage

In your bundle project you may install this module by executing `npm install --save confirmitasa/r-table-floating-header` in terminal. In your script :

```javascript
// at the top of the script
import TableFloatingHeader from 'r-table-floating-header';

//in the function to initialise it:
var fHeader = new TableFloatingHeader(document.querySelector('.tableClassYouWantToPass'));
// fHeader.header - the floating table header element
```

If you want to use it separately in your project rather than including into the bundle, build it with `npm install && npm run build`, upload the `css` and `js` files to File Library and reference them on the page.
Then you may call the function under `Reportal` namespace:

``` javascript
var fHeader = new Reportal.TableFloatingHeader(document.querySelector('.tableClassYouWantToPass'));
```

### Commands (configured in package.json)

- `npm install` installs all dependencies of the project
- `npm run build:prd` generates minified build files under `/dist` folder 
- `npm run build:dev` generates build files under `/dist` folder and starts watching all changes made to the project during this session, appending them to the build files
- `npm test` Runs tests that have been written and put into `/src/__tests__` folder. (Note: test should follow name convention: `NameOfClass-test.js` which is a test for `NameOfFile.js`)
- `npm run lint` Lints your JavaScript code placed in src folder.
- `npm run docs` generates documentation for your project `.js` files that use JSDoc3 comments and puls them into `docs` folder
- `npm run docs-commit`  publishes documentation to `http://ConfirmitASA.github.io/[RepoName]/[version]/` where `[RepoName]` is name of your repository as well as name specified in `package.json -> name` AND `[version]` is the version in your `package.json`. 
Please make sure you have the `npm run docs-commit` command configured properly with the correct name of repo to be used there.
