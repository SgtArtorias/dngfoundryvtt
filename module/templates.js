/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Shared Partials
    "systems/dng/templates/actors/parts/active-effects.html",

    // Actor Sheet Partials
    "systems/dng/templates/actors/parts/actor-traits.html",
    "systems/dng/templates/actors/parts/actor-inventory.html",
    "systems/dng/templates/actors/parts/actor-features.html",
    "systems/dng/templates/actors/parts/actor-spellbook.html",

    // Item Sheet Partials
    "systems/dng/templates/items/parts/item-action.html",
    "systems/dng/templates/items/parts/item-activation.html",
    "systems/dng/templates/items/parts/item-description.html",
    "systems/dng/templates/items/parts/item-mountable.html"
  ]);
};
