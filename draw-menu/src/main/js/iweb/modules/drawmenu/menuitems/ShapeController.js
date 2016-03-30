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
define(["iweb/CoreModule", "iweb/modules/MapModule", "../Interactions", "ol"],
		function(Core, MapModule, Interactions, ol) {
    return Ext.define("drawmenu.ShapeController", {
       extend: 'Ext.app.ViewController',
       alias: "controller.drawmenu.shapebutton",

       selectedInteraction: null,
       featureInProgress: null,
       drawingColor: null,

       init: function() {

    	   MapModule.getMapStyle().addStyleFunction(this.shapeStyleFunction.bind(this));

    	  var defaultTool = this.getView().menu.lookupReference("vectorPolygon");
    	  this.updateButton(this.getView(), defaultTool);
    	  defaultTool.toggle(true, true);
    	  this.selectedInteraction = this.buildPolygonInteraction();

    	  this.drawingColor = Core.Ext.Map.getDrawingColor();
    	  Core.EventManager.addListener("map-color-change", this.onMapColorChange.bind(this));
       },

       updateButton: function(parent, button) {
    	   parent.setIcon(button.icon);
    	   parent.setTooltip(button.tooltip);
       },

       onToggle: function(btn, pressed) {
    	   if (!pressed) return;

    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);
       },

       onVectorPolygonClick: function(btn) {

    	   this.selectedInteraction = this.buildPolygonInteraction();
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);

    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },

       onCircleClick: function(btn) {

    	   this.selectedInteraction = this.buildRegularPolyInteraction("circle", 40);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);

    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },

       onTriangleClick: function(btn) {

    	   this.selectedInteraction = this.buildRegularPolyInteraction("triangle", 3);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);

    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },

       onSquareClick: function(btn) {

    	   this.selectedInteraction = this.buildRegularPolyInteraction("square", 4);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);

    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },

       onHexagonClick: function(btn) {

    	   this.selectedInteraction = this.buildRegularPolyInteraction("hexagon", 6);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);

    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },

       buildPolygonInteraction: function () {
    	   var interaction = Interactions.drawPolygon(
    			   Core.Ext.Map.getSource(), Core.Ext.Map.getStyle);

    	   interaction.on("drawstart", this.onDrawStart.bind(this, "polygon"));
    	   interaction.on("drawend", this.onDrawEnd.bind(this));
    	   return interaction;
       },

       buildRegularPolyInteraction: function (type, sides) {
    	   var interaction = Interactions.drawRegularPoly(
    			   Core.Ext.Map.getSource(), Core.Ext.Map.getStyle, sides);

    	   interaction.on("drawstart", this.onDrawStart.bind(this, type));
    	   interaction.on("drawend", this.onDrawEnd.bind(this));
    	   return interaction;
       },

       onDrawStart: function(type, drawEvent) {

    	   var feature = drawEvent.feature;
		   feature.setProperties({
			   type: type,
			   strokeWidth: 3,
			   strokeColor: this.drawingColor,
			   fillColor: this.drawingColor,
			   opacity: 0.4
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
    		   this.featureInProgress.set("strokeColor", color);
    		   this.featureInProgress.set("fillColor", color);
    	   }
       },

		shapeStyleFunction: function (feature, resolution, selected) {
			var type = feature.get('type');
			if ( !(type === 'polygon' || type === 'circle'
				|| type === 'triangle' || type === 'square'
				|| type === 'hexagon') ) {
				return;
			}

			var fillColor = feature.get("fillColor"),
				opacity = feature.get("opacity"),
				strokeColor = feature.get("strokeColor"),
				strokeWidth = feature.get("strokeWidth");

			if (selected) {
				fillColor = "#00FFFF";
				strokeColor = "aqua";
			}

			var style = this.buildDefaultShapeStyle();
			style.getStroke().setColor(strokeColor);
			style.getStroke().setWidth(strokeWidth);

			if (opacity != undefined && opacity !== 1
					&& fillColor != undefined) {
				var rgbArray = MapModule.getMapStyle().getRGBComponents(fillColor);
				style.getFill().setColor(rgbArray.concat(opacity));
			} else {
				style.getFill().setColor(fillColor);
			}

			return [style];
		},

		buildDefaultShapeStyle: function() {
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'black'
				}),
				stroke: new ol.style.Stroke({
					color: 'black',
					width: 3
				})
			});
		}

    });

});
