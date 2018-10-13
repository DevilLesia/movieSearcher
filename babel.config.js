const presets = [
    [
      "@babel/preset-env",
      "@babel/env",
      "node6",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        useBuiltIns: "usage",
      },
    ],
  ];

  

  module.exports = { presets };