"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FULLSTORY_CODE = exports.FULLSTORY_CODE = "(function(m,n,e,t,l,o,g,y){\n  g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];\n  o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';\n  y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);\n  g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){FS(l,v)};\n  g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;FS(o,v)};\n  g.clearUserCookie=function(d,i){d=n.domain;while(1){n.cookie='fs_uid=;domain='+d+\n  ';path=/;expires='+new Date(0);i=d.indexOf('.');if(i<0)break;d=d.slice(i+1)}}\n})(window,document,'FS','script','user')";