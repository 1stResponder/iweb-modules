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
			var method = (type === "LineString") ?
						Interactions.drawLine : Interactions.drawPolygon;
			var interaction = method(
				this.getLayer().getSource(),
				this.getDefaultMeasureStyle()
			);

			interaction.on("drawstart", this.onDrawStart.bind(this));
			interaction.on("drawend", this.onDrawEnd.bind(this));
			return interaction;
		},

		onDrawStart: function(drawEvent) {
			var feature = drawEvent.feature;
			feature.setProperties({
				type: 'measure'
			});
			feature.setStyle([
				this.getDefaultMeasureStyle(),
				this.getDefaultMeasureTextStyle()
			]);
			feature.on("change",
				this.onFeatureChange, this);
		},

		onDrawEnd: function (drawEvent) {
			var feature = drawEvent.feature;
			feature.un("change",
				this.onFeatureChange, this);

			var styles = feature.getStyle(),
					strokeStyle = styles[0].getStroke(),
					textFill1 = styles[0].getText().getFill(),
					textFill2 = styles[1].getText().getFill();

			var yellowColor = 'rgba(255, 204, 51, 0.8)';
			textFill1.setColor(yellowColor);
			textFill2.setColor(yellowColor);
			strokeStyle.setColor(yellowColor);
			strokeStyle.setLineDash(null);
		},

		onFeatureChange: function(evt) {
			var feature = evt.target,
					geom = feature.getGeometry(),
					measureMetric = null,
					measureImperial = null;

			if (geom instanceof ol.geom.Polygon) {
				var areaSqrMeter = this.calculateArea(geom);
				measureMetric = this.formatAreaMetric(areaSqrMeter);
				measureImperial = this.formatAreaImperial(areaSqrMeter);
			} else if (geom instanceof ol.geom.LineString) {
				var lengthMeter = this.calculateLength(geom);
				measureMetric = this.formatLengthMetric(lengthMeter);
				measureImperial = this.formatLengthImperial(lengthMeter);
			}

			var styles = feature.getStyle();
			if (measureImperial) {
				styles[0].getText().setText(measureImperial);
			}
			
			if (measureMetric) {
				var txt = styles[1].getText();
				txt.setText(measureMetric);
				txt.setOffsetY(18);
			}
		},

		calculateLength: function(line) {
			var lengthMeter = 0;
			var sourceProj = Core.Ext.Map.getMap().getView().getProjection();
			var coordinates = line.getCoordinates();
			for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
				var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
				var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
				lengthMeter += this.wgs84Sphere.haversineDistance(c1, c2);
			}
			return lengthMeter;
		},

		calculateArea: function(polygon) {
			var sourceProj = Core.Ext.Map.getMap().getView().getProjection();
			var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
			var coordinates = geom.getLinearRing(0).getCoordinates();
			return Math.abs(this.wgs84Sphere.geodesicArea(coordinates));
		},

		M_PER_KM: 1000,
		formatLengthMetric: function(lengthMeter) {
			if (lengthMeter > (this.M_PER_KM / 10)) {
				return this.round(lengthMeter / this.M_PER_KM) + ' km';
			} else {
				return this.round(lengthMeter) + ' m';
			}
		},
		
		FEET_PER_METER: 3.28084,
		FEET_PER_MILE: 5280,
		formatLengthImperial: function(lengthMeter){
			var lengthFeet = lengthMeter * this.FEET_PER_METER;
			if (lengthFeet > (this.FEET_PER_MILE / 10)) {
				return this.round(lengthFeet / this.FEET_PER_MILE) + ' mi';
			} else {
				return this.round(lengthFeet) + ' ft';
			}
		},

		SQRM_PER_SQRKM: 1000000,
		formatAreaMetric: function(areaSqrMeter) {
			if (areaSqrMeter > (this.SQRM_PER_SQRKM / 10)) {
				return this.round(areaSqrMeter / this.SQRM_PER_SQRKM) + ' km²';
			} else {
				return this.round(areaSqrMeter) + ' m²';
			}
		},
		
		SQRFEET_PER_SQRMETER: 10.7639,
		SQRFEET_PER_ACRE: 43560,
		formatAreaImperial: function(areaSqrMeter){
			var areaSqrFeet = areaSqrMeter * this.SQRFEET_PER_SQRMETER;
			if (areaSqrFeet > (this.SQRFEET_PER_ACRE / 10)) {
				return this.round(areaSqrFeet / this.SQRFEET_PER_ACRE) + ' acres';
			} else {
				return this.round(areaSqrFeet) + ' ft²';
			}
		},

		round: function(value) {
			return (Math.round(value * 100) / 100);
		},

		getDefaultMeasureStyle: function () {
			return new ol.style.Style({
				text: this.getDefaultTextStyle(),
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
		},
		
		getDefaultMeasureTextStyle: function () {
			return new ol.style.Style({
				text: this.getDefaultTextStyle()
			});
		},
		
		getDefaultTextStyle: function () {
			return new ol.style.Text({
				text: "",
				textAlign: 'center',
				fill: new ol.style.Fill({
					color: 'rgb(255, 255, 255)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgb(0, 0, 0)',
					width: 2
				}),
				scale: 1.5,
				font: '12px arial'
			});
		}
	});

});
