module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 1. Disable CSS minification completely
      webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
        (plugin) => plugin.constructor.name !== 'CssMinimizerPlugin'
      );
      
      // 2. Add custom CSS processing
      webpackConfig.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(loader => {
            if (loader.test && loader.test.toString().includes('css')) {
              loader.use.push({
                loader: 'string-replace-loader',
                options: {
                  search: /content: ["'](.*?\/.*?)["']/g,
                  replace: (match, p1) => `content: "${p1.replace(/\//g, '\\/')}"`,
                  flags: 'g'
                }
              });
            }
          });
        }
      });
      
      return webpackConfig;
    }
  }
};