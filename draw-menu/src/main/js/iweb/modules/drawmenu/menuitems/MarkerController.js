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
define(["iweb/CoreModule", "iweb/modules/MapModule", "../Interactions", "./MarkerWindow", "./MarkersDefs", "ol"],
		function(Core, MapModule, Interactions, MarkerWindow, markersDefs, ol) {

	return Ext.define("drawmenu.MarkerController", {
		extend: 'Ext.app.ViewController',
		alias: "controller.drawmenu.markerbutton",

		init: function() {
			// don't want to allow user direct user toggling
			this.getView().enableToggle = false;

			MapModule.getMapStyle().addStyleFunction(this.markerStyleFunction.bind(this));
		},

		onClick: function(btn) {

			if (!this.window) {
				this.window = new MarkerWindow(markersDefs);
				this.window.on("marker-clicked", this.windowMarkerClicked, this);
			}
			this.window.show();
		},

		windowMarkerClicked: function(img, height, width, description) {
			this.getView().toggle(true);

			var interaction = this.buildMarkerInteraction(img, height, width, description);
			Core.Ext.Map.setInteractions([interaction]);
		},

		buildMarkerInteraction: function (img, height, width, description) {
			//create temporary style for drawing
			var styleFunction = function(feature, resolution){
				this.onDrawStart(img, height, width, description, feature);
				return this.markerStyleFunction(feature, resolution, false);
			}.bind(this);

			var interaction = Interactions.drawPoint(
					Core.Ext.Map.getSource(), styleFunction);

			interaction.on("drawstart", this.onDrawStart.bind(this, img, height, width, description));
			return interaction;
		},

		onDrawStart: function(img, height, width, description, drawEvent) {
			var feature = drawEvent.feature || drawEvent;
			feature.setProperties({
				type: 'marker',
				graphic: img,
				graphicHeight: height,
				graphicWidth: width,
				description: description
			});
		},

		markerStyleFunction: function (feature, resolution, selected) {
			if (feature.get('type') !== 'marker') {
				return;
			}

			var graphic = feature.get("graphic"),
				rotation = feature.get("rotation") || 0;

			var style = this.buildDefaultMarkerStyle(graphic);
			style.getImage().setRotation(rotation);

			if (selected) {
				var graphicWidth = feature.get("graphicWidth"),
					selectedStyle = this.buildSelectedMarkerStyle();

				return [selectedStyle, style];
			}

			return [style];
		},

		buildDefaultMarkerStyle: function(graphic) {
			return new ol.style.Style({
				image: new ol.style.Icon({
					src: graphic,
					rotation: 0
				})
			});
		},

		buildSelectedMarkerStyle: function() {
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 16,
					fill: new ol.style.Fill({
						color: 'rgba(0, 255, 255, 0.4)'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgb(0, 255, 255)'
					})
				})
			});
		}

	});

});
