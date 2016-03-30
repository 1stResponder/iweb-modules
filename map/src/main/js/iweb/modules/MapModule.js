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
requirejs.config({
	paths: {
		'ol': 'lib/ol/ol'
	}
});

define([
	"iweb/CoreModule", "./map/MapController", "./map/MapViewer", "./map/MapStyle",
	"./map/ClickListener", "./map/DefaultDetailRenderer"], 
	function(Core, MapController, MapViewer, MapStyle,
			ClickListener, DefaultDetailRenderer) {
		
		var MapModule = function(){};
		
		MapModule.prototype.load = function(){
			var containerComponent = Core.View.getMainContentComponent();
		
			//Add Map module to main content component
			var mapView = new MapViewer();
			mapView.setMap(containerComponent, -7915207.15, 5211170.84, 7);
	
			this.mapStyle = new MapStyle();
			this.mapController = new MapController(mapView, this.mapStyle);
			this.mapController.bindEvents();
			
			//TODO: refactor away from this
			Core.Ext = Core.Ext || {};
			Core.Ext.Map = this.mapController;
			
			this.clickListener = new ClickListener([new DefaultDetailRenderer()]);
			
			return this.mapController;
		};
		
		MapModule.prototype.getMapController = function(){
			return this.mapController;
		};
		
		MapModule.prototype.getMapStyle = function(){
			return this.mapStyle;
		};
		
		MapModule.prototype.getClickListener = function(){
			return this.clickListener;
		};
		
		MapModule.prototype.getMap = function(){
			return this.mapController.getMap();
		};
		
		return new MapModule();
	}
);
	
