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
define(["iweb/CoreModule", "iweb/modules/MapModule", "../Interactions", "./LabelWindow", "ol"],
		function(Core, MapModule, Interactions, LabelWindow, ol) {
    return Ext.define("drawmenu.LabelController", {
       extend: 'Ext.app.ViewController',
       alias: "controller.drawmenu.labelbutton",

       featureInProgress: null,
       drawingColor: null,

       init: function() {
    	   // don't want to allow user direct user toggling
    	   this.getView().enableToggle = false;

    	   MapModule.getMapStyle().addStyleFunction(this.labelStyleFunction.bind(this));

    	  this.drawingColor = Core.Ext.Map.getDrawingColor();
    	  Core.EventManager.addListener("map-color-change", this.onMapColorChange.bind(this));
       },

       onClick: function(btn) {

    	   if (!this.window) {
        	   this.window = new LabelWindow();
        	   this.window.on("label-set", this.windowLabelSet, this);
    	   }
    	   this.window.show();
       },

       windowLabelSet: function(window, text, size) {
    	   this.getView().toggle(true);

    	   var interaction = this.buildLabelInteraction(text, size);
    	   Core.Ext.Map.setInteractions([interaction]);
       },


       buildLabelInteraction: function (text, labelSize) {
				//create temporary style for drawing
				var styleFunction = function(feature, resolution){
					this.onDrawStart(text, labelSize, feature);
					return this.labelStyleFunction(feature, resolution, false);
				}.bind(this);

    	   var interaction = Interactions.drawPoint(
    			   Core.Ext.Map.getSource(), styleFunction);

    	   interaction.on("drawstart", this.onDrawStart.bind(this, text, labelSize));
    	   interaction.on("drawend", this.onDrawEnd.bind(this));
    	   return interaction;
       },

       onDrawStart: function(text, labelSize, drawEvent) {

				var feature = drawEvent.feature || drawEvent;
		   feature.setProperties({
				type: 'label',
				labelText: text,
				labelSize: labelSize,
				fillColor: this.drawingColor
		   });
		   this.featureInProgress = feature;
       },

       onDrawEnd: function (drawEvent) {
    	   this.featureInProgress = null;
       },

       onMapColorChange: function(eventName, color) {
    	   this.drawingColor = color;

    	   //if there is feature drawing in progress, update it immediately
    	   if(this.featureInProgress){
    		   this.featureInProgress.set("fillColor", color);
    	   }
       },

		labelStyleFunction: function (feature, resolution, selected) {
			if (feature.get('type') !== 'label') {
				return;
			}

			var style = this.buildDefaultLabelStyle();

			var labelText = feature.get("labelText"),
				labelSize = feature.get("labelSize"),
				rotation = feature.get("rotation") || 0,
				fillColor = feature.get("fillColor"),
				strokeColor = "white";

			if (selected) {
				fillColor = "aqua";
				strokeColor = "black";
			}

			var textStyle = style.getText();
			textStyle.setText(labelText);
			textStyle.setRotation(rotation);
			textStyle.setFont(labelSize + 'px arial');

			textStyle.getFill().setColor(fillColor);
			textStyle.getStroke().setColor(strokeColor);

			return [style];
		},

		buildDefaultLabelStyle: function() {
			return new ol.style.Style({
				text: new ol.style.Text({
					text: 'Empty Text',
					rotation: 0,
					fill: new ol.style.Fill({
						   color: 'aqua'
						}),
					stroke: new ol.style.Stroke({
						color: 'black',
						width: 2
					}),
					scale: 1,
					font: '12px arial'
				})
			});
		}

    });

});
