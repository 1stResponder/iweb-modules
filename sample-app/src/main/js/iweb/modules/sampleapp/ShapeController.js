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
define(['ext', 'ol', "iweb/modules/MapModule", "./AbstractController", "iweb/modules/drawmenu/Interactions" ], 
	function(Ext, ol, MapModule, AbstractController, Interactions){
	
	
		return Ext.define('modules.sample-app.ShapeController', {
			extend : 'modules.sample-app.AbstractController',
			
			alias: 'controller.sampleapp.shapecontroller',
			wgs84Sphere:  new ol.Sphere(6378137),
			onClearClick: function(btn) {
				var requestForm = this.getView().lookupReference('shapeRequestForm');
				requestForm.reset();
				this.clearTool();
				
			},
			onResetClick: function(btn) {
				this.getView().lookupReference('shapeRequestForm').reset();
				this.resetTool();
				
			},
			onDrawClick: function(btn, state) {
				if (!state) {
					MapModule.getMapController().setInteractions(this.previousInteractions);
					return;
				}
				
				this.previousInteractions = MapModule.getMapController().getInteractions();
				
				this.getView().lookupReference('shapeRequestForm').reset();
				this.cancelTool();
				
				var style = this.getStyle('Shape Region');
				var title = 'Shape Application';
				this.buildInteraction(style, this.onDrawShape.bind(this));
				
			},
			/**
			 * Callback when a user finishes drawing a polygon region for the UTM application 
			 */
			onDrawShape: function(drawEvent) {
				var feature = drawEvent.feature;
				this.plotFeature(feature);
				var linearRing = feature.getGeometry().getLinearRing(0).clone();
				//TODO: get projection from map / controller?
				linearRing.transform("EPSG:3857", "EPSG:4326");
				//If you need to limit the overall area of the shape
				var sqMetersArea = this.wgs84Sphere.geodesicArea(linearRing.getCoordinates());
				var sqMilesArea = sqMetersArea / 2589988;
				if (sqMilesArea > 1000) {
					var msg = Ext.String.format(
							"Please select an area less than 1000 square miles (current area: {0} square miles)",
							sqMilesArea.toFixed(2)); 
					Ext.MessageBox.alert("Sample Shape Applcation", msg, this.clearTool, this);
					return;
				}
				
				//NASA service expects coords in lon/lat order
				var fmtdCoords = linearRing.getCoordinates().map(function(coords){
					return ol.coordinate.format(coords, "{x},{y}", 14);
				});
				var coordParam = fmtdCoords.join("],[");
				var requestForm = this.getView().lookupReference('shapeRequestForm');
				var flightGeography = "{type:Polygon,coordinates:[["+ coordParam + "]]}";
				//alert("{type:Polygon,coordinates:[["+ coordParam + "]]}");
				requestForm.getForm().findField("shapeGeography").setValue("{type:Polygon,coordinates:[["+ coordParam + "]]}");
					},
			
			/**
			 * Build the map interaction to handle polygon drawing
			 */
			buildInteraction: function(style, callback) {
				this.activeLayer = this.getLayer();
				
				
				this.activeInteraction = Interactions.drawPolygon(this.activeLayer.getSource(), style);
				this.activeInteraction.on("drawstart", this.clearTool.bind(this));
				this.activeInteraction.on("drawend", callback);
				var controller = MapModule.getMapController();
				controller.setInteractions([this.activeInteraction]);
				
				
			},
			/**
			 * Cleanup the interaction and window
			 */
			
			onWindowClose: function() {
				this.cancelTool();
			}
			
			
		});
});
