/*
 *  /MathJax/jax/element/mml/optable/MiscTechnical.js
 *
 *  Copyright (c) 2009-2016 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function(a) {
  var c = a.mo.OPTYPES;
  var b = a.TEXCLASS;
  MathJax.Hub.Insert(a.mo.prototype, {
    OPTABLE: {
      postfix: {
        "\u23B4": c.WIDEACCENT,
        "\u23B5": c.WIDEACCENT,
        "\u23DC": c.WIDEACCENT,
        "\u23DD": c.WIDEACCENT,
        "\u23E0": c.WIDEACCENT,
        "\u23E1": c.WIDEACCENT
      }
    }
  });
  MathJax.Ajax.loadComplete(a.optableDir + "/MiscTechnical.js");
})(MathJax.ElementJax.mml);
