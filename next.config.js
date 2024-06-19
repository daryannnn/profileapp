const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const nextConfig = {
  reactStrictMode: false,

  webpack(config, { isServer }) {
    config.plugins.push(
        new NextFederationPlugin({
          name: 'profile',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './ProfileUpper': 'src/components/ProfileUpper.tsx',
            './SportsmanSettings': 'src/components/settings/SportsmanSettingsLayout.tsx',
            './OrganizationSettings': 'src/components/settings/OrganizationSettingsLayout.tsx',
            './ProfileCard': 'src/components/ProfileCard.tsx',
            './PhotosSurface': 'src/components/UserPhotosSurface.tsx',
              './LoginForm': 'src/components/Login.tsx',
              './RegistrationForm': 'src/components/Registration.tsx',
              './OrganizationsMap': 'src/components/OrganizationsMap.tsx',
              './SearchOrganizations': 'src/components/search/SearchOrganizations.tsx',
              './SearchSportsmen': 'src/components/search/SearchSportsmen.tsx',
          },
          shared: {},
        })
    );
    config.devServer = {
      client: { overlay: { warnings: false } }
    }

    return config;
  },

  /*webpack: function (config, _) {
      config.devServer = {
          client: { overlay: { warnings: false } }
      }
      return config
  }*/
}

module.exports = nextConfig