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
 define(["./AbstractPanel", './CoordinateController'],
	function(AbstractPanel, CoordinateController) {
	 
	return Ext.define('modules.geocode.DecimalDegreesPanel', {
		extend: 'modules.geocode.AbstractPanel',
		
		controller: 'geocode.coordinatecontroller',
		
		title: 'Decimal Degrees',
		tooltip: 'Decimal Degrees - DDD.DDDDD&deg;',

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
				value: '.',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'decimalLat',
				flex: 1.5
			},{
				xtype: 'displayfield',
				value: '°',
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
				value: '.',
				width: 10
			},{
				xtype: 'textfield',
				reference: 'decimalLng',
				flex: 1.5
			},{
				xtype: 'displayfield',
				value: '°',
				width: 10
			}]
		},{
			html: '<b>Example:</b> 40.72206, -74.00461',
			border: false
		}],
		
		getFormattedLocation: function() {
			return [
			 	this.lookupReference('degreesLat').getValue(),
			 	'.',
			 	this.lookupReference('decimalLat').getValue(),
			 	'° ', 
			 	this.lookupReference('degreesLng').getValue(),
			 	'.',
			 	this.lookupReference('decimalLng').getValue(),
			 	'°'
			 ].join('');
		},
		
		getCoordinate: function() {
			var deglat = this.lookupReference('degreesLat').getValue();
			var declat = this.lookupReference('decimalLat').getValue();
			var lat = this.toDecimalDegrees(deglat, declat);
			
			var deglng = this.lookupReference('degreesLng').getValue();
			var declng = this.lookupReference('decimalLng').getValue();
			var lng = this.toDecimalDegrees(deglng, declng);
			return [lng, lat];
		},

		setCoordinate: function(coord) {
			var lng = coord[0].toString();
			var lngidx = lng.indexOf('.');
			this.lookupReference('degreesLng').setValue(lng.substring(0, lngidx));
			this.lookupReference('decimalLng').setValue(lng.substring(lngidx + 1));
			
			var lat = coord[1].toString();
			var latidx = lat.indexOf('.');
			this.lookupReference('degreesLat').setValue(lat.substring(0, latidx));
			this.lookupReference('decimalLat').setValue(lat.substring(latidx + 1));
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
