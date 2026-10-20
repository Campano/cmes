// Blog plugin served at the site root so posts keep their WordPress URLs
// (/{category}/{slug}/) and category tags live at /{category}/.
// Drops the routes that would collide with the home page at "/":
// the tags index and the root pagination (/page/N/).
const blog = require('@docusaurus/plugin-content-blog');

module.exports = async function blogAtRoot(context, options) {
  const plugin = await blog.default(context, options);
  return {
    ...plugin,
    contentLoaded: ({actions, ...args}) =>
      plugin.contentLoaded({
        ...args,
        actions: {
          ...actions,
          addRoute: (route) =>
            route.component === options.blogTagsListComponent || /^\/page\/\d+\/?$/.test(route.path)
              ? undefined
              : actions.addRoute(route),
        },
      }),
  };
};

module.exports.validateOptions = blog.validateOptions;
