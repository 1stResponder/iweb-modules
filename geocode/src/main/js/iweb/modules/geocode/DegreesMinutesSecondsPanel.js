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
	 
	return Ext.define('modules.geocode.DegreesMinutesSecondsPanel', {
		extend: 'modules.geocode.AbstractPanel',
		
		controller: 'geocode.coordinatecontroller',
		
		title: 'Degrees, Minutes, Seconds',
		tooltip: 'Degrees, Minutes, and Seconds - DDD&deg; MM\' SS.S"',

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
				value: '\'',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'secondsLat',
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
				value: '"',
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
				value: '\'',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'secondsLng',
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
				value: '"',
				width: 10
			}]
		},{
			html: '<b>Example:</b> 41° 59\' 52.03", -122° 38\' 7.41"',
			border: false
		}],
		
		getFormattedLocation: function() {
			return [
			 	this.lookupReference('degreesLat').getValue(),
			 	'°',
			 	this.lookupReference('minutesLat').getValue(),
			 	'\'',
			 	this.lookupReference('secondsLat').getValue(),
			 	'.',
			 	this.lookupReference('decimalLat').getValue(),
			 	'" ',
			 	this.lookupReference('degreesLng').getValue(),
			 	'°',
			 	this.lookupReference('minutesLng').getValue(),
			 	'\'',
			 	this.lookupReference('secondsLng').getValue(),
			 	'.',
			 	this.lookupReference('decimalLng').getValue(),
			 	'"',
			 ].join('');
		},
		
		getCoordinate: function() {
			var deglat = this.lookupReference('degreesLat').getValue();
			var minlat = this.lookupReference('minutesLat').getValue();
			var seclat = this.lookupReference('secondsLat').getValue();
			var declat = this.lookupReference('decimalLat').getValue();
			var secdeclat = this.toDecimalDegrees(seclat, declat);
			var lat = parseInt(deglat, 10);
			var neglat = 1;
			if (lat < 0) {
				lat *= -1;
				neglat = -1;	
			}
			lat += parseInt(minlat, 10) / 60;
			lat += secdeclat / 3600;
			lat *= neglat;
			
			
			var deglng = this.lookupReference('degreesLng').getValue();
			var minlng = this.lookupReference('minutesLng').getValue();
			var seclng = this.lookupReference('secondsLng').getValue();
			var declng = this.lookupReference('decimalLng').getValue();
			var secdeclng = this.toDecimalDegrees(seclng, declng);
			var lng = parseInt(deglng, 10);
			var neglat = 1;
			if (lng < 0) {
				lng *= -1;
				neglng = -1;	
			}
			lng += parseInt(minlng, 10) / 60;
			lng += secdeclng / 3600;
			lng *= neglng;
			
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
			var minlng = Math.floor(60 * (lng - deglng));
			var seclng = 3600 * ((lng - deglng) - minlng / 60);
			var seclngstr = seclng.toString();
			var lngidx = seclngstr.indexOf('.');
			this.lookupReference('degreesLng').setValue(neglng * deglng);
			this.lookupReference('minutesLng').setValue(minlng);
			this.lookupReference('secondsLng').setValue(seclngstr.substring(0, lngidx));
			this.lookupReference('decimalLng').setValue(seclngstr.substring(lngidx + 1));
			
			
			var lat = coord[1];
			var neglat = 1;
			if (lat < 0) {
				lat *= -1;
				neglat = -1;
			}
			var deglat = Math.floor(lat);
			var minlat = Math.floor(60 * (lat - deglat));
			var seclat = 3600 * ((lat - deglat) - minlat / 60);
			var seclatstr = seclat.toString();
			var latidx = seclatstr.indexOf('.');
			this.lookupReference('degreesLat').setValue(neglat * deglat);
			this.lookupReference('minutesLat').setValue(minlat);
			this.lookupReference('secondsLat').setValue(seclatstr.substring(0, latidx));
			this.lookupReference('decimalLat').setValue(seclatstr.substring(latidx + 1));
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
