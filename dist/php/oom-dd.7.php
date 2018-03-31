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
    "UUID": {
      "name": "UUID",
      "default": "@TODO",
      "isFn": true,
      "type": "@TODO",
      "typeStr": "String",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "Every Oom instance gets a universally unique ID"
    },
    "INST_INDEX": {
      "name": "INST_INDEX",
      "default": "@TODO",
      "isFn": true,
      "type": "nnint",
      "typeStr": "nnint",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "Every Oom instance gets an instance index, which equals its class’s `inst_tally` at the moment of instantiation. As a side effect of recording `INST_INDEX`, `inst_tally` is incremented"
    },
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
    "fooBar": {
      "name": "fooBar",
      "default": 1000,
      "isFn": false,
      "type": "@TODO",
      "typeStr": "Number",
      "definedIn": "@TODO",
      "definedInStr": "Oom",
      "perClass": true,
      "remarks": "A Number"
    }
  }
}', true);
        }
        //@TODO init the stat and attr objects
    }
};
$oomClasses['Oom.Dd']::init();




//// Made by Oomtility Make 1.3.7 //\\//\\ http://oomtility.loop.coop //////////
?>