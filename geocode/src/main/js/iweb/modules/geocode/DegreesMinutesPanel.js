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
 define(["./AbstractPanel", './CoordinateController'],
	function(AbstractPanel, CoordinateController) {
	 
	return Ext.define('modules.geocode.DegreesMinutesPanel', {
		extend: 'modules.geocode.AbstractPanel',
		
		controller: 'geocode.coordinatecontroller',
		
		title: 'Degrees, Decimal Minutes',
		tooltip: 'Degrees and Decimal Minutes - DDD&deg; MM.MMM\'',

		defaults: {
			labelWidth: 70
		},
		
		items:[{
			xtype: 'fieldcontainer',
			fieldLabel: 'Latitude',
			combineErrors: true,
			msgTarget : 'side',
			layout: 'hbox',
			reference: 'latitudeGroup',
			
			defaults: {
				hideLabel: true,
				
				maskRe: /[0-9\-]/,
				stripCharsRe: /[^0-9\-]/,
				
				style: {
					textAlign: 'center'
				}
			},
			items: [{
				xtype: 'textfield',
				reference: 'degreesLat',
				flex: 1
			},{
				xtype: 'displayfield',
				value: '°',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'minutesLat',
				flex: 1
			},{
				xtype: 'displayfield',
				value: '.',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'decimalLat',
				flex: 1.5
			},{
				xtype: 'displayfield',
				value: '\'',
				width: 10
			}]
		},{
			xtype: 'fieldcontainer',
			fieldLabel: 'Longitude',
			combineErrors: true,
			msgTarget : 'side',
			layout: 'hbox',
			reference: 'longitudeGroup',
			
			defaults: {
				hideLabel: true,
				
				maskRe: /[0-9\-]/,
				stripCharsRe: /[^0-9\-]/,
				
				style: {
					textAlign: 'center'
				}
			},
			items: [{
				xtype: 'textfield',
				reference: 'degreesLng',
				flex: 1
			},{
				xtype: 'displayfield',
				value: '°',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'minutesLng',
				flex: 1
			},{
				xtype: 'displayfield',
				value: '.',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'decimalLng',
				flex: 1.5
			},{
				xtype: 'displayfield',
				value: '\'',
				width: 10
			}]
		},{
			html: '<b>Example:</b> 41° 9.13\', -78° 34.15\'',
			border: false
		}],
		
		getFormattedLocation: function() {
			return [
			 	this.lookupReference('degreesLat').getValue(),
			 	'°',
			 	this.lookupReference('minutesLat').getValue(),
			 	'.',
			 	this.lookupReference('decimalLat').getValue(),
			 	'\' ',
			 	this.lookupReference('degreesLng').getValue(),
			 	'°',
			 	this.lookupReference('minutesLng').getValue(),
			 	'.',
			 	this.lookupReference('decimalLng').getValue(),
			 	'\'',
			 ].join('');
		},
		
		getCoordinate: function() {
			var deglat = this.lookupReference('degreesLat').getValue();
			var minlat = this.lookupReference('minutesLat').getValue();
			var declat = this.lookupReference('decimalLat').getValue();
			var mindeclat = this.toDecimalDegrees(minlat, declat);
			var lat = parseInt(deglat, 10);
			if (lat < 0) {
				lat -= mindeclat / 60;	
			} else {
				lat += mindeclat / 60;	
			}
			
			
			var deglng = this.lookupReference('degreesLng').getValue();
			var minlng = this.lookupReference('minutesLng').getValue();
			var declng = this.lookupReference('decimalLng').getValue();
			var mindeclng = this.toDecimalDegrees(minlng, declng);
			var lng = parseInt(deglng, 10);
			if (lng < 0) {
				lng -= mindeclng / 60;	
			} else {
				lng += mindeclng / 60;	
			}
			
			return [lng, lat];
		},

		setCoordinate: function(coord) {
			var lng = coord[0];
			var neglng = 1;
			if (lng < 0) {
				lng *= -1;
				neglng = -1;
			}
			var deglng = Math.floor(lng);
			var minlng = 60 * (lng - deglng);
			var minlngstr = minlng.toString();
			var lngidx = minlngstr.indexOf('.');
			this.lookupReference('degreesLng').setValue(neglng * deglng);
			this.lookupReference('minutesLng').setValue(minlngstr.substring(0, lngidx));
			this.lookupReference('decimalLng').setValue(minlngstr.substring(lngidx + 1));
			
			
			var lat = coord[1];
			var neglat = 1;
			if (lat < 0) {
				lat *= -1;
				neglat = -1;
			}
			var deglat = Math.floor(lat);
			var minlat = 60 * (lat - deglat);
			var minlatstr = minlat.toString();
			var latidx = minlatstr.indexOf(".");
			this.lookupReference('degreesLat').setValue(neglat * deglat);
			this.lookupReference('minutesLat').setValue(minlatstr.substring(0, latidx));
			this.lookupReference('decimalLat').setValue(minlatstr.substring(latidx + 1));
		},
		
		toDecimalDegrees: function(degreesStr, decimalsStr) {
			var deg = parseInt(degreesStr, 10);
			var dec = parseFloat("0." + decimalsStr);
			
			if (deg < 0) {
				return deg - dec;
			}
			return deg + dec;
		}
	});
});
