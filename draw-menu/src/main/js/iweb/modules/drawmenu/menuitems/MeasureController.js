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
	return Ext.define("drawmenu.MeasureController", {
		extend: 'Ext.app.ViewController',
		alias: "controller.drawmenu.measurebutton",

		init: function() {
			var defaultTool = this.getView().menu.lookupReference("distance");
			this.updateButton(this.getView(), defaultTool);
			defaultTool.toggle(true, true);
			this.measureMode = "LineString";

			this.wgs84Sphere = new ol.Sphere(6378137);
		},

		updateButton: function(parent, button) {
			parent.setIcon(button.icon);
			parent.setIconCls(button.iconCls);
			parent.setTooltip(button.tooltip);
		},

		onToggle: function(btn, pressed) {
			if (!pressed) {
				this.removeLayer();
				return;
			}

			var interaction = this.buildMeasureInteraction(this.measureMode);
			Core.Ext.Map.setInteractions([interaction]);
		},

		getLayer: function() {
			if (!this.layer) {
				this.layer = new ol.layer.Vector({
					source: new ol.source.Vector()
				});
				Core.Ext.Map.addLayer(this.layer);
			}
			return this.layer;
		},

		removeLayer: function(){
			if (this.layer) {
				Core.Ext.Map.removeLayer(this.layer);
				this.layer.getSource().clear();
				this.layer = null;
			}
		},

		onDistanceClick: function(btn) {
			this.measureMode = "LineString";
			var interaction = this.buildMeasureInteraction(this.measureMode);
			Core.Ext.Map.setInteractions([interaction]);

			this.updateButton(this.getView(), btn);
			this.getView().toggle(true);
		},

		onAreaClick: function(btn) {
			this.measureMode = "Polygon";
			var interaction = this.buildMeasureInteraction(this.measureMode);
			Core.Ext.Map.setInteractions([interaction]);

			this.updateButton(this.getView(), btn);
			this.getView().toggle(true);
		},

		buildMeasureInteraction: function (type) {
			var interaction = new ol.interaction.Draw({
				type: type,
				source: this.getLayer().getSource(),
				style: this.getDefaultMeasureStyle()
			});

			interaction.on("drawstart", this.onDrawStart.bind(this));
			interaction.on("drawend", this.onDrawEnd.bind(this));
			return interaction;
		},

		onDrawStart: function(drawEvent) {
			var feature = drawEvent.feature;
			feature.setProperties({
				type: 'measure'
			});
			feature.setStyle(this.getDefaultMeasureStyle());
			feature.on("change",
				this.onFeatureChange, this);
		},

		onDrawEnd: function (drawEvent) {
			var feature = drawEvent.feature;
			feature.un("change",
				this.onFeatureChange, this);

			var style = feature.getStyle(),
					textFill = style.getText().getFill(),
					strokeStyle = style.getStroke();

			textFill.setColor('rgba(255, 204, 51, 0.8)');
			strokeStyle.setColor('rgba(255, 204, 51, 0.8)');
			strokeStyle.setLineDash(null);
		},

		onFeatureChange: function(evt) {
			var feature = evt.target,
					geom = feature.getGeometry(),
					measure = null;

			if (geom instanceof ol.geom.Polygon) {
				measure = this.formatArea(geom);
			} else if (geom instanceof ol.geom.LineString) {
				measure = this.formatLength(geom);
			}

			if (measure) {
				feature.getStyle().getText().setText(measure);
			}
		},

		formatLength: function(line) {
			var length = 0;
			var sourceProj = Core.Ext.Map.getMap().getView().getProjection();
			var coordinates = line.getCoordinates();
			for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
				var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
				var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
				length += this.wgs84Sphere.haversineDistance(c1, c2);
			}
			var output;
			if (length > 100) {
				output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
			} else {
				output = (Math.round(length * 100) / 100) + ' ' + 'm';
			}
			return output;
		},

		formatArea: function(polygon) {
			var sourceProj = Core.Ext.Map.getMap().getView().getProjection();
			var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
			var coordinates = geom.getLinearRing(0).getCoordinates();
			var area = Math.abs(this.wgs84Sphere.geodesicArea(coordinates));

			var output;
			if (area > 10000) {
				output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km²';
			} else {
				output = (Math.round(area * 100) / 100) + ' ' + 'm²';
			}
			return output;
		},

		getDefaultMeasureStyle: function () {
			return new ol.style.Style({
				text: new ol.style.Text({
					text: "",
					testAlign: 'center',
					fill: new ol.style.Fill({
						color: 'rgb(255, 255, 255)'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgb(0, 0, 0)',
						width: 2
					}),
					scale: 1.5,
					font: '12px arial'
				}),
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 0, 0.5)',
					lineDash: [10, 10],
					width: 3
				}),
				image: new ol.style.Circle({
					radius: 5,
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 0, 0, 0.7)'
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					})
				})
			});
		}
	});

});
