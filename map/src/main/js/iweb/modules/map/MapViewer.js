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
define(["ol", "./ZoomLevelIndicator"], function(ol, ZoomLevelIndicator) {

	var Viewer = function(){};

	/**
	 * Returns the modulo of a / b, depending on the sign of b.
	 */
	var modulo = function(a, b) {
	  var r = a % b;
	  return r * b < 0 ? r + b : r;
	};

	var degreesToDM = function(decimalDegrees, opt_fractionDigits){
		var normalizedDegrees = modulo(decimalDegrees + 180, 360) - 180;
		var absDegrees = Math.abs(normalizedDegrees);
		var degrees = Math.floor(absDegrees);
		var minutes = (60 * (absDegrees - degrees));
		if (normalizedDegrees < 0) {
			degrees *= -1;
		}
		return degrees + '\u00b0 '
			+ minutes.toFixed(opt_fractionDigits) + '\u2032';
	};

	Viewer.prototype.setMap = function(containerComponent, lat, lon, zoom){
        /**
         * Create an overlay to anchor the popup to the map.
         */
        this.popupOverlay = new ol.Overlay({ stopEvent: true });

        /***************************************************/
		var el = containerComponent.body.dom;

		this.map = new ol.Map({
			layers: [
				new ol.layer.Tile({
				    source: new ol.source.OSM()
				})
			],
			controls: ol.control.defaults({
				attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
					collapsible: false
				})
			}).extend([
				new ZoomLevelIndicator(),
				new ol.control.MousePosition({
					projection: 'EPSG:4326',
					coordinateFormat: function(coord) {
						if (coord && coord.length) {
							return 'Lon, Lat: '
							 + degreesToDM(coord[0], 4)
							 + ', '
							 + degreesToDM(coord[1], 4);
						}
						return '';
					}
				})
			]),
			target: el,
			overlays: [this.popupOverlay],
			view: new ol.View({
				center: [lat, lon],
				zoom: zoom,

				minZoom: 4,
				maxZoom: 20
			})
	    });


		containerComponent.on('resize', function() {
			this.map.updateSize();
		}, this);
	};

	return Viewer;
});
