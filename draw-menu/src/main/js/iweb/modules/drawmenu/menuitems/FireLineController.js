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
define(["iweb/CoreModule", "iweb/modules/MapModule", "../Interactions"],
		function(Core, MapModule, Interactions) {
    return Ext.define("drawmenu.FireLineController", {
       extend: 'Ext.app.ViewController',
       alias: "controller.drawmenu.firelinebutton",
       
       selectedInteraction: null,
       
       init: function() {
          
    	   MapModule.getMapStyle().addStyleFunction(this.primaryFirelineStyleFunction.bind(this));
    	   MapModule.getMapStyle().addStyleFunction(this.secondaryFirelineStyleFunction.bind(this));
    	   MapModule.getMapStyle().addStyleFunction(this.actionPointStyleFunction.bind(this));
    	   
    	  var defaultTool = this.getView().menu.lookupReference("planned");
    	  this.updateButton(this.getView(), defaultTool);
    	  defaultTool.toggle(true, true);
    	  this.selectedInteraction = this.buildLineInteraction(
   			   "#000000", 7, 'primary-fire-line', defaultTool.tooltip);
       },
       
       updateButton: function(parent, button) {
    	   parent.setIcon(button.icon);
    	   parent.setIconCls(button.iconCls);
    	   parent.setTooltip(button.tooltip);
       },
       
       onToggle: function(btn, pressed) {
    	   if (!pressed) return;
    	   
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);
       },
       
       onPlannedClick: function(btn) {    	   
    	   this.selectedInteraction = this.buildLineInteraction(
    			   "#000000", 7, 'primary-fire-line', btn.tooltip);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);
    	   
    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },
       
       onSecondaryClick: function(btn) {
    	   this.selectedInteraction = this.buildLineInteraction(
    			   "#000000", 5, 'secondary-fire-line', btn.tooltip);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);
    	   
    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },
       
       onCompletedFireClick: function(btn) {
    	   this.selectedInteraction = this.buildLineInteraction(
		   		"#000000", 3, undefined, btn.tooltip);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);
    	   
    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },
       
       onSpreadClick: function(btn) {
    	   this.selectedInteraction = this.buildLineInteraction(
		   		"#FFA500", 3, undefined, btn.tooltip);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);
    	   
    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },
       
       onActionPointClick: function(btn) {
    	   this.selectedInteraction = this.buildLineInteraction(
    			"#FFA500", 7, 'action-point', btn.tooltip);
    	   Core.Ext.Map.setInteractions([this.selectedInteraction]);
    	   
    	   this.updateButton(this.getView(), btn);
    	   this.getView().toggle(true);
       },
       
       onCompletedDozerClick: function(btn) {

       },
       
       onProposedDozerClick: function(btn) {

       },
       
       onFireEdgeClick: function(btn) {

       },
       
       buildLineInteraction: function (color, strokeWidth, dashStyle, description) {
    	   var interaction = Interactions.drawLine(
    			   Core.Ext.Map.getSource(), Core.Ext.Map.getStyle);
    	   
    	   interaction.on("drawstart",
    			   this.onDrawStart.bind(this, color, strokeWidth, dashStyle, description));
    	   return interaction;
       },
       
       onDrawStart: function(color, strokeWidth, dashStyle, description, drawEvent) {
    	   
    	   var feature = drawEvent.feature;
		   feature.setProperties({
			   type: 'sketch',
			   strokeWidth: strokeWidth,
			   strokeColor: color,
			   dashStyle: dashStyle,
			   description: description
		   });
       },
       
       primaryFirelineStyleFunction: function (feature, resolution, selected) {
			if (! (feature.get('type') === 'sketch'
				&& feature.get("dashStyle") === 'primary-fire-line')) {
				return;
			}
			
			var strokeColor = feature.get("strokeColor"),
				strokeWidth = feature.get("strokeWidth");
			
			if (selected) {
				strokeColor = "aqua";
			}

			var style = this.buildDefaultLineStyle();
			var stroke = style.getStroke();
			stroke.setColor(strokeColor);
			stroke.setWidth(strokeWidth);
			stroke.setLineDash([strokeWidth, 20]);
			stroke.setLineCap('butt');
			
			//we add a non-dashed, nearly invisible line to make
			//hit detection more user friendly
			var invisibleStyle = this.buildDefaultLineStyle();
			invisibleStyle.getStroke().setColor("rgba(0, 0, 0, 0.01)")
			
			return [invisibleStyle, style];
       },
       
       secondaryFirelineStyleFunction: function (feature, resolution, selected) {
			if (! (feature.get('type') === 'sketch'
				&& feature.get("dashStyle") === 'secondary-fire-line')) {
				return;
			}
			
			var strokeColor = feature.get("strokeColor"),
				strokeWidth = feature.get("strokeWidth");
			
			if (selected) {
				strokeColor = "aqua";
			}

			var style = this.buildDefaultLineStyle();
			var stroke = style.getStroke();
			stroke.setColor(strokeColor);
			stroke.setWidth(strokeWidth);
			stroke.setLineDash([0.5, 30]);
			stroke.setLineCap('round');
			
			//we add a non-dashed, nearly invisible line to make
			//hit detection more user friendly
			var invisibleStyle = this.buildDefaultLineStyle();
			invisibleStyle.getStroke().setColor("rgba(0, 0, 0, 0.01)")
			
			return [invisibleStyle, style];
       },
       
       actionPointStyleFunction: function (feature, resolution, selected) {
			if (! (feature.get('type') === 'sketch'
				&& feature.get("dashStyle") === 'action-point')) {
				return;
			}
			
			var strokeColor = feature.get("strokeColor"),
				strokeWidth = feature.get("strokeWidth");
			
			if (selected) {
				strokeColor = "aqua";
			}

			var outlineStyle = this.buildDefaultLineStyle();
			outlineStyle.getStroke().setColor('black');
			outlineStyle.getStroke().setWidth(strokeWidth);

			var lineStyle = this.buildDefaultLineStyle();
			lineStyle.getStroke().setColor(strokeColor);
			lineStyle.getStroke().setWidth(strokeWidth - 2);
			
			var pointStyle = new ol.style.Style({
				image: new ol.style.Circle({
					radius: strokeWidth,
					fill: new ol.style.Fill({
						color: strokeColor
					})
				}),
				geometry: function(feature) {
					var coords = feature.getGeometry().getCoordinates();
					return new ol.geom.MultiPoint([coords[0], coords[coords.length-1]]);
				}
			});
			
			return [outlineStyle, lineStyle, pointStyle];
       },
       
		buildDefaultLineStyle: function() {
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'black',
					width: 9
				})
			});
		}
    });

});
