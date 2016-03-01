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
define(["iweb/CoreModule", "iweb/modules/MapModule", "../Interactions", "ol"],
		function(Core, MapModule, Interactions, ol) {
	return Ext.define("drawmenu.LineController", {
		extend: 'Ext.app.ViewController',
		alias: "controller.drawmenu.linebutton",

		selectedInteraction: null,
		featureInProgress: null,
		drawingColor: null,

		init: function() {

			MapModule.getMapStyle().addStyleFunction(this.lineStyleFunction.bind(this));

			var defaultTool = this.getView().menu.lookupReference("thin");
			this.updateButton(this.getView(), defaultTool);
			defaultTool.toggle(true, true);
			this.selectedInteraction = this.buildLineInteraction(3);

			this.drawingColor = Core.Ext.Map.getDrawingColor();
			Core.EventManager.addListener("map-color-change", this.onMapColorChange.bind(this));
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

		onThinClick: function(btn) {

			this.selectedInteraction = this.buildLineInteraction(3);
			Core.Ext.Map.setInteractions([this.selectedInteraction]);

			this.updateButton(this.getView(), btn);
			this.getView().toggle(true);
		},

		onMediumClick: function(btn) {

			this.selectedInteraction = this.buildLineInteraction(9);
			Core.Ext.Map.setInteractions([this.selectedInteraction]);

			this.updateButton(this.getView(), btn);
			this.getView().toggle(true);
		},

		onThickClick: function(btn) {

			this.selectedInteraction = this.buildLineInteraction(15);
			Core.Ext.Map.setInteractions([this.selectedInteraction]);

			this.updateButton(this.getView(), btn);
			this.getView().toggle(true);
		},

		buildLineInteraction: function (strokeWidth) {
			var interaction = Interactions.drawLine(
				Core.Ext.Map.getSource(), Core.Ext.Map.getStyle);

			interaction.on("drawstart", this.onDrawStart.bind(this, strokeWidth));
			interaction.on("drawend", this.onDrawEnd.bind(this));
			return interaction;
		},

		onDrawStart: function(strokeWidth, drawEvent) {

			var feature = drawEvent.feature;
			feature.setProperties({
				type: 'sketch',
				strokeWidth: strokeWidth,
				strokeColor: this.drawingColor
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
			}
		},

		lineStyleFunction: function (feature, resolution, selected) {
			if (feature.get('type') !== 'sketch') {
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

			return [style];
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
