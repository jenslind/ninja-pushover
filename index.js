var Device = require('./lib/device')
  , util = require('util')
  , stream = require('stream')
  , configHandlers = require('./lib/config-handlers');

// Give our driver a stream interface
util.inherits(myDriver,stream);

// Our greeting to the user.
var PHONE_TRACKING_ANNOUNCEMENT = {
  "contents": [
    { "type": "heading",      "text": "Phone-tracker Driver Loaded" },
    { "type": "paragraph",    "text": "The phone-tracker driver has been loaded. You should not see this message again." }
  ]
};

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default driver configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the Ninja Platform
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the Ninja Platform
 */
function myDriver(opts,app) {

  var self = this;
  
  self._app = app;
  self._opts = opts;

  app.on('client::up',function(){

    // The client is now connected to the Ninja Platform

    // Check if we have sent an announcement before.
    // If not, send one and save the fact that we have.
    if (!opts.hasSentAnnouncement) {
      self.emit('announcement',PHONE_TRACKING_ANNOUNCEMENT);
      opts.hasSentAnnouncement = true;
      self.save();
    }

    // Register a device
    
    if(self._opts.token_key) {
    	self.emit('register', new Device(self._opts.token_key, self._opts.user_key));
    }
    console.log(self._opts);
    //self.addKey();
  });
};

/**
 * Called when a user prompts a configuration.
 * If `rpc` is null, the user is asking for a menu of actions
 * This menu should have rpc_methods attached to them
 *
 * @param  {Object}   rpc     RPC Object
 * @param  {String}   rpc.method The method from the last payload
 * @param  {Object}   rpc.params Any input data the user provided
 * @param  {Function} cb      Used to match up requests.
 */
myDriver.prototype.config = function(rpc,cb) {

  var self = this;
  // If rpc is null, we should send the user a menu of what he/she
  // can do.
  // Otherwise, we will try action the rpc method
  if (!rpc) {
    //return configHandlers.menu.call(this,cb);
    return cb(null,{"contents":[
      { "type": "submit", "name": "Add pushover API key.", "rpc_method": "addAPIKey" }
    ]});
  }
  
  switch(rpc.method) {
	  case 'addAPIKey':
	    cb(null, {
		  "contents":[
            { "type": "paragraph", "text":"Please enter your pushover user and token keys."},
            { "type": "input_field_text", "field_name": "token_key", "value": "", "label": "Token key:", "placeholder": "Token key", "required": true},
            { "type": "input_field_text", "field_name": "user_key", "value": "", "label": "User key:", "placeholder": "User key", "required": true},
            { "type": "submit", "name": "Add", "rpc_method": "addKeys" }
          ]
	    });
	    break;
	  case 'addKeys':
	    self.addKeys(rpc.params.token_key, rpc.params.user_key);
	    
	    cb(null, {
		  "contents": [
		    { "type":"paragraph", "text":"Your api key has been saved." },
		    { "type":"close", "text":"Close" }
		  ]    
	    });
	  
	  default:
	    console.log('Error unknown rpc method');
  }
  
};

myDriver.prototype.addKeys = function(token_key, user_key) {
	this._opts.token_key = token_key;
	this._opts.user_key = user_key;
	this.save();
	this.emit('register', new Device(token_key, user_key));
}


// Export it
module.exports = myDriver;