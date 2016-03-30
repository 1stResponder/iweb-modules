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
define(["iweb/CoreModule", "./UndoRedoStack"], function(Core, UndoRedoStack) {
	
	AddFeaturesAction = function(features) {
		this.features = features;
	};
	
	AddFeaturesAction.prototype.undo = function () {
		var source = Core.Ext.Map.getSource();
		this.features.forEach(source.removeFeature, source);
	};
	
	AddFeaturesAction.prototype.redo = function () {
		var source = Core.Ext.Map.getSource();
    	source.addFeatures(this.features);
	};
	
	RemoveFeaturesAction = function(features) {
		this.features = features;
	};
	
	RemoveFeaturesAction.prototype.undo = function () {
		var source = Core.Ext.Map.getSource();
    	source.addFeatures(this.features);
	};
	
	RemoveFeaturesAction.prototype.redo = function () {
		var source = Core.Ext.Map.getSource();
		this.features.forEach(source.removeFeature, source);
	};
	
	ChangeFeaturesAction = function(actions) {
		this.actions = actions;
	};
	
	ChangeFeaturesAction.prototype.undo = function () {
		this.actions.forEach(function(action){
			action.feature.set(action.key, action.oldValue);
		}, this);
	};
	
	ChangeFeaturesAction.prototype.redo = function () {
		this.actions.forEach(function(action){
			action.feature.set(action.key, action.newValue);
		}, this);
	};
	
	
	
    return Ext.define(null, {
       extend: 'Ext.app.ViewController',
       
       keys:[],
       stacks: [],
       
       activeStack: null,
       defaultStack: null,
       
       busy: false,
       
       init: function() {
           this.activeStack = this.defaultStack = new UndoRedoStack();
           
    	   this.bufferedOnMapFeatureAdd = Ext.Function.createInterceptor(
    			   this.createBuffered(this.bufferedOnMapFeatureAdd, 0, this),
    			   this.busyInterceptor, this);
    	   
    	   this.bufferedOnMapFeatureRemove = Ext.Function.createInterceptor(
    			   this.createBuffered(this.bufferedOnMapFeatureRemove, 0, this),
    			   this.busyInterceptor, this);
    	   
    	   this.bufferedOnMapFeatureChange = Ext.Function.createInterceptor(
    			   this.createBuffered(this.bufferedOnMapFeatureChange, 0, this),
    			   this.busyInterceptor, this);
    			   
    			       	   
    	   Core.EventManager.addListener("map-source-set", this.onMapSourceSet.bind(this));
    	   Core.EventManager.addListener("map-layer-remove", this.onMapLayerRemove.bind(this));
       },
       
       getStack: function(obj) {
    	   var idx = this.keys.indexOf(obj);
    	   if (idx == -1) {
    		   var stack = new UndoRedoStack();
    		   this.keys.push(obj);
    		   this.stacks.push(stack);
    		   return stack;
    	   }
    	   return this.stacks[idx];
       },
       
       removeStack: function(obj) {
    	   var idx = this.keys.indexOf(obj);
    	   if (idx != -1) {
    		   this.keys.splice(idx, 1);
    		   this.stacks.splice(idx, 1);
    	   }
       },
       
       busyInterceptor: function(mapEvent) {
    	   //normalize between add/remove and change events 
    	   var feature = mapEvent.feature || mapEvent.target;
    	   
    	   //ignore the event if we are busy or not persisting
    	   return !(this.busy || feature.persistChange == false || feature.removed);
       },

       updateButtonStates: function () {
    	   this.lookupReference("undo").setDisabled(!this.activeStack.canUndo());
    	   this.lookupReference("redo").setDisabled(!this.activeStack.canRedo());
       },
       
       onUndoClick: function() {
    	   //we track 'busy' so we ignore our own changes
    	   this.busy = true;
    	   this.activeStack.undo();
    	   this.busy = false;
    	   
    	   this.updateButtonStates();
       },
       
       onRedoClick: function() {
    	   //we track 'busy' so we ignore our own changes
    	   this.busy = true;
    	   this.activeStack.redo();
    	   this.busy = false;
    	   
    	   this.updateButtonStates();
       },
       
       onMapSourceSet: function(eventName, oldSource, newSource) {
    	   this.unlistenToLayerSource(oldSource)
    	   
    	   //we don't remove old source in case it is set again.
    	   //only cleanup when their layer is removed
    	   var stack = this.defaultStack;
    	   if (newSource != null) {
    		   stack = this.getStack(newSource);
    		   this.listenToLayerSource(newSource)
    	   }
    	   this.activeStack = stack;
    	   
    	   this.updateButtonStates();
       },
       
       onMapLayerRemove: function(eventName, layer) {
    	   this.removeStack(layer.getSource());
       },
       
       listenToLayerSource: function(source) {
    	   if(source){
	    	   source.on("addfeature", this.onMapFeaturesAdd, this);
	    	   source.on("addfeature", this.bufferedOnMapFeatureAdd);
	    	   
	    	   source.on("removefeature", this.onMapFeaturesRemove, this);
	    	   source.on("removefeature", this.bufferedOnMapFeatureRemove);
    	   }
    	   
    	   //note: source's change is currently unreliable in that it doesn't send along what changed
       },
       
       unlistenToLayerSource: function(source) {
    	   if(source){
	    	   source.un("addfeature", this.onMapFeaturesAdd, this);
	    	   source.un("addfeature", this.bufferedOnMapFeatureAdd);
	    	   
	    	   source.un("removefeature", this.onMapFeaturesRemove, this);
	    	   source.un("removefeature", this.bufferedOnMapFeatureRemove);
    	   }
       },
       
       onMapFeaturesAdd: function(event) {
    	   //listen directly to feature to get more detailed events (ex. key, oldValue)
    	   event.feature.on('propertychange', this.bufferedOnMapFeatureChange);
       },
       
       onMapFeaturesRemove: function(event) {
    	   //stop listening on removed items
    	   event.feature.un('propertychange', this.bufferedOnMapFeatureChange);
       },
       
       bufferedOnMapFeatureAdd: function(bufferedEvents) {
    	   var features = bufferedEvents.map(function(event){return event[0].feature});
    	   this.activeStack.addAction(new AddFeaturesAction(features));
    	   this.updateButtonStates();
       },
       
       bufferedOnMapFeatureRemove: function(bufferedEvents) {
    	   var features = bufferedEvents.map(function(event){return event[0].feature});
    	   this.activeStack.addAction(new RemoveFeaturesAction(features));
    	   this.updateButtonStates();
       },
       
       bufferedOnMapFeatureChange: function(bufferedEvents) {
    	   
    	   var actions = bufferedEvents.map(function(eventArgs){
    		   var event = eventArgs[0];
    		   var feature = event.target;
    		   return {
    			   feature: feature,
    			   key: event.key,
    			   oldValue: event.oldValue,
    			   newValue: feature.get(event.key)
    		   };
    	   }, this);
    	   
    	   if (actions.length) {
    		   this.activeStack.addAction(new ChangeFeaturesAction(actions));
    		   this.updateButtonStates();
    	   }
       },
       
       createBuffered: function(fn, buffer, scope) {
           var timerId,
               callArgs = [],
               wrapper = function(){
                   fn.call(scope, callArgs);
                   callArgs = [];
               };

           return function() {
               callArgs.push(Array.prototype.slice.call(arguments, 0))

               if (timerId) {
                   clearTimeout(timerId);
               }

               timerId = setTimeout(wrapper, buffer);
           };
       }

       
    });

});
