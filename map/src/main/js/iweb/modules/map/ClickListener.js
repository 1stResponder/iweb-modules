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
define(['ext', 'iweb/CoreModule'], function(Ext, Core){
	
	return Ext.define('map.ClickListener', {
		
		constructor: function(renderers) {
			this.renderers = renderers;
			this.activeFeature = null;
			this.activeSource
			
			this.container = new Ext.panel.Panel({
				title: 'Feature Details',
				width: 400,
				componentCls:'form-feature-detail',
				renderTo: Ext.getBody()
			});
			this.addCloseTool();
			
			this.overlay = Core.Ext.Map.getDetailOverlay();
			this.overlay.setElement(this.container.getEl().dom);

			//we listen to the select event so we get click details
			var select = Core.Ext.Map.getSelectInteraction();
			select.on("select", this.onMapViewSelect.bind(this));
			//
			Core.EventManager.addListener("map-view-click", this.onMapViewClick.bind(this));
			Core.EventManager.addListener("map-source-set", this.onMapSourceSet.bind(this));
			Core.EventManager.addListener("map-window-clear", this.onMapWindowClear.bind(this));
			
			this.bufferedRender = Ext.Function.createBuffered(this.render, 100, this);
		},
		
		addRenderer: function(renderer) {
			this.renderers.push(renderer);
		},
		
		onMapWindowClear: function(evt) {
			this.cleanup();
		},
		
		onWindowClose: function() {
			this.cleanup();
		},
		
		/**
		 * Keep track of the last map click location so we can pin our pop-up there
		 * 
		 * NOTE: as of OL3.6, the select event will pass along the mapBrowserEvent
		 * for click details so we can get all the info we need in the select event
		 */
		onMapViewClick: function(eventName, evt) {
			this.lastClickCoord = evt.coordinate;
		},
		
		onMapViewSelect: function(evt) {
			var features = evt.selected;
			
			var handled = false;
			if (features.length) {
				this.activeFeature = features[0];
				
				//make overlay visible first for accurate layout
				this.overlay.setPosition(this.lastClickCoord);
				
				handled = this.render(this.activeFeature);
			}
			
			if (!handled) {
				this.cleanup();
			}
		},
		
		onMapSourceSet: function(eventName, oldSource, source) {
			this.unlistenToSource(oldSource);
			
			//clear the overlay on source change (i.e. change rooms)
			this.cleanup();
			
			this.listenToSource(source);
		},
		
		listenToSource: function(source) {
			if(source){
				source.on('removefeature', this.onRemoveFeature, this);
				source.on('changefeature', this.onChangeFeature, this);
			}
		},
		
		unlistenToSource: function(source) {
			if(source){
				source.un('removefeature', this.onRemoveFeature, this);
				source.un('changefeature', this.onChangeFeature, this);
			}
		},
		
		cleanup: function() {
			//setting position undefined hides the overlay
			this.overlay.setPosition(undefined);
			this.container.removeAll();
			this.activeFeature = null;
		},
		
		onRemoveFeature: function(event) {
			if (event.feature == this.activeFeature) {
				this.cleanup();
			}
		},
		
		onChangeFeature: function(event) {
			if (event.feature == this.activeFeature) {
				this.bufferedRender(this.activeFeature);
				
				var pt = event.feature.getGeometry().getClosestPoint(
							this.overlay.getPosition());
				this.overlay.setPosition(pt);
			}
		},
		
		addCloseTool: function() {
			var useDelegatedEvents = Ext.dom.Element.useDelegatedEvents;
			Ext.dom.Element.useDelegatedEvents = false;
			
			this.container.addTool({
				xtype : 'tool',
				type: 'close',
				scope: this,
				handler: this.onWindowClose
			});
			
			Ext.dom.Element.useDelegatedEvents = useDelegatedEvents;
		},
		
		render: function(feature) {
			/* Note:
			 * during rendering, we want to disable delegated events.
			 * This is because the Openlayers Overlay container we are in will
			 * stop all of our events from propagating to the map, so we need to
			 * handle all the events directly on the elements. */
			var useDelegatedEvents = Ext.dom.Element.useDelegatedEvents;
			Ext.dom.Element.useDelegatedEvents = false;
			
			
			//clear the container before rendering
			this.container.removeAll();
			
			
			var handled = this.delegateRender(this.container, feature)
			
			//reset delegated events value
			Ext.dom.Element.useDelegatedEvents = useDelegatedEvents;
			
			return handled;
		},
		
		delegateRender: function(container, feature) {
			return this.renderers.reduce(function(prev, curr, idx, arr){
				return curr.render.call(curr, container, feature) || prev; 
			}, false);
		}
		
	});

});
