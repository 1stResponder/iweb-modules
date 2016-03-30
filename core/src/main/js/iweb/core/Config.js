/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define([], function(eventManager) {
    "use strict";

    return function Config(eventManager){
    	var config;
    	
    	var configLoadedEvt = 'iweb.config.loaded';
        
        function bindEvent(){
        	eventManager.addListener('config', loadData);
        };
        
        function loadData(e, data){
        	config = data;
        	deepFreeze(config);
        	eventManager.fireEvent(configLoadedEvt, config);
        };
        
        function deepFreeze(o) {
    	  var prop, propKey;
    	  Object.freeze(o); // First freeze the object.
    	  for (propKey in o) {
    	    prop = o[propKey];
    	    if (!o.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
    	      // If the object is on the prototype, not an object, or is already frozen,
    	      // skip it. Note that this might leave an unfrozen reference somewhere in the
    	      // object if there is an already frozen object containing an unfrozen object.
    	      continue;
    	    }

    	    deepFreeze(prop); // Recursively call deepFreeze.
    	  }
    	};
    	
        return {
        	CONFIG_LOADED: configLoadedEvt,
        	
	        init: function(){
	    		bindEvent();
	    	},
	    	
	    	getProperty: function(key){
	    		var keys = key.split(".");
	    		
	    		var value = config[keys[0]];
	    		for(var i=1; i<keys.length; i++){
	    			if(value != null){
	    				value = value[keys[i]];
	    			}else{
	    				return null;
	    			}
	    		}
	    		return value;
	    	}
    	}
    };
    
});