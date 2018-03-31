<?php //\\//\\ dist/main/oom-dd.6.js



$oomClasses = Array();



$oomClasses['Oom.Dd'] = new class {
    public static $schema = null;
    public static function init () {
        if (null === self::$schema) {
            self::$schema = json_decode('{
  "stat": {
    "NAME": {
      "name": "NAME",
      "default": "Oom.Dd",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A String"
    },
    "VERSION": {
      "name": "VERSION",
      "default": "1.0.0",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A String"
    },
    "HOMEPAGE": {
      "name": "HOMEPAGE",
      "default": "http://oom-dd.richplastow.com/",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A String"
    },
    "REMARKS": {
      "name": "REMARKS",
      "default": "A VR website for Developing Dreams",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A String"
    },
    "inst_tally": {
      "name": "inst_tally",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "The number of Oom instantiations made so far"
    },
    "hilite": {
      "name": "hilite",
      "default": "#112233",
      "isFn": false,
      "type": "color",
      "typeStr": "color",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "General purpose, useful as a dev label or status"
    },
    "LOADED_FIRST": {
      "name": "LOADED_FIRST",
      "default": true,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Boolean",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A Boolean"
    }
  },
  "attr": {
    "hilite": {
      "name": "hilite",
      "default": "#445566",
      "isFn": false,
      "type": "color",
      "typeStr": "color",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "General purpose, useful as a dev label or status"
    }
  }
}', true);
        }
        //@TODO init the stat and attr objects
    }
};
$oomClasses['Oom.Dd']::init();




$oomClasses['Oom.Dd.Cloud'] = new class {
    public static $schema = null;
    public static function init () {
        if (null === self::$schema) {
            self::$schema = json_decode('{
  "stat": {
    "NAME": {
      "name": "NAME",
      "default": "Oom.Dd.Cloud",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A String"
    },
    "VERSION": {
      "name": "VERSION",
      "default": "1.0.0",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A String"
    },
    "HOMEPAGE": {
      "name": "HOMEPAGE",
      "default": "http://oom-dd.richplastow.com/",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A String"
    },
    "REMARKS": {
      "name": "REMARKS",
      "default": "A single cloud, floating in the DD sky",
      "isFn": false,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A String"
    },
    "inst_tally": {
      "name": "inst_tally",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "The number of Oom instantiations made so far"
    },
    "hilite": {
      "name": "hilite",
      "default": "#112233",
      "isFn": false,
      "type": "color",
      "typeStr": "color",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "General purpose, useful as a dev label or status"
    },
    "LOADED_FIRST": {
      "name": "LOADED_FIRST",
      "default": true,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Boolean",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd",
      "perClass": true,
      "remarks": "A Boolean"
    }
  },
  "attr": {
    "hilite": {
      "name": "hilite",
      "default": "#445566",
      "isFn": false,
      "type": "color",
      "typeStr": "color",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "General purpose, useful as a dev label or status"
    },
    "positionX": {
      "name": "positionX",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A Number"
    },
    "positionY": {
      "name": "positionY",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A Number"
    },
    "positionZ": {
      "name": "positionZ",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A Number"
    },
    "rotationX": {
      "name": "rotationX",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A Number"
    },
    "rotationY": {
      "name": "rotationY",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A Number"
    },
    "rotationZ": {
      "name": "rotationZ",
      "default": 0,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom.Dd.Cloud",
      "perClass": true,
      "remarks": "A Number"
    }
  }
}', true);
        }
        //@TODO init the stat and attr objects
    }
};
$oomClasses['Oom.Dd.Cloud']::init();




//// Made by Oomtility Make 1.3.7 //\\//\\ http://oomtility.loop.coop //////////
?>