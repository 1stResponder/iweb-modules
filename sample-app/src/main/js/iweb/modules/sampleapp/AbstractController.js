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
define(['ext', 'ol', "iweb/modules/MapModule", "iweb/modules/drawmenu/Interactions"], 
	function(Ext, ol, MapModule, Interactions){
	
		//a shared activeLayer
		var activeLayer;
	
		return Ext.define('modules.sample-app.AbstractController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.sampleapp.abstractcontroller',
			
			onWindowClose: function() {
				this.removeLayer();
				this.cancelTool();
			},
			
			onDeactivate: function() {
				this.removeLayer();
				this.untoggleDraw();
				//this.resetTool();
			},
			
			
			
			untoggleDraw: function() {
				this.lookupReference('DrawButton').toggle(false);
			},
			
			
			
			buildStyle: function() {
				return new ol.style.Style({
					image: new ol.style.Circle({
						radius: 7,
						fill: new ol.style.Fill({
							color: 'rgba(255, 204, 51, 0.8)'
						}),
						stroke: new ol.style.Stroke({
							color: 'black',
							width: 1
						}),
					})
				})
			},
			clearTool: function() {
				this.activeLayer.getSource().clear();
			},
			resetTool: function() {
				MapModule.getMapController().setInteractions([this.activeInteraction]);
				
			},
			getLayer: function() {
				if (!activeLayer) {
					activeLayer = new ol.layer.Vector({
						source: new ol.source.Vector(),
						style: this.buildStyle()
					});
					MapModule.getMapController().addLayer(activeLayer);
				}
				return activeLayer;
			},
			
			plotFeature: function(feature){
				this.getLayer().getSource().addFeature(feature);
			},
			getStyle: function(featureText) {
				var styles = this.createStyles(featureText);
				return function(feature, resolution) {
					return styles[feature.getGeometry().getType()];
				};
			},
			
			createStyles : function(featureText){
				var styles = {};
				
				styles["Point"] =
				[new ol.style.Style({
					image: new ol.style.Circle({
						fill: new ol.style.Fill({
							color: 'rgba(255,255,255,0.4)'
						}),
						stroke: new ol.style.Stroke({
							color: 'rgba(255, 204, 51, 1)',
							width: 1.25
						}),
						radius: 5
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255,255,255,0.4)'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(255, 204, 51, 1)',
						width: 1.25
					})
				})];
				
				styles["Polygon"] = styles["LineString"]
				= [new ol.style.Style({
					text: new ol.style.Text({
						text: featureText,
						scale: 1.5,
						stroke: new ol.style.Stroke({
							color: "rgba( 255, 204, 51, 0.6)",
							width: 2
						}),
						fill: new ol.style.Fill({
							color: "rgba(0, 0, 0, 0.8)"
						})
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(255, 204, 51, 0.8)',
						lineDash: [10, 10],
						width: 3
					})
				})];
				
				return styles;
			},
			cancelTool: function() {
				if (this.activeInteraction) {
					//switch back to the default interactions
					var controller = MapModule.getMapController();
					controller.setInteractions(controller.getDefaultInteractions());
										
					this.activeInteraction = null;
				}
				
				this.removeLayer();
				
				
			},
			removeLayer: function() {
				if (activeLayer) {
					MapModule.getMapController().removeLayer(activeLayer);
					activeLayer = null;
				}
			}
		});
});
