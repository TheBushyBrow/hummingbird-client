import Service from 'ember-service';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import Config from 'client/config/environment';

export default Service.extend({
  init() {
    this._super(...arguments);
    if (window.stream !== undefined) {
      const { enabled, config } = get(Config, 'stream.realtime');
      if (!enabled) { return; }
      const environment = Config.isStaging ? 'staging' : Config.environment;
      const { app, key } = get(config, environment);
      const client = window.stream.connect(key, null, app);
      set(this, 'client', client);
    }
  },

  subscribe(feed, id, token, callback) {
    const client = get(this, 'client');
    if (!client) { return; }
    const connection = client.feed(feed, id, token);
    return connection.subscribe(data => callback(data));
  }
});
