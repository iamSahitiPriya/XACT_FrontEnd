


/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


// Added to angular's webpack config by @angular-builders/custom-webpack
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  }
};
