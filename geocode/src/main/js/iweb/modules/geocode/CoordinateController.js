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
define(['ext', 'ol', "iweb/modules/MapModule", "./AbstractController"], 
	function(Ext, ol, MapModule, AbstractController){
	
		return Ext.define('modules.geocode.CoordinateController', {
			extend : 'modules.geocode.AbstractController',
			
			alias: 'controller.geocode.coordinatecontroller',
			
			onSearchClick: function() {
				var coord = this.getView().getCoordinate();
				var descr = this.getView().getFormattedLocation();

				var view = MapModule.getMap().getView();
				
				var point = this.buildPoint(coord, view);
				var feature = this.buildFeature(point, descr);
				this.plotFeature(feature);
				
				view.setCenter(point.getCoordinates());
			},
			
			onLocateCallback: function(feature) {
				feature.setProperties({
					type: 'Geocoded Location'
				});
				
				var view = MapModule.getMap().getView();
				var clone = feature.getGeometry().clone()
					.transform(view.getProjection(), ol.proj.get('EPSG:4326'));
				var coord = clone.getCoordinates();
				this.getView().setCoordinate(coord);
				
				var descr = this.getView().getFormattedLocation();
				feature.set("description", descr);
				
				//turn off our drawing interaction
				var controller = MapModule.getMapController();
				controller.setInteractions(controller.getDefaultInteractions());
			}
		});
});
