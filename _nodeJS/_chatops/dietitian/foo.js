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



////////test///////////////


var sc = new SessionCtr();

var session = sc.get('jun.moriyama@dir-bi.co.jp');

console.log(session); 

session.set('foo','foo-val');

console.log(session); 



