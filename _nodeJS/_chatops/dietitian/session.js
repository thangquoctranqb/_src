var SessionCtr = (function() {
  var SessionCtr = function() {
  	this.hashMap = {};
  };
  var p = SessionCtr.prototype;
  p.get = function(accountId) {
  	var session = this.hashMap[accountId]
  	if( !session ){
  		session = new Session(accountId);
  		this.hashMap[accountId] = session;
  	}
  	return session;
  };
  return SessionCtr;
})();

var Session = (function() {
  var Session = function(accountId) {
        this.accountId = accountId;
        this.hashMap = {};
  };
  var p = Session.prototype;
  p.get = function(key) {
  	return this.hashMap[key];
  };
  p.set = function(key,val) {
  	this.hashMap[key]=val;
  };
  return Session;
})();


