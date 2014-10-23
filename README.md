# Finite Metal

Metal spots are reclaimable, extractors exist only to help route fabbers to spots.

This mod doesn't include changes to the commander, so you do have a base income to work with.

## Trivia

- It's possible to set feature reclaim value, it's just... odd.  You can get (metal_value/max_health)/10, plus some error based on the build power used.  In the typical case, a feature is either 25/25/10 or 25/10/10 for trees, basically 1 metal if you round up generously, and the fabber error dominates.
- Features must be damageable to be reclaimable.
- If a metal spot is reclaimed, the strategic icon stays, but you can't build on it anymore (very rarely a fabber will lucky when reclaiming-to-build)  Icons do disappear if the feature is destroyed.
- Reclaim rate is limited by build rate - if build speed is being attenuated by lack of metal, reclaim rates will also be reduced, exacerbating the problem.

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:mod - copy the mod files into server_mods
- proc - Proc: copy the base files from PA, modify, and write into mod
- jsonlint - lint all the mod json files
- json_schema - partial validation of mod json files format using schema by exterminans https://forums.uberent.com/threads/wip-units-ammo-and-tools-json-validation-schema.60451/
- default: proc, json_schema, jsonlint, default
