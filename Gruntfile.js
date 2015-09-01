var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.finite_metal/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'com.wondible.pa.finite_metal/**',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
    },
    jsonlint: {
      all: {
        src: [
          'pa/effects/**/*.json',
          'pa/terrain/**/*.json',
          'pa/ammo/**/*.json',
          'pa/tools/**/*.json',
          'pa/units/**/*.json'
        ]
      },
    },
    json_schema: {
      all: {
        files: {
          'lib/schema.json': [
            'pa/effects/**/*.json',
            'pa/terrain/**/*.json',
            'pa/ammo/**/*.json',
            'pa/tools/**/*.json',
            'pa/units/**/*.json'
          ]
        },
      },
    },
    // copy files from PA, transform, and put into mod
    proc: {
      metal_spots: {
        targets: [
          'pa/effects/features/metal_splat_02.json'
        ],
        process: function(spec) {
          spec.reclaimable = true
          spec.damageable = true // required for reclaim
          spec.max_health = 1000
          spec.metal_value = 2000 * spec.max_health * 10
        }
      },
      mex: {
        targets: [
          'pa/units/land/metal_extractor/metal_extractor.json'
        ],
        process: function(spec) {
          delete spec.production
          spec.display_name = "Metal Marker"
          spec.description = "Useful to make a fabber visit and reclaim metal spots"
          // sometimes a fabber gets lucky and builds one
          spec.build_metal_cost = 1
          spec.max_health = 1
          spec.passive_health_regen = -1
        }
      },
      advmex: {
        targets: [
          'pa_ex1/units/land/metal_extractor_adv/metal_extractor_adv.json'
        ],
        process: function(spec) {
          delete spec.unit_types
        }
      },
      jig: {
        targets: [
          'pa_ex1/units/orbital/mining_platform/mining_platform.json'
        ],
        process: function(spec) {
          delete spec.production.metal
          spec.build_metal_cost = 1500
          spec.description = "Gas mining satellite produces energy while providing orbital energy and metal storage."
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-json-schema');

  grunt.registerMultiTask('proc', 'Process unit files into the mod', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['proc', 'json_schema', 'jsonlint', 'copy:mod']);

};

