# ShnitzelSPFx

playing with claude code to build spfx, copying desing from [this htmlcodex](https://htmlcodex.com/demo/?item=2384)

see `rag` to learn to talk specifically enough with claude.

## Youtubes (HEBREW)
* part of [O365 playlist](https://www.youtube.com/playlist?list=PLbZpz8SE2dleEZQuvHvC60eKkFoGSDLSs) 
* also visit [AI dev playlist](https://www.youtube.com/playlist?list=PLbZpz8SE2dldzAQcmHgz-05hyJ0-nRyLL) 


## Conclusion

while claude did amazing job with spfx generaly for me, for the UI it had a hard time. i think next time i should take the entile html solution from desing and delute to specific element (per element) and save it as an html template and tell claude to copy and populate. this conclusion is general and not only for this project. also there is some pixel perfect mcp you can use (google it).

i still prefer my solution of hosting angular inside spfx. it seems the AI's have better training with them and generaly much easier to dev and deploy.

also... `ShintzelTableWebPart.ts` line 155 to match hebrew created fields internal names.

### never create column not in ENGLISH
change display name later


## gulp

gulp clean

gulp build

gulp bundle --ship

gulp package-solution --ship

#### CMD:
gulp build ; gulp bundle --ship ; gulp package-solution --ship

#### PS:
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
