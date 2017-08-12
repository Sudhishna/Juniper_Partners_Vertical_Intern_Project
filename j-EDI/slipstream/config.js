var path = require('path');

module.exports = {
	"installed_plugins_path" : path.join(path.dirname(require.main.filename), "public", "installed_plugins"),
	"redis_port": '6379',
	"redis_host": 'localhost'
}