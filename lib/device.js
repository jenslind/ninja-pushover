var stream = require('stream')
  , util = require('util')
  , Pushover = require('node-pushover');

// Give our device a stream interface
util.inherits(Device,stream);

// Export it
module.exports=Device;

/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the Ninja Platform
 *
 * @fires data - Emit this when you wish to send data to the Ninja Platform
 */
function Device(token, user) {

  var self = this;

  // This device will emit data
  this.readable = true;
  // This device can be actuated
  this.writeable = true;
  
  this._token = token;
  this._user = user;

  this.G = "0"; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 2000; // 2000 is a generic Ninja Blocks sandbox device
  this.name = "Pushover";

  process.nextTick(function() {

    //self.emit('data',key);
    
  });
};

/**
 * Called whenever there is data from the Ninja Platform
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
Device.prototype.write = function(data) {

	this.emit('data',data);
	console.log(data);
    // I'm being actuated with data!
    //console.log("Key:"+this._key+" Data:"+data);
    console.log("Sending pushover");
    var push = new Pushover({
	   token: this._token,
	   user: this._user
    });
    push.send("Ninjablocks", data);
};
