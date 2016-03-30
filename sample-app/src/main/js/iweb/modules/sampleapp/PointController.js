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
define(['ext',  'ol', "iweb/modules/MapModule", "./AbstractController", "iweb/modules/drawmenu/Interactions" ], 
	function(Ext, ol, MapModule, AbstractController, Interactions){
	
		return Ext.define('modules.sample-app.PointController', {
			extend : 'modules.sample-app.AbstractController',
			
			alias: 'controller.sampleapp.pointcontroller',
			
			
			onDrawClick: function(btn, state) {
				if (!state) {
					MapModule.getMapController().setInteractions(this.previousInteractions);
					return;
				}
					
				this.previousInteractions = MapModule.getMapController().getInteractions();
					
				this.getView().lookupReference('pointRequestForm').reset();
				this.cancelTool();
					
				var style = this.getStyle('Point')
				var title = 'Point Application';
				this.buildInteraction(style, this.onDrawPoint.bind(this));
					
				},
				onDrawPoint: function(drawEvent) {
					
					
					this.untoggleDraw();
					
					if (this.onLocateCallback) {
						this.onLocateCallback(drawEvent.feature);
					}
					var feature = drawEvent.feature;
					//Return  coords in lon/lat order
					var rawCoords = feature.getGeometry().getCoordinates();
					var coords = ol.proj.transform(rawCoords, "EPSG:3857", "EPSG:4326");
					var fmtCoords= ol.coordinate.format(coords, "{x},{y}",4);
					
					this.plotFeature(feature);
					var requestForm = this.getView().lookupReference('pointRequestForm');
					requestForm.getForm().findField("pointGeography").setValue(fmtCoords);
					},
				/**
				 * Build the map interaction to handle polygon drawing
				 */
				buildInteraction: function(style, callback) {
					this.activeLayer = this.getLayer();			
					this.activeInteraction = Interactions.drawPoint(this.activeLayer.getSource(), style);
						
					//this.activeInteraction.on("drawstart", this.clearTool.bind(this));
					this.activeInteraction.on("drawend", callback);
					var controller = MapModule.getMapController();
					controller.setInteractions([this.activeInteraction]);			
				},
				
			
		});
});
