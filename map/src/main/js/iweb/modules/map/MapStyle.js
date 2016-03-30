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
define(['ol'], function(ol) {
		/*private String featureid;
		private String version;
		private Usersession usersession;
		private String type;
		private String strokeColor;
		private Double strokeWidth;
		private String fillColor;
		private String dashStyle;
		private Double opacity;
		private Double rotation;
		private boolean gesture = false;
		private String graphic;
		private Double graphicHeight;
		private Double graphicWidth;
		private Boolean hasGraphic;
		private Double labelsize;
		private String labelText;
		private String user;
		private String nickname;
		private String topic;
		private String time;
		private String ip;
		private long seqtime;
		private long seqnum;
		private Integer usersessionid;
		private Date lastupdate;
		private Geometry theGeom;
		private Double pointRadius;
		private String featureattributes;
		
		Types: 
		 label
		 polygon
		 
		 point
		 sketch
		 hexagon
		 circle
		*/
	

		var MapStyle = function() {
			this.defaultStyle = buildDefaultStyle();
			this.styleFunctions = [];
		};
		
		MapStyle.prototype.addStyleFunction = function(styleFunction){
			this.styleFunctions.push(styleFunction);
		};
		
		MapStyle.prototype.getStyle = function(feature, resolution, selected){
			
			var style = null;
			var funcs = this.styleFunctions; 
			for (var i = funcs.length - 1; i >= 0; i--) {
				if (style = funcs[i](feature, resolution, selected)) {
					break;
				}
			}
			
			if (style) {
				return style;
			}
			
			return this.defaultStyle;
		};
		
		MapStyle.prototype.getRGBComponents = function(hexColor){
			var bigint = parseInt(hexColor.replace('#',''), 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;
			return [r, g, b];
		};
		 
	
		
		var buildDefaultStyle = function() {
			var fill = new ol.style.Fill({
				color: 'rgba(255,255,255,0.4)'
			});
			var stroke = new ol.style.Stroke({
				color: '#3399CC',
				width: 1.25
			});
			var styles = [
				new ol.style.Style({
					image: new ol.style.Circle({
						fill: fill,
						stroke: stroke,
						radius: 5
					}),
					fill: fill,
					stroke: stroke
				})
			];
			return styles;
		};
		
		return MapStyle;
	});
