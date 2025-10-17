# ShnitzelSPFx


## gulp

gulp clean

gulp build

gulp bundle --ship

gulp package-solution --ship

gulp build ; gulp bundle --ship ; gulp package-solution --ship

gulp clean && gulp build && gulp bundle --ship && gulp package-solution --ship

## suppress ts errors
  "compilerOptions": {
    "noUnusedLocals": false,
    "strictNullChecks":false,

## yo & sp generators for 1.19.0

according to [https://www.npmjs.com/package/@microsoft/generator-sharepoint/v/1.19.0?activeTab=code](sp generator 1.19.0):

* best to have `node 18` (using `node 20`)
* specific matching version : `npm i @microsoft/generator-sharepoint@1.19.0 -g`
* `npm i yeoman-generator@5.10.0 -g`
* `npm i yo@5.0.0 -g`
