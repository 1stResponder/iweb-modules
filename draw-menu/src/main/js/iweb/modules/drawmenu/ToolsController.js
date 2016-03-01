/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
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
define(["iweb/CoreModule", "./Interactions", "./DrawGroup"], function(Core, Interactions, DrawGroup) {
		
    return Ext.define(null, {
       extend: 'Ext.app.ViewController',
       
       disabled: false,
       
       init: function() {
    	   // enable the default 
    	   this.onToggle();
    	   
    	   this.drawGroup = new DrawGroup();
    	   
    	   // we want the draw button to be part of the toggle group
    	   // but don't want to allow user direct user toggling 
    	   this.lookupReference("draw").enableToggle = false;
    	   
    	   Core.EventManager.addListener('map-source-set', this.onSourceSet.bind(this));
       },
       
       onSourceSet: function(evt, oldSource, newSource){
    	   this.disableTools((newSource == null));
       },
       
       disableTools: function(disabled){
    	   if(this.disabled != disabled){
	    	   this.disabled = disabled;
    		   this.setButtonsDisabled(this.view, disabled);
    		   if(this.drawWindow){
    			   this.setButtonsDisabled(this.drawWindow, disabled);
    		   }
    	   }
       },
       
       setButtonsDisabled: function(view, disabled){
    	   Ext.Array.forEach(view.query("button"), function(button){
    		   if(!button.allowReadOnly){
    			   button.setDisabled(disabled);
    		   }
	       });
       },

       onToggle: function() {
           var group = this.getView().defaults.toggleGroup;
    	   var pressed = Ext.ButtonToggleManager.getPressed(group);
    	   if (!pressed) {
    		   this.lookupReference("nav").toggle(true);
    	   }
       },
       
       onNavClick: function(btn, pressed) {
    	   if (!pressed) return;
    	   
           var actions = Core.Ext.Map.getDefaultInteractions();
    	   Core.Ext.Map.setInteractions(actions);
       },
       
       onSelectClick: function(btn, pressed) {
    	   if (!pressed) return;
    	   
    	   var map = Core.Ext.Map.getMap();
    	   var selectedCollection = Core.Ext.Map.getSelection();
           
    	   var defaults = Core.Ext.Map.getDefaultInteractions();
    	   var actions = Interactions.selectBox(map, selectedCollection);
    	   Core.Ext.Map.setInteractions(actions.concat(defaults));
       },
       
       onZoomClick: function(btn, pressed) {
    	   if (!pressed) return;
    	   
           var actions = Interactions.zoomBox();
    	   Core.Ext.Map.setInteractions(actions);
       },
       
       onEraseClick: function(btn, pressed) {
    	   if (!pressed) return;
    	   
    	   var source = Core.Ext.Map.getSource();
    	   var style = Core.Ext.Map.getSelectStyle;
    	   var actions = Interactions.erase(source, style, function(selectedCollection) {
    		   var ttl = "Remove Features?";
               var msg = Ext.String.format(
                   "Do you want to remove the {0} selected features?",
                    selectedCollection.getLength());

               Ext.MessageBox.confirm(ttl, msg, function(id) {
                   if (id === "yes") {
                       //remove all selected features from drawing source
                       selectedCollection.forEach(source.removeFeature, source);
                   }
                   selectedCollection.clear();
               });
    	   });
    	   Core.Ext.Map.setInteractions(actions);
       },
       
       onDrawClick: function(btn) {
    	   
    	   if (!this.drawWindow) {
	    	   //create a drawWindow if it doesn't already exist
	    	   this.drawWindow = new Ext.Window({
					cls: 'draw-window',
					title: 'Draw',
					closeAction: 'hide',
					shadow: false,
					resizable: false,
					renderTo: Ext.getBody(),
					x: 155,
					y: 175
				});
	    	   
	    	   this.drawWindow.on("close", function(){
	    		   btn.toggle(false);
	    	   });
	    	   
	    	   this.drawGroup.on("toggle", this.onDrawGroupToggle, this);
	    	   this.drawWindow.add(this.drawGroup);
    	   }
    	   
    	   this.drawWindow.show();
       },
       
       /**
        * When the draw button is toggled off via an alternate selection
        * in its toggle group, toggle off all DrawGroup buttons
        */
       onDrawToggle: function(btn, pressed) {
    	   if (!pressed) {
               var group = DrawGroup.prototype.defaults.toggleGroup;
        	   var pressed = Ext.ButtonToggleManager.getPressed(group);
        	   if (pressed) {
        		   pressed.toggle(false);
        	   }
    	   }
       },

       /**
        * When a DrawGroup button is toggled, set the draw button to the
        * collective state of the DrawGroup buttons
        * 
        * If nothing is toggled on, toggle draw button off.
        * If something is toggled on, toggle draw button on.
        * 
        */
       onDrawGroupToggle: function(drawBtn, pressed){ 
		   //sync this buttons state 
		   var pressed = Ext.ButtonToggleManager.getPressed(drawBtn.toggleGroup);
		   this.lookupReference("draw").toggle(!!pressed);
       }
       
    });

});
