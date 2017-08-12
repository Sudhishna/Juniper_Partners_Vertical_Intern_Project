To setup the dev environment for Slipstream framework for the first time:
1. Install [Node.js and NPM](http://nodejs.org/)
2. Make sure your path can find the node and npm commands by adding export PATH="/usr/local/bin:$PATH" to .profile, .bashrc, etc. If all is good, 'node --version' and 'npm --version' should work
3. Install grunt-cli
   * Run npm install -g grunt-cli
4. Grab the slipstream framework from ssd-git or the build tarball
5. Install necessary components for CSS generation
   We use sass to convert .scss files to .css as browsers still understand only CSS
   * Install Ruby
   * Install Ruby Gems
   * Install sass by running '[sudo] gem install sass -v 3.2.13'
   ** Versions of ruby sass greater than 3.2.13 may not work well
6. Generate CSS
   * Run grunt sass:inplace
7. Install Redis Database
   * sudo rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm  
   * yum install redis -y
8. Start the Redis Database
	* redis-server
9. Start the Slipstream server
   * Run node app.js or grunt slipstream
10. Browse to http://localhost:3000