var myShape;try{var autobahn=require("autobahn")}catch(e){}var sess,connection=new autobahn.Connection({url:"ws://capricorn.or.gs:8080/ws",realm:"tradingpit"});connection.onopen=function(e){function n(e,t,n){$(".value").html(t.reserve)}function r(e,t,n){$("#time").html(t.minutes+":"+t.seconds);console.log("tick")}function i(e,t,n){$.get("offer_template.html",function(e){Mustache.parse(e);var n=Mustache.render(e,t);$(".flex-offers").html(n)})}sess=e;var t=null;sess.call("pit.rpc.signin",[],{name:"QT",position:0,role:"buyer",id:sess.id,meat:"true"}).then(function(e){sess.subscribe(e.cardURI,n);myShape=e.shape;$(".my-logoDiv").load("shapes.html  #"+myShape)});e.subscribe("pit.pub.offers",i).then(function(e){t=e},function(e){});e.subscribe("pit.pub.clock",r).then(function(e){t=e},function(e){})};connection.open();